use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, init, near_bindgen, AccountId, Promise};

mod models;
use models::{Article, ArticleMeta, Rating, RatingAction, ONE_NEAR};

#[cfg(test)]
use models::ParsedReceipt;

mod utils;
use utils::f32_to_ynear;

mod constants;
use constants::ERR_ARTICLE_NOT_FOUND;

// the upvote/downvote ratio, below which the article is hidden away (#12)
const ARTICLE_VISIBILITY_VOTING_RATIO: f64 = 3.0 / 7.0;

// sane constraints for donation amount
const MIN_DONATION_AMOUNT: u128 = f32_to_ynear(1.0); // 1 $NEAR in yoctoNEAR
const MAX_DONATION_AMOUNT: u128 = f32_to_ynear(100.0); // 100 $NEAR in yoctoNEAR

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Wiki {
    meta: UnorderedMap<u64, ArticleMeta>,
    corpus: UnorderedMap<u64, String>,
    ratings: UnorderedMap<u64, Rating>,
}

impl Default for Wiki {
    #[init]
    fn default() -> Self {
        Self {
            meta: UnorderedMap::new(b"meta".to_vec()),
            corpus: UnorderedMap::new(b"corpus".to_vec()),
            ratings: UnorderedMap::new(b"ratings".to_vec()),
        }
    }
}

#[near_bindgen]
impl Wiki {
    pub fn reset(&mut self) {
        self.meta.clear();
        self.corpus.clear();
    }

    // Get an article
    pub fn get_article(&self, article_id: u64) -> Article {
        let meta = self.meta.get(&article_id).unwrap_or(ArticleMeta {
            title: String::from("Not found"),
            author: String::from("Not found"),
            editors: vec![],
            published_date: 0,
        });

        let content = self
            .corpus
            .get(&article_id)
            .unwrap_or_else(|| String::from("Content not available"));

        let rating = self.ratings.get(&article_id).unwrap_or_default();

        Article {
            id: article_id,
            title: meta.title,
            content,
            author: meta.author,
            published_date: meta.published_date,
            upvote: rating.upvote,
            downvote: rating.downvote,
        }
    }

    fn panic_on_nonexistent_article(&self, article_id: u64) {
        let meta = self.meta.get(&article_id);
        if meta.is_none() {
            env::panic(ERR_ARTICLE_NOT_FOUND.as_bytes());
        }
    }

    // Get a list of articles
    pub fn get_articles(&self) -> Vec<(u64, ArticleMeta)> {
        #[cfg(test)]
        println!("\ninvoking `get_articles`...");

        let mut articles = self.meta.to_vec();
        articles.retain(|rec| {
            let (id, _) = rec;
            let ratings = self.ratings.get(id).unwrap_or(Rating {
                upvote: 0,
                downvote: 0,
            });
            let mut ups = ratings.upvote;
            let mut downs = ratings.downvote;

            // prevent the "division by 0" case
            if downs == 0 {
                ups += 1;
                downs += 1;
            }

            let ratio: f64 = ups as f64 / downs as f64;

            #[cfg(test)]
            println!(
                "record {:?}: up {:?}, down {:?}, ratio {:.2}, threshold {:.2}",
                id, ups, downs, ratio, ARTICLE_VISIBILITY_VOTING_RATIO
            );

            ratio.gt(&ARTICLE_VISIBILITY_VOTING_RATIO)
        });

        #[cfg(test)]
        println!("done invoking `get_articles`\n");

        articles
    }

    // Create a new article for 2 NEARs
    #[payable]
    pub fn create_article(&mut self, title: String, content: String) -> u64 {
        if env::attached_deposit() < 2 * ONE_NEAR {
            env::panic("Not enough fund to create article".as_bytes());
        }

        let author = env::signer_account_id();
        let editor = author.clone();
        let published_date = env::block_timestamp();

        env::log(format!("Article created at {}", published_date).as_bytes());

        let article_id = self.corpus.len();

        let meta = ArticleMeta {
            title,
            author,
            editors: vec![editor],
            published_date,
        };

        self.meta.insert(&article_id, &meta);
        self.corpus.insert(&article_id, &content);

        article_id
    }

    // Edit an existing article for 0.5 NEARs
    #[payable]
    pub fn update_article(&mut self, article_id: u64, content: String) {
        if env::attached_deposit() < ONE_NEAR / 2 {
            env::panic("Not enough fund to update article".as_bytes());
        }

        let editor = env::signer_account_id();

        match self.corpus.get(&article_id) {
            Some(_) => {
                let mut meta = self.meta.get(&article_id).unwrap();
                meta.editors.push(editor);
                self.corpus.insert(&article_id, &content);
                self.meta.insert(&article_id, &meta);
            }
            None => env::panic(ERR_ARTICLE_NOT_FOUND.as_bytes()),
        }
    }

    // Upvote or download an article
    fn rate(&mut self, article_id: u64, action: RatingAction) {
        self.panic_on_nonexistent_article(article_id);

        let mut rating = self.ratings.get(&article_id).unwrap_or(Rating {
            upvote: 0,
            downvote: 0,
        });
        match action {
            RatingAction::Upvote => rating.upvote += 1,
            RatingAction::Downvote => rating.downvote += 1,
        }

        self.ratings.insert(&article_id, &rating);
    }

