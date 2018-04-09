import web3 from './web3';
import Campaign from '../build/Campaign.json';

const getCampaignContractInterface = campaignContractAddress => {
    return web3 && web3.eth && web3.eth.Contract ? new web3.eth.Contract(
        JSON.parse(Campaign.interface), 
        campaignContractAddress
    ) : null;
};

export default getCampaignContractInterface;
