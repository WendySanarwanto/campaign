import Web3 from 'web3';

// const web3 = new Web3(window.web3.currentProvider);
let web3;

// Do we runs on browser with running metamask ?
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.

  // Instantiate web3 instance through hijacking Metamask's current provider.
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask.

  // Instantiate web3 instance through using HttpProvider with Infura valid URL
  const httpProvider = new Web3.providers.HttpProvider(
    process.env.RINKEBY_NODE_URL
  );
  web3 = new Web3(httpProvider);
}

export default web3;