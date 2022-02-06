use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::{env, near_bindgen, AccountId};

near_sdk::setup_alloc!();



#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Wiki {
    len: u64,
    titles: UnorderedMap<u64, String>,
    corpus: UnorderedMap<u64, String>,
    authors: UnorderedMap<u64, AccountId>,
}

impl Default for Wiki {
    fn default() -> Self {
        Self {
            len: 0,
            titles: UnorderedMap::new(b"titles".to_vec()),
            corpus: UnorderedMap::new(b"corpus".to_vec()),
            authors: UnorderedMap::new(b"authors".to_vec()),
        }
    }
}

#[near_bindgen]
impl Wiki {
    // Get an article
    pub fn get_article(&self, article_id: u64) -> (String, String, String) {
        let author = self.authors.get(&article_id).unwrap_or(String::from("Author not available"));
        let title = self.titles.get(&article_id).unwrap_or(String::from("Title not available"));
        let content = self.corpus.get(&article_id).unwrap_or(String::from("Content not available"));
        return (author, title, content);
    }

    // Get a list of articles
    /*
    pub fn get_articles(&self) -> &Vector<(u64, String, String)> {
        let titles = self.titles.to_vec();
        let authors = self.authors.values_as_vector();
        return titles.iter().zip(authors);
    }
    */

    // Create a new article for 2 NEARs
    #[payable]
    pub fn create_article(&mut self, title: String, content: String) -> u64 {
        let author = env::current_account_id();
        let published_date = env::block_timestamp();

        env::log(format!("Article created at {}", published_date).as_bytes());

        let article_id = self.len;

        self.titles.insert(&article_id, &title);
        self.corpus.insert(&article_id, &content);
        self.authors.insert(&article_id, &author);

        return article_id;
    }

    // Edit an existing article for 0.5 NEARs
    /*
    #[payable]
    pub fn update_article(&mut self, article_id: &u64, content: String) {
        // Should panic when not enough fund

        match self.corpus.get(article_id) {
            Some(mut article) => {
                article.content = content;
                self.corpus.insert(article_id, &article);
            }
            None => env::log("Article not found".as_bytes()),
        }
    }

    // if upvote/downvote ratio is 3:7, then article will be removed

    // Upvote or download an article

    // Donate to an article
    */
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
    }
}
