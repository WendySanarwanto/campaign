import web3 from '.web3';
import CampaignFactory from '../build/CampaignFactory.json';

const CAMPAIGN_FACTORY_CONTRACT_ADDRESS = "0xDDB0F5fE061c7E0657DC49Fd5e9Ee94657c16c4F";

const contractInterface = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), CAMPAIGN_FACTORY_CONTRACT_ADDRESS);

export default contractInterface;
