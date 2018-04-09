import Web3 from 'web3';

// const web3 = new Web3(window.web3.currentProvider);
let web3;

// Do we runs on browser with running metamask ?
if (typeof window !== 'undefined') {
  // We are in the browser and metamask is running.
  if (typeof window.web3 !== 'undefined') {
    // Instantiate web3 instance through hijacking Metamask's current provider.
    web3 = new Web3(window.web3.currentProvider);
  } else {
    const warningMessage = 'Metamask is requried. Follow the instructions in this link to install Metamask on your Chrome or Firefox browser: https://metamask.io/';
    // throw new Error(errorMessage);
    console.log(`[WARNING] - ${warningMessage}`);
  }
} else if (process.env.RINKEBY_NODE_URL && process.env.RINKEBY_NODE_URL !== '') {
  // We are on the server *OR* the user is not running metamask.

  // Instantiate web3 instance through using HttpProvider with Infura valid URL
  const httpProvider = new Web3.providers.HttpProvider(
    process.env.RINKEBY_NODE_URL
  );
  web3 = new Web3(httpProvider);
} else throw new Error('No Infura-Rinkeby Node URL is defined. ');

export default web3;