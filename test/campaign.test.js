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
const MINIMUM_CONTRIBUTION = web3.utils.toWei('0.1', 'ether');

beforeEach(async()=>{
  // Get list of accounts
  accounts = await web3.eth.getAccounts();

  // Deploy Campaign Factory contract
  factory = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
                    .deploy({ data: compiledCampaignFactory.bytecode })
                    .send({ 
                      from: accounts[0], 
                      gas: GAS_LIMIT 
                    });
  
  // Deploy Campaign contract through calling the factory's createCampaign method
  await factory.methods.createCampaign(MINIMUM_CONTRIBUTION)
    .send({ 
      from: accounts[0], 
      gas: GAS_LIMIT 
    }); 

  // Get deployed campaign contract's addresses
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();  

  // Create interface instance to the deployed Campaign's contract
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface), 
    campaignAddress
  );
});

describe('Campaign', () => {
  it('Deploy', async() =>{
    // TODO: Implement this
  });
});