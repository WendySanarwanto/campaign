import web3 from './web3';
import Campaign from '../build/Campaign.json';

const getCampaignContractInterface = campaignContractAddress => {
    return new web3.eth.Contract(
        JSON.parse(Campaign.interface), 
        campaignContractAddress
    );
};

export default getCampaignContractInterface;
