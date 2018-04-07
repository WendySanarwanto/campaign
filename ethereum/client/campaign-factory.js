import web3 from './web3';
import CampaignFactory from '../build/CampaignFactory.json';

const CAMPAIGN_FACTORY_CONTRACT_ADDRESS = "0xe7cB957257c0779356399B9C4b5F475D9914de5b";

const contractInterface = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), CAMPAIGN_FACTORY_CONTRACT_ADDRESS);

export default contractInterface;
