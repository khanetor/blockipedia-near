TARGET = ./target/wasm32-unknown-unknown/release/blockipedia_near.wasm

TEST_TARGET=""

test:
	cargo test $(TEST_TARGET)

# enable `println!()` to show up in the console
# see more at https://stackoverflow.com/a/25107081/3429055
test-verbose:
	cargo test $(TEST_TARGET) -- --nocapture

add-target:
	rustup target add wasm32-unknown-unknown

build:
	cargo build --target wasm32-unknown-unknown --release

lint:
	cargo clippy --fix

deploy-dev: build
	near dev-deploy --wasmFile $(TARGET)

clear-state:
	rm -rf neardev

redeploy: clear-state deploy-dev

create-test-account:
	near create-account test.blockpedia.testnet --masterAccount blockipedia.testnet

deploy-test:
	near deploy test.blockipedia.testnet --wasmFile $(TARGET)

clean:
	cargo clean
