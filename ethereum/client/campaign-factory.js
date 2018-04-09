import web3 from './web3';
import CampaignFactory from '../build/CampaignFactory.json';

const CAMPAIGN_FACTORY_CONTRACT_ADDRESS = "0xFB4dC913901946C661367Fbb51EBbBA64BEf07c3";

const contractInterface = web3 && web3.eth && web3.eth.Contract ?
                          new web3.eth.Contract(JSON.parse(CampaignFactory.interface), CAMPAIGN_FACTORY_CONTRACT_ADDRESS) : 
                          null;

export default contractInterface;
