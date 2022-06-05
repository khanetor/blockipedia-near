use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::AccountId;
use near_sdk::serde::Serialize;

pub static ONE_NEAR: u128 = 10u128.pow(24);

// see https://www.near-sdk.io/contract-interface/serialization-interface#overriding-serialization-protocol-default
// see https://www.near-sdk.io/best-practices#reuse-crates-from-near-sdk
#[derive(BorshSerialize, BorshDeserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Article {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub author: String,
    pub published_date: u64,
    pub upvote: u8,
    pub downvote: u8,
}

// see https://www.near-sdk.io/contract-interface/serialization-interface#overriding-serialization-protocol-default
// see https://www.near-sdk.io/best-practices#reuse-crates-from-near-sdk
#[cfg_attr(test, derive(Debug))] // add Debug trait for this struct only when running tests
#[derive(BorshSerialize, BorshDeserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
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
