const main = async () => {
  const TLD = process.env.TLD;
  const TOKEN_NAME = process.env.TOKEN_NAME;
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL;

  const [owner, superCoder] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy(
    TLD,
    TOKEN_NAME,
    TOKEN_SYMBOL
  );
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);

  const domain = "a16z";
  const txn = await domainContract.register(domain, {
    value: hre.ethers.utils.parseEther("1234"),
  });
  await txn.wait();

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  try {
    const txn2 = await domainContract.connect(superCopder).withdraw();
    await txn2.wait();
  } catch (error) {
    console.log("Could not rob contract");
  }

  const ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Balance of owner before withdrawal:",
    hre.ethers.utils.formatEther(ownerBalance)
  );

  const txn3 = await domainContract.connect(owner).withdraw();
  await txn3.wait();

  const contractBalance = await hre.ethers.provider.getBalance(
    domainContract.address
  );
  const ownerBalance2 = await hre.ethers.provider.getBalance(owner.address);

  console.log(
    "Contract balance before withdrawal:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  console.log(
    "Balance of owner before withdrawal:",
    hre.ethers.utils.formatEther(ownerBalance2)
  );
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
