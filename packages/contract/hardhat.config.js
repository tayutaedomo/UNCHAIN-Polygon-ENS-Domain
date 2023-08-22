require("@nomicfoundation/hardhat-toolbox");

const { MUMBAI_URL, PRIVATE_KEY, POLYGONSCAN_API } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: MUMBAI_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API,
  },
};
