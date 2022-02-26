use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::AccountId;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct Article {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub author: AccountId,
    pub upvote: u8,
    pub download: u8,
}
#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct ArticleMeta {
    pub title: String,
    pub author: AccountId,
    pub editors: Vec<AccountId>,
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