    pub fn upvote(&mut self, article_id: u64) {
        self.rate(article_id, RatingAction::Upvote)
    }

    pub fn downvote(&mut self, article_id: u64) {
        self.rate(article_id, RatingAction::Downvote)
    }

    /*
     * Donate to an article
     * @TODO determine the better practice between explicitly setting `donation_amt`
     * as a contract method argument, and implicitly deriving it from `env::attached_deposit()`
     */
    #[payable]
    pub fn donate(&mut self, article_id: u64) -> Promise {
        self.panic_on_nonexistent_article(article_id);

        let donation_amt: u128 = env::attached_deposit();

        if donation_amt.lt(&MIN_DONATION_AMOUNT) {
            env::panic(
                format!(
                    "Donation amount cannot be less than {:?}",
                    MIN_DONATION_AMOUNT
                )
                .as_bytes(),
            );
        }
        if donation_amt.gt(&MAX_DONATION_AMOUNT) {
            env::panic(
                format!(
                    "Donation amount cannot be greater than {:?}",
                    MAX_DONATION_AMOUNT
                )
                .as_bytes(),
            );
        }

        let meta = self.meta.get(&article_id).unwrap();
        let author_id = meta.author;

        // @TODO define the business logic where donation amount is split among the author and
        // contributors; see discussion https://github.com/nlhkh/blockipedia-near/discussions/39
        let account_id: AccountId = author_id.parse().unwrap();
        return Promise::new(account_id).transfer(donation_amt);
    }
}

