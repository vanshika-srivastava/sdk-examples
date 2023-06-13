const { ethers } = require("ethers");
const { ERC20ABI } = require('./abi')
const { createBiconomyAccountInstance, buildAndSendUserOp } = require('./helperFunctions')
const config = require("../config.json");

const erc20Transfer = async (recipientAddress, amount, tokenAddress) => {
  const biconomySmartAccount = await createBiconomyAccountInstance()
  const readProvider = new ethers.providers.JsonRpcProvider(config.rpcUrl)
  const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, readProvider)
  let decimals = 1
  try {
    decimals = await tokenContract.decimals()
  } catch (error) {
    throw new Error('invalid token address supplied')
  }
  const amountGwei = ethers.utils.parseUnits(amount.toString(), decimals);
  const data = (await tokenContract.populateTransaction.transfer(recipientAddress, amountGwei)).data
  const transaction = {
    to: tokenAddress,
    data
  }
  // Sending transaction
  buildAndSendUserOp(biconomySmartAccount, [transaction])
}

module.exports = { erc20Transfer };