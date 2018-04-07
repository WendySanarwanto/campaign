import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/client/campaign-factory';
import web3 from '../../ethereum/client/web3';

export default class CampaignNew extends Component {
  state = {
    minimumContribution: ''
  };

  /**
   * Handle form submission 
   * Note: Arrow function is used so that we can get proper `this` reference inside.
   */
  onSubmit = async (event) => {
    // Prevent the browser from submitting the form (refresh page)
    event.preventDefault();

    // Get a list accounts from the web3 instance.
    const accounts = await web3.eth.getAccounts();

    // Execute createCampaign contract method 
    await factory.methods
      .createCampaign(this.state.minimumContribution)
      .send({
        from: accounts[0]
      });
  }

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input label="wei" 
                   labelPosition="right" 
                   value={this.state.minimumContribution}
                   onChange={ event => 
                    this.setState({minimumContribution: event.target.value}) } />
          </Form.Field>

          <Button primary onClick={ this.onSubmit }>Create!</Button>
        </Form>
      </Layout>
    );
  };
}