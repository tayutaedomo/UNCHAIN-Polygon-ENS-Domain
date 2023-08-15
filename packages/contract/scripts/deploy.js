const main = async () => {
  const TLD = process.env.TLD;
  const TOKEN_NAME = process.env.TOKEN_NAME;
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL;

  const contractFactory = await hre.ethers.getContractFactory("Domains");
  const contract = await contractFactory.deploy(TLD, TOKEN_NAME, TOKEN_SYMBOL);
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  const domainName = "more";
  const txn = await contract.register(domainName, {
    value: hre.ethers.utils.parseEther("0.003"),
  });
  await txn.wait();
  console.log(`Minted domain ${domainName}.${TLD}`);

  const txn2 = await contract.setRecord(domainName, `Do you like ${TLD}`);
  await txn2.wait();
  console.log(`Set record for ${domainName}.${TLD}`);

  const address = await contract.getAddress(domainName);
  console.log("Owner of domain:", address);

  const balance = await hre.ethers.provider.getBalance(contract.address);
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
