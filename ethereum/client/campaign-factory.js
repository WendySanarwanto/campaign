import web3 from '.web3';
import CampaignFactory from '../build/CampaignFactory.json';

const CAMPAIGN_FACTORY_CONTRACT_ADDRESS = "0xD472FE756785f97Ec0F4f51aF4a2CbF06b046F40";

const contractInterface = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), CAMPAIGN_FACTORY_CONTRACT_ADDRESS);

export default contractInterface;
