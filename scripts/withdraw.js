const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
 
  const contractAddress="0xb736a1B70Ef9cA678Ff387E4826CCa1d9594c47f";
  const contractABI = abi.abi;

  
  const provider = new hre.ethers.providers.AlchemyProvider("Rinkeby", process.env.RINKEBY_API_KEY);

  
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  
  const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.address), "ETH");

  
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..")
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
