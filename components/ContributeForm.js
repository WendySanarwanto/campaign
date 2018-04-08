import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Router } from '../routes';
import getCampaignContractInterface from '../ethereum/client/getCampaignContractInterface';
import web3 from '../ethereum/client/web3';

export default class ContributeForm extends Component {
    state = {
      errorMessage: '',
      loading: false,
      ether: ''
    };

    /**
     * Handle form submission
     */
    onSubmit = async (event) => {
      // Prevent the browser from submitting the form (refresh page)
      event.preventDefault();

      // Display loading spinning throbber and clear prior error message
      this.setState({ loading: true, errorMessage: '' });

      // TODO: Move this into service class
      try {
        const campaignAddress = this.props.campaignAddress;
        const campaign = getCampaignContractInterface(campaignAddress);
        
        // Get a list accounts from the web3 instance.
        const accounts = await web3.eth.getAccounts();

        // Execute contribute contract method
        const ether = web3.utils.toWei(this.state.ether, 'ether');
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: ether
        });

        // Refresh Show's panels
        Router.replaceRoute(`/campaigns/${campaignAddress}`);
      } catch(err){
        this.setState({errorMessage: err.message});
        console.log(`[ERROR] - Details: \n`, err);
      } finally {
        this.setState({loading: false, ether: ''});
      }
    }

    render() {
      return (
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Amount to Contribute</label>
            <Input label="ether"
                    labelPosition="right"
                    value={this.state.ether}
                    onChange={ event => 
                      this.setState({ether: event.target.value})
                    } />
          </Form.Field>
          
          <Message error header='Oops' list={[this.state.errorMessage]} />

          <Button loading={this.state.loading} primary>Contribute !</Button>
        </Form>
      );
    }
}