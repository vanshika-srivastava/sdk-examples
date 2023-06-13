### SmartAccount on backend using private key

This is a cli to demonstrate how to use a private key to sign transactions on the backend with new Biconomy SDK.

## Setup

```bash
yarn install
```

## Run

```bash
yarn run smartAccount init --network=mumbai
yarn run smartAccount transfer --to=0xf5A5958B83628fCAe33a0ac57Bc9b4Af44DA2034 --amount=1
yarn run smartAccount erc20Transfer --to=0xf5A5958B83628fCAe33a0ac57Bc9b4Af44DA2034 --amount=.001 --token=0xdA5289fCAAF71d52a80A254da614a192b693e977
yarn run smartAccount batchErc20Transfer --to 0xf5A5958B83628fCAe33a0ac57Bc9b4Af44DA2034,0xCD607E85F17BfeA75cD5B36E440fEea6df7dAcE0  --token 0xdA5289fCAAF71d52a80A254da614a192b693e977 --amount 0.001
yarn run smartAccount mint
yarn run smartAccount batchMint
```
