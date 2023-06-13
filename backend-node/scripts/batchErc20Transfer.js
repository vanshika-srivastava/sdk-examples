const { ethers } = require("ethers");
const { ERC20ABI } = require('./abi')
const { createBiconomyAccountInstance, buildAndSendUserOp } = require('./helperFunctions')
const config = require("../config.json");

const batchErc20Transfer = async (recipientAddress, amount, tokenAddress) => {
    const biconomySmartAccount = await createBiconomyAccountInstance()
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpcUrl)
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, readProvider)
    let decimals = 1
    try {
      decimals = await tokenContract.decimals()
    } catch (error) {
      throw new Error('invalid token address supplied')
    }
  
  // Encode an ERC-20 token transfer to recipient of the specified amount
  const amountGwei = ethers.utils.parseUnits(amount.toString(), decimals);
  console.log("transfering tokens to", recipientAddress);
  // create tx array to all the recipientAddress
  const txArray = [];
  for (let i = 0; i < recipientAddress.length; i++) {
    const tx = {
      to: tokenAddress,
      data: (await tokenContract.populateTransaction.transfer(recipientAddress[i], amountGwei)).data
    }
    txArray.push(tx);
  }
  // Sending transaction
  buildAndSendUserOp(biconomySmartAccount, txArray)
}

module.exports = { batchErc20Transfer };