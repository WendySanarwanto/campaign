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
      const requestsLength = await campaignContractInterface.methods.getRequestsLength().call();
      console.log(`[DEBUG] - <RequestIndex.getInitialProps> requestsLength: ${requestsLength}`);

      // Call Campaign contract's requests method specified by requests length
      const requests = [];
      for(let index=0; index < requestsLength; index++) {
        const request = await campaignContractInterface.methods.requests(index).call();
        requests.push({
          approvalCount: request.approvalCount,
          complete: request.complete,
          description: request.description,
          recipient: request.recipient,
          value: request.value
        });
      }
      console.log(`[DEBUG] - <RequestIndex.getInitialProps> requests: \n`, requests);

      return { requests };
    } catch(err){
      console.log(`[ERROR] - <RequestIndex.getInitialProps> details: \n`, err);
      return { errorMessage: err.message }
    }

    return {};
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
