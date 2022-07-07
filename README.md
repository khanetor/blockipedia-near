# Blockipedia-NEAR
A wikipedia on NEAR Protocol

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/nlhkh/blockipedia-near)

## Visit the Blockipedia page
https://nlhkh.github.io/blockipedia-near/

# How to develop locally

## Backend (smart contract on NEAR rust sdk)

Prerequisites:
- [near-cli](https://www.npmjs.com/package/near-cli)
- [rustc](https://www.rust-lang.org/tools/install)

```
make build
make dev-deploy
```

## Frontend (Gatsby React app)

Prerequisites:
- [Node.js](https://nodejs.dev/learn/how-to-install-nodejs)
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

All frontend resources are under `./frontend` directory
For local development, Gatsby expects env vars from the `.env.development` file
Feel free to copy from `.env.development.sample` and make any change you need

```bash
make dev-frontend
```

# How to run tests

## Run tests against the entire suite

```bash
make test
```

## Run test for a single unit test

```bash
make test TEST_TARGET=test_name
# where `test_name` is the name of the specific test function
# e.g. "create_article_with_insufficient_fund"
```

## Run tests while allowing console log messages (e.g. from `println!` or `dbg!`) to show up

```bash
# run all tests
make test-verbose
# run a specific test
make test-verbose TEST_TARGET=test_name
```
