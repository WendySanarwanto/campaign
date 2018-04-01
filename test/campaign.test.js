require('events').EventEmitter.prototype._maxListeners = 1000; // Suppress MaxListenersExceededWarning

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

  it('deploy campaign factory and factory contracts', () =>{
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
    assert.equal(request.description, description);
    assert.equal(request.value, value);
  });

  it(`process a payment request`, async() => {
    const manager = accounts[0];
    const contributor = accounts[1];
    const vendor = accounts[3];
    const initialVendorBalance = parseInt(await web3.eth.getBalance(vendor));

    // A user contribute their money
    const money = web3.utils.toWei('10', 'ether');
    await campaign.methods.contribute()
      .send({
        from: contributor,
        value: money
      });

    // Manager creates a payment request
    const description = `Buy Battery`;
    const value = web3.utils.toWei('1', 'ether');
    await campaign.methods.createRequest(description, value, vendor)
      .send({
        from: manager,
        gas: GAS_LIMIT
      });

    // Contributor approve request
    await campaign.methods.approveRequest(0)
      .send({
        from: contributor,
        gas: GAS_LIMIT
      });

    // Manager finalise the approved request
    await campaign.methods.finaliseRequest(0)
      .send({
        from: manager,
        gas: GAS_LIMIT
      });

    // Assert request
    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, description);
    assert.equal(request.value, value);
    assert.equal(request.complete, true);

    // Assert whether the recipient got the money
    let vendorBalance = await web3.eth.getBalance(vendor);
    vendorBalance = web3.utils.fromWei(vendorBalance, `ether`);
    vendorBalance = parseFloat(vendorBalance);
    
    const expectedVendorBalance = web3.utils.fromWei((initialVendorBalance + parseInt(value)).toString(), 'ether');
    assert.equal(vendorBalance, expectedVendorBalance);
  });

  it(`let contributor re-claim their donated fund`, async() => {
    const contributor = accounts[1];
    const contributedMoney = web3.utils.toWei('1', 'ether');
    let initialContributorBalance = await web3.eth.getBalance(contributor);
    initialContributorBalance = web3.utils.fromWei(initialContributorBalance, 'ether');
    // console.log(`[DEBUG] - contributorBalance (before making donation): ${initialContributorBalance} ether.`);

    // Contribute money
    await campaign.methods.contribute()
      .send({ from: contributor, value: contributedMoney});

    let contributorBalance = await web3.eth.getBalance(contributor);
    contributorBalance = web3.utils.fromWei(contributorBalance, 'ether');
    // console.log(`[DEBUG] - contributorBalance (after contribute): ${contributorBalance} ether.`);  

    // Assert contract's balance
    let currentContractBalance = await web3.eth.getBalance(campaign.options.address);
    assert.equal(currentContractBalance, contributedMoney);

    // Re-claim fund
    await campaign.methods.claimFund().send({
      from: contributor
    });
    currentContractBalance = await web3.eth.getBalance(campaign.options.address);
    contributorBalance = await web3.eth.getBalance(contributor);
    contributorBalance = web3.utils.fromWei(contributorBalance, 'ether');
    // console.log(`[DEBUG] - contributorBalance (after refund): ${contributorBalance} ether.`);

    const diffContributorBalance = parseFloat(initialContributorBalance) - parseFloat(contributorBalance);
    // console.log(`[DEBUG] - diffContributorBalance: ${diffContributorBalance}`);

    assert.equal(currentContractBalance, 0);
    assert.ok(diffContributorBalance < contributedMoney);
  });

  it(`allows contributor to top up their donation`, async() => {
    const contributor = accounts[3];
    let contributedMoney = web3.utils.toWei('0.5', 'ether');
    let totalContributedMoney = contributedMoney;

    // Donate initial contribution
    await campaign.methods.contribute()
      .send({ from: contributor, value: contributedMoney});

    // Donate 2nd contribution
    contributedMoney = web3.utils.toWei('0.2', 'ether');
    await campaign.methods.contribute()
      .send({ from: contributor, value: contributedMoney});
    totalContributedMoney = (parseFloat(totalContributedMoney) + parseFloat(contributedMoney)).toString();

    // Assert
    const donatorsCount = await campaign.methods.approversCount().call();
    const donatedMoney = await campaign.methods.donatedMoney(contributor).call();
    assert.equal(donatorsCount, 1);
    // console.log(`[DEBUG] - donatedMoney: ${web3.utils.fromWei(donatedMoney, 'ether')} ether, 
    //              totalContributedMoney: ${web3.utils.fromWei(totalContributedMoney, 'ether')} ether.`);
    assert.equal(donatedMoney, totalContributedMoney);
  });

  it(`should return a contributor's all donated money when the contributor claim refund`, async () => {
    const contributor = accounts[3];
    let contributedMoney = web3.utils.toWei('0.5', 'ether');
    let totalContributedMoney = contributedMoney;
    let initialContributorBalance = await web3.eth.getBalance(contributor);
    initialContributorBalance = web3.utils.fromWei(initialContributorBalance, 'ether');

    // Donate initial contribution
    await campaign.methods.contribute()
      .send({ from: contributor, value: contributedMoney});

    // Donate 2nd contribution
    contributedMoney = web3.utils.toWei('0.2', 'ether');
    await campaign.methods.contribute()
      .send({ from: contributor, value: contributedMoney});
    totalContributedMoney = (parseFloat(totalContributedMoney) + parseFloat(contributedMoney)).toString();
  
    // Claim refund
    await campaign.methods.claimFund()
      .send({ from: contributor});
    
    // // Assert
    let contributorBalance = await web3.eth.getBalance(contributor);
    contributorBalance = web3.utils.fromWei(contributorBalance, 'ether');
    let diffContributorBalance = (parseFloat(initialContributorBalance) - parseFloat(contributorBalance)).toString();
    let contractBalance = await web3.eth.getBalance(campaign.options.address);
    contractBalance = web3.utils.fromWei(contractBalance, 'ether');
    const isContributor = await campaign.methods.approvers(contributor).call();
    const currentDonatedMoney = await campaign.methods.donatedMoney(contributor).call();
    const donatorsCount = await campaign.methods.approversCount().call();
    
    assert.equal(parseFloat(diffContributorBalance) < 0.01, true);
    assert.equal(parseFloat(contractBalance), 0);
    assert.equal(isContributor, false);
    assert.equal(currentDonatedMoney, 0);
    assert.equal(donatorsCount, 0);
  });
});