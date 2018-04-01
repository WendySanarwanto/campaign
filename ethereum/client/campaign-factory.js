import web3 from '.web3';
import CampaignFactory from '../build/CampaignFactory.json';

const CAMPAIGN_FACTORY_CONTRACT_ADDRESS = "0x2e839Fee7161b40b0F262d4303688674767E5fA5";

const contractInterface = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), CAMPAIGN_FACTORY_CONTRACT_ADDRESS);

export default contractInterface;
