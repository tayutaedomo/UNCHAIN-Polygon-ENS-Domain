import { React, useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import polygonLogo from "./assets/polygonlogo.png";
import ethLogo from "./assets/ethlogo.png";
import useEthereumConnection from "./hooks/useEthereumConnection";
import useDomainActions from "./hooks/useDomainActions";

// Constants
const TWITTER_HANDLE = "_UNCHAIN";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const tld = ".banana";

const App = () => {
  const { currentAccount, network, connectWallet, switchNetwork } =
    useEthereumConnection();
  const {
    fetchMints,
    mintDomain,
    updateDomain,
    loading,
    mints,
    domain,
    setDomain,
    record,
    setRecord,
  } = useDomainActions(currentAccount);

  const [editing, setEditing] = useState(false);

  const editRecord = async (name) => {
    console.log("Editing record for", name);
    setEditing(true);
    setDomain(name);
  };

  useEffect(() => {
    if (network !== "Polygon Mumbai Testnet") {
      fetchMints();
    }
  }, [currentAccount, network, fetchMints]);

  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/1fHlf4mgS2JPy/giphy.gif"
        alt="Banana gif"
      />
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  const renderInputForm = () => {
    if (network !== "Polygon Mumbai Testnet") {
      return (
        <div className="connect-wallet-container">
          <h2>Please switch to Polygon Mumbai Testnet</h2>
          <button className="cta-button mint-button" onClick={switchNetwork}>
            Click here to switch
          </button>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder="domain"
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="tld">{tld}</p>
        </div>

        <input
          type="text"
          value={record}
          placeholder="What are bananas for you?"
          onChange={(e) => setRecord(e.target.value)}
        />

        {editing ? (
          <div className="button-container">
            <button
              className="cta-button mint-button"
              disabled={loading}
              onClick={updateDomain}
            >
              Set Record
            </button>
            <button
              className="cta-button mint-button"
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="cta-button mint-button"
            disabled={loading}
            onClick={mintDomain}
          >
            Mint
          </button>
        )}
      </div>
    );
  };

  const MintItem = ({ mint }) => {
    return (
      <div className="mint-item">
        <div className="mint-row">
          <a
            className="link"
            href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            {mint.name}
            {tld}{" "}
          </a>
          {mint.owner.toLowerCase() === currentAccount.toLowerCase() ? (
            <button
              className="edit-button"
              onClick={() => editRecord(mint.name)}
            >
              <img
                className="edit-icon"
                src="https://img.icons8.com/metro/26/000000/pencil.png"
                alt="Edit button"
              />
            </button>
          ) : null}
        </div>
        <p>{mint.record}</p>
      </div>
    );
  };

  const renderMints = () => {
    if (currentAccount && mints.length > 0) {
      return (
        <div className="mint-container">
          <p className="subtitle">Recently minted domains!</p>
          <div className="mint-list">
            {mints.map((mint, index) => (
              <MintItem key={index} mint={mint} />
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍🍌 Banana Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
            <div className="right">
              <img
                alt="Network logo"
                className="logo"
                src={network.includes("Polygon") ? polygonLogo : ethLogo}
              />
              {currentAccount ? (
                <p>
                  {" "}
                  Wallet: {currentAccount.slice(0, 5)} ...{" "}
                  {currentAccount.slice(-3)}{" "}
                </p>
              ) : (
                <p>Not Connected</p>
              )}
            </div>
          </header>
        </div>

        {!currentAccount && renderNotConnectedContainer()}
        {currentAccount && renderInputForm()}
        {mints && renderMints()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
