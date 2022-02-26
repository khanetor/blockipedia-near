use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::AccountId;
use serde::{Deserialize, Serialize};

pub static ONE_NEAR: u128 = 10u128.pow(24);

#[derive(Serialize)]
pub struct Article {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub author: AccountId,
    pub published_date: u64,
    pub upvote: u8,
    pub download: u8,
}

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct ArticleMeta {
    pub title: String,
    pub author: AccountId,
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
