use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::AccountId;

pub static ONE_NEAR: u128 = 10u128.pow(24);

// @TODO check if serde_json::Serialize is needed for the FE client to consume
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Article {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub author: String,
    pub published_date: u64,
    pub upvote: u8,
    pub downvote: u8,
}

// @TODO check if serde_json::Serialize is needed for the FE client to consume
#[cfg_attr(test, derive(Debug))] // add Debug trait for this struct only when running tests
#[derive(BorshSerialize, BorshDeserialize)]
pub struct ArticleMeta {
    pub title: String,
    pub author: String,
    pub editors: Vec<AccountId>,
    pub published_date: u64,
}

#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct Rating {
    pub upvote: u8,
    pub downvote: u8,
}

pub enum RatingAction {
    Upvote,
    Downvote,
}
