import React, { Component } from 'react';
import campaignFactory from '../ethereum/client/campaign-factory';

export default class CampaignIndex extends Component {
  async componentDidMount() {
    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
    console.log(`[DEBUG] - campaigns: \n`, campaigns);
  }

  render() {
    return <h1>Campaigns Index !!</h1>;
  }
}

