import twitterLogo from "../assets/twitter-logo.svg";
import { TWITTER_HANDLE, TWITTER_LINK } from "../constants";

const Footer = () => {
  return (
    <div className="footer-container">
      <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
      <a
      className="footer-text"
      href={TWITTER_LINK}
      target="_blank"
      rel="noreferrer"
      >{`built with @${TWITTER_HANDLE}`}</a>
    </div>
  );
}

export default Footer;
