const main = async () => {
  const TLD = process.env.TLD;

  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy(TLD);
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);

  const domain = "example";
  const txn = await domainContract.register(domain, {
    value: hre.ethers.utils.parseEther("0.01"),
  });
  await txn.wait();

  const address = await domainContract.getAddress(domain);
  console.log("Owner of domain:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
