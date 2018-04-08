import React, { Component } from 'react';
import { Button, Grid, Label, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
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

      // Call Campaign contract's approversCount method
      const approversCount = await campaignContractInterface.methods.approversCount().call();
      console.log(`[DEBUG] - <RequestIndex.getInitialProps> approversCount: ${approversCount}`);

      // Call Campaign contract's requests method specified by requests length
      const requests = await Promise.all(
        Array(requestsLength).fill().map((element, index) => {
          return campaignContractInterface.methods.requests(index).call();
        })
      );
      console.log(`[DEBUG] - <RequestIndex.getInitialProps> requests: \n`, requests);

      return { approversCount, campaignAddress, requests, requestsLength };
    } catch(err){
      console.log(`[ERROR] - <RequestIndex.getInitialProps> details: \n`, err);
      return { campaignAddress, errorMessage: err.message }
    }
  }

  renderRows() {
    const { approversCount, campaignAddress } = this.props;

    return this.props.requests.map((request, index) => {
      return <RequestRow 
        key={index}
        id={index}
        approversCount={approversCount}
        request={request}
        campaignAddress={campaignAddress}
      />
    });
  }

  renderTables() {
    const { Body, Header, HeaderCell, Row  } = Table;
    return (
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount (ETH)</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalise</HeaderCell>
          </Row>
        </Header>
        
        <Body>
          {this.renderRows()}
        </Body>
      </Table>
    );
  }

  render(){
    return (
      <div>
        <Layout>
          <h3>Pending Requests</h3>
          <Link route={`/campaigns/${this.props.campaignAddress}/requests/new`}>
            <a>
              <Button primary>Add Request</Button>
            </a>
          </Link>

          {this.renderTables()}
        </Layout>
      </div>
    );
  };
}
