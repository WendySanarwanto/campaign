const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledCampaignFactory = require(`../ethereum/build/CampaignFactory.json`);
const compiledCampaign = require(`../ethereum/build/Campaign.json`);

let accounts; // Hold Ethereum test accounts
let factory;
let campaign;
let campaignAddress;

const GAS_LIMIT = 1000000;

beforeEach(async()=>{
  // Get list of accounts
  accounts = await web3.eth.getAccounts();

  // Deploy Campaign Factory contract
  factory = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
                    .deploy({ data: compiledCampaignFactory.bytecode })
                    .send({ from: accounts[0], gas: GAS_LIMIT });
});

describe('Campaign', () => {
  it('Deploy', async() =>{
    // TODO: Implement this
  });
});