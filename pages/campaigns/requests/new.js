import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import web3 from '../../../ethereum/client/web3';
import { Link, Router } from '../../../routes';

import getCampaignContractInterface from '../../../ethereum/client/getCampaignContractInterface';

export default class RequestNew extends Component {
  static getInitialProps(props) {
    const campaignAddress = props.query.campaignAddress;    
    return { campaignAddress };
  }

  state = {
    description: '',
    ether: '',
    recipient: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
    // Prevent the browser from submitting the form (refresh page)
    event.preventDefault();

    // Display loading spinning throbber and clear prior error message
    this.setState({ loading: true, errorMessage: '' });

    // TOOD: Move this into service class 
    try{
      const campaignAddress = this.props.campaignAddress;
      console.log(`[DEBUG] - <RequestNew.onSubmit> campaignAddress: ${campaignAddress}`);
      const campaignContractInterface = await getCampaignContractInterface(campaignAddress);

      // Get a list accounts from the web3 instance.
      const accounts = await web3.eth.getAccounts();
      
      // Call Campaign contract's createRequest method      
      await campaignContractInterface.methods.createRequest(
        this.state.description, 
        web3.utils.toWei(this.state.ether, "ether"),
        this.state.recipient
      ).send({
        from: accounts[0]
      });

      // Redirect to requests index page
      Router.pushRoute(`/campaigns/${campaignAddress}/requests`);
    } catch(err){
      this.setState({ errorMessage: err.message });
    } finally{
      this.setState({ loading: false });
    };
  }

  render() {
    return (
      <div>
        <Layout>
          <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
            <a>Back</a>
          </Link>

          <h3>Create a Request</h3>

          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Description</label>
              <Input value={this.state.description} 
                      onChange={ event => this.setState({ description: event.target.value })} />
            </Form.Field>

            <Form.Field>
              <label>Amount in Ether</label>
              <Input value={this.state.ether} 
                      onChange={ event => this.setState({ ether: event.target.value })} />
            </Form.Field>
            
            <Form.Field>
              <label>Recipient</label>
              <Input value={this.state.recipient} 
                      onChange={ event => this.setState({ recipient: event.target.value })} />
            </Form.Field>

            <Message error header='Oops' list={[this.state.errorMessage]} />

            <Button loading={this.state.loading} primary>Create</Button>

          </Form>

        </Layout>
      </div>
    );
  }
}