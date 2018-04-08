import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Router } from '../../routes';

import factory from '../../ethereum/client/campaign-factory';
import web3 from '../../ethereum/client/web3';

export default class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  /**
   * Handle form submission 
   * Note: Arrow function is used so that we can get proper `this` reference inside.
   */
  onSubmit = async (event) => {
    // Prevent the browser from submitting the form (refresh page)
    event.preventDefault();

    // Display loading spinning throbber and clear prior error message
    this.setState({ loading: true, errorMessage: '' });

    // TOOD: Move this into service class 
    try {
      // Get a list accounts from the web3 instance.
      const accounts = await web3.eth.getAccounts();

      // Execute createCampaign contract method 
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });

      // Redirect to landing view
      Router.pushRoute(`/`);
    } catch(err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input label="wei" 
                   labelPosition="right" 
                   value={this.state.minimumContribution}
                   onChange={ event => 
                    this.setState({minimumContribution: event.target.value}) } />
          </Form.Field>
          
          <Message error header='Oops' list={[this.state.errorMessage]} />

          <Button loading={this.state.loading} primary>Create!</Button>
        </Form>
      </Layout>
    );
  };
}