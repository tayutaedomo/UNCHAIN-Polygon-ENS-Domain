import polygonLogo from "../assets/polygonlogo.png";
import ethLogo from "../assets/ethlogo.png";

const Header = ({ currentAccount, network }) => {
  return (
    <div className="header-container">
      <header>
      <div className="left">
        <p className="title">🐱🍌 Banana Name Service</p>
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
  );
}

export default Header;
