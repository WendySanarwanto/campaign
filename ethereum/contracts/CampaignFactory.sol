pragma solidity ^0.4.17;

import { Campaign } from "./Campaign.sol";

contract CampaignFactory {
    address[] public deployedCampaigns;

    /**
     * Factory method for creating & deploying Campaign contract's instance.
     */
    function createCampaign(uint minimumContribution) public {
        address newCampaign = new Campaign(minimumContribution, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    /**
     * Get a list of deployed Campaign Contracts
    */
    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
}
