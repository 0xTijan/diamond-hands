const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const truffleAssert = require('truffle-assertions');


describe("Diamond Hands", function () {

  let hands, DiamondHands, accounts;

  beforeEach(async () => {
    DiamondHands = await ethers.getContractFactory("DiamondHands");
    hands = await DiamondHands.deploy();
    await hands.deployed();
    accounts = await ethers.getSigners();
  });

  it("should lock funds and update stats", async function () {
    let lock = await hands.deposit(10, { value: ethers.utils.parseEther("0.001"), from: accounts[0].address });
    let stats = await hands.getStats(accounts[0].address);
    assert(stats[0].toNumber() == ethers.utils.parseEther("0.001"));
  });

  it("should lock funds and be able to unlock after deadline", async () => {
    let lock = await hands.deposit(10, { value: ethers.utils.parseEther("0.001"), from: accounts[0].address });
    
    await truffleAssert.reverts(
      hands.withdraw()
    );

    setTimeout(async() => {
      let withdraw = await hands.withdraw();
    }, 10000);
  });

});
