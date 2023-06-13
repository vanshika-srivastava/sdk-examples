const { ethers } = require("ethers");
const { createBiconomyAccountInstance, buildAndSendUserOp } = require('./helperFunctions')

const batchMintNft = async () => {
  const biconomySmartAccount = await createBiconomyAccountInstance()

  const nftInterface = new ethers.utils.Interface([
    'function safeMint(address _to)'
  ])
  const data = nftInterface.encodeFunctionData(
    'safeMint', [biconomySmartAccount.address]
  )
  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e"
  const transaction = {
    to: nftAddress,
    data: data,
  }
  // Sending transaction
  buildAndSendUserOp(biconomySmartAccount, [transaction, transaction])

}

module.exports = { batchMintNft };