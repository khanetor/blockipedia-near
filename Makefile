TARGET = ./target/wasm32-unknown-unknown/release/blockipedia_near.wasm

TEST_TARGET=""

test:
	cargo test $(TEST_TARGET)

# enable `println!()` to show up in the console
# see more at https://stackoverflow.com/a/25107081/3429055
test-verbose:
	cargo test $(TEST_TARGET) -- --nocapture

build:
	cargo build --target wasm32-unknown-unknown --release

lint:
	cargo clippy --fix

deploy: build
	near dev-deploy --wasmFile $(TARGET)

clear-state:
	rm -rf neardev

redeploy: clear-state deploy
