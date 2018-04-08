import React, { Component } from 'react';
import Layout from '../../../components/Layout';

export default class RequestNew extends Component {
  static getInitialProps(props) {
    const campaignAddress = props.query.campaignAddress;
    return { campaignAddress };
  }

  render() {
    return (
      <div>
        <Layout>
          <h3>New Request</h3>
        </Layout>
      </div>
    );
  }
}