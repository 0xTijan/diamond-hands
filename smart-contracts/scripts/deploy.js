const hre = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners();
  const DiamondHands = await hre.ethers.getContractFactory("DiamondHands");
  const hands = await DiamondHands.deploy();

  await hands.deployed();

  /*let tx = await hands.deposit(10, {value: ethers.utils.parseEther("0.001")});
  console.log(tx);

  let stats = await hands.getStats(accounts[0].address);
  console.log(stats)

  setTimeout(async() => {
    let withdraw = await hands.withdraw();
    console.log(withdraw)
  }, 11000)*/

  console.log("Diamond Hands deployed to:", hands.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
