require('events').EventEmitter.prototype._maxListeners = 100; // Suppress MaxListenersExceededWarning

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
  // Note - This raise MaxListenersExceededWarning when running the test.
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // Create interface instance to the deployed Campaign's contract
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface), 
    campaignAddress
  );
});

describe('Campaign', () => {
  it('deploy campaign factory and factory contracts', async() =>{
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it(`marks campaign contract's creator as the campaign's manager`, async() => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it(`allows people to contribute money and marks them as approvers`, async() => {
    await campaign.methods.contribute()
      .send({ from: accounts[1], value: web3.utils.toWei('0.2', 'ether') });

    assert.equal( await campaign.methods.approvers(accounts[1]).call(), true);
  });

  it(`requires a minimum contribution`, async() => {
    try{
      await campaign.methods.contribute()
        .send({ from: accounts[2], value: '5'});
    } catch(err){
      assert(err);
    }
  });

  it(`allows a manager to make a payment request`, async() => {
    const description = `Buy Battery`;
    const value = 200;

    await campaign.methods.createRequest(description, value, accounts[2])
      .send({
        from: accounts[0],
        gas: GAS_LIMIT
      });

    const request = await campaign.methods.requests(0).call();
    // console.log(`[DEBUG] - request: \n`, request);
    assert.equal(request.description, description);
    assert.equal(request.value, value);
  });

});