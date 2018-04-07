import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input } from 'semantic-ui-react';

export default class CampaignNew extends Component {
  state = {
    minimumContribution: ''
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form>
          <Form.Field>
            <label>Minimum Contribution</label>
<<<<<<< HEAD
            <Input label="wei" 
                   labelPosition="right" 
                   value={this.state.minimumContribution}
                   onChange={ event => 
                    this.setState({minimumContribution: event.target.value}) } />
=======
            <Input label="wei" labelPosition="right" />
>>>>>>> 3baf6405b830b8f6d29ec442a3ae697d50295b3c
          </Form.Field>

          <Button primary>Create!</Button>
        </Form>
      </Layout>
    );
  };
}