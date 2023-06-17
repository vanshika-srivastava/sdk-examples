const { ethers } = require("ethers");
const { createBiconomyAccountInstance, buildAndSendUserOp, sendUserOp } = require('./helperFunctionsBtpm')

const mintNftPayERC20 = async () => {
  const biconomySmartAccount = await createBiconomyAccountInstance()

  const nftInterface = new ethers.utils.Interface([
    'function safeMint(address _to)'
  ])
  const data = nftInterface.encodeFunctionData(
    'safeMint', [biconomySmartAccount.address]
  )
  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e" // same for goerli and mumbai
  const transaction = {
    to: nftAddress,
    data: data,
  }

  const tokenPaymaster = biconomySmartAccount.paymaster;
  // todo
  // instead of using attached paymaster create BTPM instance

  let partialUserOp = await biconomySmartAccount.buildUserOp([transaction])

  console.log('partial userOp')
  console.log(partialUserOp)
  
  const feeQuotes = await tokenPaymaster?.getPaymasterFeeQuotes(partialUserOp, ["0xc1537Ab4f2e0B1c578bAEA06b5bAaE8f87Ce971c", "0x81F9E7a56f6869A9A8c385d1E0701b312439501F"], "0x03bBb5660B8687C2aa453A0e42dCb6e0732b1266")
  console.log('<<<<<<<<<<<<<<<<<< ====================== fee quotes received')
  console.log(feeQuotes)

  console.log(feeQuotes[0].tokenAddress)

  const paymasterServiceData = 
    {
      "mode": "ERC20",
      "tokenInfo": 
      {
      "feeTokenAddress": feeQuotes[0].tokenAddress // for now or always
      },
      /*
      sponsorshipInfo: {
        "webhookData": {},
        "smartAccountInfo": {
            "name": "BICONOMY",
            "version": "1.0.0"
        }
      }*/
    }

  console.log('partialUserOp is ')
  console.log(partialUserOp)
  
  const paymasterData = await tokenPaymaster?.getPaymasterAndData(partialUserOp, paymasterServiceData);
  console.log('successfull call return: paymasterAndData ', paymasterData)

  partialUserOp.paymasterAndData = paymasterData

  // Sending transaction
  // const userOpResponse = await biconomySmartAccount.sendUserOp(partialUserOp)
  // console.log('userOpResponse ', userOpResponse)

  await sendUserOp(biconomySmartAccount, partialUserOp)


    
  
  ///////////////////////////////////////


  // 1. 
  // Pass the partialUserOp and feeTokenAddress (mandatory quote) to account package for updating calldata with approval
  // Pass the partial userOp and tokenAddress/Quote to tokenPaymaster.getPaymasterAndData()
  // update the partialUserOp with paymasterandData and sendUserOp to bundler

  // 2.
  // Pass the partialUserOp and preferredTokenAddress
  // get the fee quote for your preferred token by tokenPaymaster.getFeeQuote()
  // Manage appending approval to calldata on your end [ In order to do this you need : tokenAddress, spender, quote (or choose infinite approval)]
  // Pass the updated partial userOp and tokenAddress/Quote to tokenPaymaster.getPaymasterAndData()
  // update the partialUserOp with paymasterandData and sendUserOp to bundler



  // Sending transaction
  // buildAndSendUserOp(biconomySmartAccount, transaction)
}

module.exports = { mintNftPayERC20 };