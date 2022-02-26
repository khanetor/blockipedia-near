use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, near_bindgen, Promise};

mod models;
use models::{Article, ArticleMeta, Rating, RatingAction};

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Wiki {
    meta: UnorderedMap<u64, ArticleMeta>,
    corpus: UnorderedMap<u64, String>,
    ratings: UnorderedMap<u64, Rating>,
}

impl Default for Wiki {
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
            .unwrap_or(String::from("Content not available"));

        let rating = self.ratings.get(&article_id).unwrap_or(Rating::default());

        return Article {
            id: article_id,
            title: meta.title,
            content: content,
            author: meta.author,
            published_date: meta.published_date,
            upvote: rating.upvote,
            download: rating.downvote,
        };
    }

    // Get a list of articles
    pub fn get_articles(&self) -> Vec<(u64, ArticleMeta)> {
        return self.meta.to_vec();
    }

    // Create a new article for 2 NEARs
    #[payable]
    pub fn create_article(&mut self, title: String, content: String) -> u64 {
        if env::attached_deposit() < 2 {
            env::panic("Not enough fund to create article".as_bytes());
        }

        let author = env::signer_account_id();
        let editor = author.clone();
        let published_date = env::block_timestamp();

        env::log(format!("Article created at {}", published_date).as_bytes());

        let article_id = self.corpus.len();

        let meta = ArticleMeta {
            title: title,
            author: author,
            editors: vec![editor],
            published_date: published_date,
        };

        // pay
        Promise::new(env::current_account_id()).transfer(2);

        self.meta.insert(&article_id, &meta);
        self.corpus.insert(&article_id, &content);

        return article_id;
    }

    // Edit an existing article for 0.5 NEARs
    #[payable]
    pub fn update_article(&mut self, article_id: u64, content: String) {
        // Should panic when not enough fund

        let editor = env::current_account_id();

        match self.corpus.get(&article_id) {
            Some(_) => {
                let mut meta = self.meta.get(&article_id).unwrap();
                meta.editors.push(editor);
                self.corpus.insert(&article_id, &content);
                self.meta.insert(&article_id, &meta);
            }
            None => env::log("Article not found".as_bytes()),
        }
    }

    // Upvote or download an article
    fn rate(&mut self, article_id: u64, action: RatingAction) {
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

    // Donate to an article
}

#[cfg(not(target_arch = "wasm32"))]
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::{testing_env, MockedBlockchain, VMContext};

    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "robert.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "jane.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 1000,
            account_locked_balance: 10,
            storage_usage: 0,
            attached_deposit: 5,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }
    #[test]
    fn create_an_article() {
        let context = get_context(vec![], false);
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
        assert_eq!(article1.title, String::from("Test article"), "Incorrect title");
        assert_eq!(
            article1.content,
            String::from("This is a content of a test article."),
            "Incorrect content"
        );
        assert_eq!(article1.id, article1_id, "Incorrect article id");
        assert_eq!(article1.published_date, env::block_timestamp(), "Incorrect published date");
        assert_eq!(article1.author, "robert.testnet", "Incorrect author");

        // Account should be charged
        assert_eq!(env::account_balance(), 1001, "Article creation does not charge.");
    }
}