#[cfg(not(target_arch = "wasm32"))]
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::get_created_receipts;
    use near_sdk::{testing_env, MockedBlockchain, VMContext};

    fn get_context(input: Vec<u8>, is_view: bool, deposit: u128) -> VMContext {
        // see more at https://docs.rs/near-sdk/latest/near_sdk/struct.VMContext.html
        VMContext {
            current_account_id: "blockipedia.localnet".to_string(),
            signer_account_id: "user.localnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "user.localnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: ONE_NEAR * 10,
            account_locked_balance: ONE_NEAR * 10,
            storage_usage: 0,
            attached_deposit: deposit,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn create_an_article() {
        let context = get_context(vec![], false, 2 * ONE_NEAR);
        testing_env!(context);

        let mut contract = Wiki::default();

        let article1_id = contract.create_article(
            String::from("Test article"),
            String::from("This is a content of a test article."),
        );
        let article2_id = contract.create_article(
            String::from("Test article 2"),
            String::from("This is a content of another test article."),
        );

        let article1 = contract.get_article(article1_id);

        // Article ids should be correct
        assert_eq!(article1_id, 0, "First article should have id 0.");
        assert_eq!(article2_id, 1, "Second article should have id 1.");

        // Article created with correct data
        assert_eq!(
            article1.title,
            String::from("Test article"),
            "Incorrect title"
        );
        assert_eq!(
            article1.content,
            String::from("This is a content of a test article."),
            "Incorrect content"
        );
        assert_eq!(article1.id, article1_id, "Incorrect article id");
        assert_eq!(
            article1.published_date,
            env::block_timestamp(),
            "Incorrect published date"
        );
        assert_eq!(article1.author, "user.localnet", "Incorrect author");
    }

    #[test]
    fn get_articles() {
        let context = get_context(vec![], false, 10 * ONE_NEAR);
        testing_env!(context);

        //----------------------------------------------------------
        // should return all articles if non of them has any rating

        let mut contract = Wiki::default();
        let mut articles = contract.get_articles();
        assert_eq!(articles.len(), 0, "Initial number of articles must be zero");

        contract.create_article(
            String::from("Test article 1"),
            String::from("This is a content of the test article 1."),
        );
        articles = contract.get_articles();
        assert_eq!(
            articles.len(),
            1,
            "Number of articles must be 1 after creating one article"
        );

        contract.create_article(
            String::from("Test article 2"),
            String::from("This is a content of the test article 2."),
        );
        contract.create_article(
            String::from("Test article 3"),
            String::from("This is a content of the test article 3."),
        );
        articles = contract.get_articles();
        assert_eq!(
            articles.len(),
            3,
            "Number of articles must be 3 after creating three articles"
        );

        dbg!(articles.len(), articles);

        //-------------------------------------------------------------------
        // should return only articles with the desired upvote/downvote ratio

        // 3 upvotes
        for _ in 0..3 {
            contract.upvote(1);
        }

        // 7 downvotes
        for _ in 0..7 {
            contract.downvote(1);
        }

        articles = contract.get_articles();
        assert_eq!(
            articles.len(),
            2,
            "Number of articles must be 2 after 1 article is downvoted too much"
        );

        contract.upvote(1);
        articles = contract.get_articles();
        assert_eq!(articles.len(), 3, "Number of articles must be 3 again after the hidden article achieves the desirable voting ratio");
    }

    #[test]
    #[should_panic(expected = "Not enough fund to create article")]
    fn create_article_with_insufficient_fund() {
        let context = get_context(vec![], false, ONE_NEAR);
        testing_env!(context);

        let mut contract = Wiki::default();

        contract.create_article(
            String::from("Test article"),
            String::from("This is a content of a test article."),
        );
    }

    #[test]
    fn update_article() {
        let context = get_context(vec![], false, ONE_NEAR * 3);
        testing_env!(context);

        let mut contract = Wiki::default();

        let id = contract.create_article(String::from("Title"), String::from("Some content"));

        contract.update_article(id, String::from("This is the updated content."));

        let article = contract.get_article(id);

        assert_eq!(
            article.content,
            String::from("This is the updated content.")
        );
    }

    #[test]
    #[should_panic(expected = "Not enough fund to update article")]
    fn update_article_with_insufficient_fund() {
        let context = get_context(vec![], false, ONE_NEAR / 2 - 1);
        testing_env!(context);

        let mut contract = Wiki::default();

        contract.update_article(0, String::from("This is the updated content."));
    }

    #[test]
    #[should_panic(expected = "Article not found")]
    fn panic_on_nonexistent_article() {
        let context = get_context(vec![], true, 0);
        testing_env!(context);
        let contract = Wiki::default();
        contract.panic_on_nonexistent_article(0);
    }

    #[test]
    #[should_panic(expected = "Article not found")]
    fn update_nonexistent_article() {
        let context = get_context(vec![], false, ONE_NEAR * 3);
        testing_env!(context);

        let mut contract = Wiki::default();

        contract.update_article(0, String::from("This is the updated content."));
    }

    #[test]
    #[should_panic(expected = "Article not found")]
    fn do_upvote_on_nonexistent_article() {
        let context = get_context(vec![], true, 0);
        testing_env!(context);
        let mut contract = Wiki::default();
        contract.upvote(0);
    }

    #[test]
    #[should_panic(expected = "Article not found")]
    fn do_downvote_on_nonexistent_article() {
        let context = get_context(vec![], true, 0);
        testing_env!(context);
        let mut contract = Wiki::default();
        contract.downvote(0);
    }

    #[test]
    fn do_upvote_on_existing_article() {
        let context = get_context(vec![], false, ONE_NEAR * 2);
        testing_env!(context);
        let mut contract = Wiki::default();
        let id = contract.create_article(String::from("Title"), String::from("Content"));
        contract.upvote(id);
        let ratings = contract.ratings.get(&id).unwrap();
        assert_eq!(ratings.upvote, 1);
    }

    #[test]
    fn do_downvote_on_existent_article() {
        let context = get_context(vec![], false, ONE_NEAR * 2);
        testing_env!(context);
        let mut contract = Wiki::default();
        let id = contract.create_article(String::from("Title"), String::from("Content"));
        contract.downvote(id);
        let ratings = contract.ratings.get(&id).unwrap();
        assert_eq!(ratings.downvote, 1);
    }

    #[test]
    #[should_panic(expected = "Article not found")]
    fn donate_to_nonexistent_article() {
        let context = get_context(vec![], false, ONE_NEAR * 2);
        testing_env!(context);
        let mut contract = Wiki::default();
        contract.donate(0);
    }

    #[test]
    #[should_panic(expected = "Donation amount cannot be less than")]
    fn donate_too_little_to_article() {
        let context = get_context(vec![], false, ONE_NEAR * 2);
        testing_env!(context);
        let mut contract = Wiki::default();
        let id = contract.create_article(String::from("Title"), String::from("Content"));

        let context = get_context(vec![], false, 999_000_000_000_000_000_000_000); // 0.999 $NEAR
        testing_env!(context);
        contract.donate(id);
    }

    #[test]
    #[should_panic(expected = "Donation amount cannot be greater than")]
    fn donate_too_much_to_article() {
        let context = get_context(vec![], false, ONE_NEAR * 2);
        testing_env!(context);
        let mut contract = Wiki::default();
        let id = contract.create_article(String::from("Title"), String::from("Content"));

        let context = get_context(vec![], false, 100_010_000_000_000_000_000_000_000); // 100.01 $NEAR
        testing_env!(context);
        contract.donate(id);
    }

    #[test]
    fn donate_successfully_to_article() {
        let context = get_context(vec![], false, ONE_NEAR * 2);
        testing_env!(context);
        let mut contract = Wiki::default();
        let id = contract.create_article(String::from("Title"), String::from("Content"));

        let context = get_context(vec![], false, ONE_NEAR * 3 / 2);
        testing_env!(context);
        contract.donate(id);

        let mut receipts = get_created_receipts();
        receipts.retain(|r| {
            let raw_receipt = serde_json::value::to_raw_value(&r).unwrap();
            let raw_receipt_str = raw_receipt.get();
            let parsed_receipt: Result<ParsedReceipt, _> = serde_json::from_str(raw_receipt_str);
            dbg!(&parsed_receipt);
            let obj = parsed_receipt.unwrap();
            return obj.receiver_id == "user.localnet"
                && obj.actions[0].Transfer.deposit == ONE_NEAR * 3 / 2;
        });
        assert_eq!(receipts.len(), 1);
    }
}
