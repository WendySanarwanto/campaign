import React, { Component } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

import getCampaignContractInterface from '../../../ethereum/client/getCampaignContractInterface';

export default class RequestIndex extends Component {

  static async getInitialProps(props) {
    const campaignAddress = props.query.campaignAddress;
    try {
      // Get instance of Campaign contract's interface
      const campaignContractInterface = await getCampaignContractInterface(campaignAddress);

      // Call Campaign contract's getRequestsLength method
      let requestsLength = await campaignContractInterface.methods.getRequestsLength().call();
      requestsLength = parseInt(requestsLength);
      console.log(`[DEBUG] - <RequestIndex.getInitialProps> requestsLength: ${requestsLength}`);

      // Call Campaign contract's requests method specified by requests length
      const requests = await Promise.all(
        Array(requestsLength).fill().map((element, index) => {
          return campaignContractInterface.methods.requests(index).call();
        })
      );
      console.log(`[DEBUG] - <RequestIndex.getInitialProps> requests: \n`, requests);

      return { campaignAddress, requests, requestsLength };
    } catch(err){
      console.log(`[ERROR] - <RequestIndex.getInitialProps> details: \n`, err);
      return { errorMessage: err.message }
    }

    return { campaignAddress };
  }

  render(){
    return (
      <div>
        <Layout>
          <h3>Requests</h3>
          <Link route={`/campaigns/${this.props.campaignAddress}/requests/new`}>
            <a>
              <Button primary>Add Request</Button>
            </a>
          </Link>
        </Layout>
      </div>
    );
  };
}
