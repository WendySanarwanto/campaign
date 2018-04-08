import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import web3 from '../ethereum/client/web3';
import getCampaignContractInterface from '../ethereum/client/getCampaignContractInterface';
import { Router } from '../routes';

export default class RequestRow extends Component {
  state = {
    isApproving: false,
    isFinalising: false,
  }

  onApprove = async () => {
    const { campaignAddress, id } = this.props;

    try {                    
      this.setState({isApproving: true});

      // Get instance of Campaign contract's interface
      const campaignContractInterface = await getCampaignContractInterface(campaignAddress);

      // Get accounts list
      const accounts = await web3.eth.getAccounts();

      // Invoke Campaign contract's approveRequest method.
      await campaignContractInterface.methods.approveRequest(id).send({
        from: accounts[0]
      });

      Router.replaceRoute(`/campaigns/${campaignAddress}/requests`);
    } catch(err){
      console.log(`[ERROR] - Details: \n`, err);
    } finally {
      this.setState({isApproving: false});
    }
  };

  onFinalise = async () => {
    const { campaignAddress, id } = this.props;

    try {                    
      this.setState({isFinalising: true});

      // Get instance of Campaign contract's interface
      const campaignContractInterface = await getCampaignContractInterface(campaignAddress);

      // Get accounts list
      const accounts = await web3.eth.getAccounts();

      // Invoke Campaign contract's approveRequest method.
      await campaignContractInterface.methods.finaliseRequest(id).send({
        from: accounts[0]
      });

      Router.replaceRoute(`/campaigns/${campaignAddress}/requests`);
    } catch(err){
      console.log(`[ERROR] - Details: \n`, err);
    } finally {
      this.setState({isFinalising: false});
    }
  }

  render() {
    const { Cell, Row } = Table;
    const { approversCount, id, request } = this.props;
    const { approvalCount, complete, description, recipient, value } = request;
    const readyToFinalise = approvalCount > approversCount / 2;
    
    return (
      <Row disabled={complete} 
           positive={readyToFinalise && !complete}>
        <Cell>{id+1}</Cell>
        <Cell>{description}</Cell>
        <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>{approvalCount}/{approversCount}</Cell>
        <Cell>
          { complete ? null : (
            <Button loading={this.state.isApproving} 
                color="green" 
                basic onClick={this.onApprove}>
                Approve
            </Button>
          )}
        </Cell>
        <Cell>
          { complete ? null : (
            <Button loading={this.state.isFinalising}
                color="teal"
                basic onClick={this.onFinalise}>
                Finalise
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
};
