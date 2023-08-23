import { React, useEffect, useState, useCallback } from "react";
import "./styles/App.css";
import useEthereumConnection from "./hooks/useEthereumConnection";
import useDomainActions from "./hooks/useDomainActions";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CONTRACT_ADDRESS, TLD } from "./constants";
import { useMemo } from "react";

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

  const editRecord = useCallback(
    async (name) => {
      console.log("Editing record for", name);
      setEditing(true);
      setDomain(name);
    },
    [setEditing, setDomain]
  );

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
          <p className="tld">{TLD}</p>
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
            {TLD}{" "}
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
        <Header currentAccount={currentAccount} network={network} />

        {!currentAccount && renderNotConnectedContainer()}
        {currentAccount && renderInputForm()}
        {mints && renderMints()}

        <Footer />
      </div>
    </div>
  );
};

export default App;
