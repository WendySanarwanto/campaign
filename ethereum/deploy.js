const HDWalletProvider = require(`truffle-hdwallet-provider`);
const Web3 = require('web3');
const compiledCampaignFactory = require(`./build/CampaignFactory.json`);

const DEV_ACCOUNT_MNEMONIC = process.env.ETH_DEV_ACC_MNEMONIC;
const RINKEBY_NODE_URL = process.env.RINKEBY_NODE_URL;
const NODE_URL = RINKEBY_NODE_URL;

const provider = new HDWalletProvider(
  DEV_ACCOUNT_MNEMONIC,
  NODE_URL
);

const web3 = new Web3(provider);
const GAS_LIMIT = 1000000;
const GAS_PRICE = web3.utils.toWei('70', 'gwei');

const deploy = async() => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  console.log(`Attempting to deploy from account: `, account);
  const accountBalance = await web3.eth.getBalance(account);
  // console.log(`Account's balance: `, web3.utils.fromWei(accountBalance, 'ether'));
  try {
    const result = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
      .deploy({data: compiledCampaignFactory.bytecode})
      .send({
        from: account,
        gas: GAS_LIMIT /*,
        gasPrice: GAS_PRICE*/
      });

    console.log(`Campaign Factory contract is deployed to `, result.options.address);
  } catch(err) {
    console.log(`[ERROR] details: \n`, err);
  }
};

deploy();