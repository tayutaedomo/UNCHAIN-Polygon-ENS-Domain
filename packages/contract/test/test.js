const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const hre = require("hardhat");
const { expect } = require("chai");

describe("ENS-Domain", () => {
  async function deployTextFixture() {
    const [owner, superCoder] = await hre.ethers.getSigners();

    const DomainContract = await hre.ethers.getContractFactory("Domains");
    const domainContract = await DomainContract.deploy(
      "ninja",
      "Ninja Name Service",
      "NNS"
    );
    await domainContract.deployed();

    const txn = await domainContract.register("abc", {
      value: hre.ethers.utils.parseEther("1234"),
    });
    await txn.wait();

    const txn2 = await domainContract.register("defg", {
      value: hre.ethers.utils.parseEther("2000"),
    });
    await txn2.wait();

    return { owner, superCoder, domainContract };
  }

  it("Token amount contract has is correct!", async () => {
    const { domainContract } = await loadFixture(deployTextFixture);
    const balance = await hre.ethers.provider.getBalance(
      domainContract.address
    );
    expect(hre.ethers.utils.formatEther(balance)).to.equal("3234.0");
  });

  it("someone not owner cannot withdraw token", async () => {
    const { owner, superCoder, domainContract } = await loadFixture(
      deployTextFixture
    );

    const ownerBeforeBalance = await hre.ethers.provider.getBalance(
      owner.address
    );
    try {
      const txn = await domainContract.connect(superCoder).withdraw();
      await txn.wait();
    } catch (error) {
      console.log("robber could not withdraw token");
    }

    const ownerAfterBalance = await hre.ethers.provider.getBalance(
      owner.address
    );
    expect(hre.ethers.utils.formatEther(ownerBeforeBalance)).to.equal(
      hre.ethers.utils.formatEther(ownerAfterBalance)
    );
  });

  it("contract owner can withdraw token from contract!", async () => {
    const { owner, domainContract } = await loadFixture(deployTextFixture);
    const ownerBeforeBalance = await hre.ethers.provider.getBalance(
      owner.address
    );
    const txn = await domainContract.connect(owner).withdraw();
    await txn.wait();
    const ownerAfterBalance = await hre.ethers.provider.getBalance(
      owner.address
    );

    expect(hre.ethers.utils.formatEther(ownerBeforeBalance)).to.not.equal(
      hre.ethers.utils.formatEther(ownerAfterBalance)
    );
  });

  it("Domain value is depend on how long it is!", async () => {
    const { domainContract } = await loadFixture(deployTextFixture);
    const price1 = await domainContract.price("abc");
    const price2 = await domainContract.price("defg");
    expect(hre.ethers.utils.formatEther(price1)).to.not.equal(
      hre.ethers.utils.formatEther(price2)
    );
  });
});
