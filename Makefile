TARGET = ./target/wasm32-unknown-unknown/release/blockipedia_near.wasm

test:
	cargo test

build:
	cargo build --target wasm32-unknown-unknown --release

lint:
	cargo clippy --fix

deploy: build
	near dev-deploy --wasmFile $(TARGET)

clear-state:
	rm -rf neardev

redeploy: clear-state deploy
