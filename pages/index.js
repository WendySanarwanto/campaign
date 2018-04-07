import React, { Component } from 'react';
import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

import campaignFactory from '../ethereum/client/campaign-factory';

export default class CampaignIndex extends Component {

  //#region Load the data on server side
  
  renderCampaigns() {
    const items = this.props.campaigns.map(campaignAddress => {
      return {
        header: campaignAddress,
        description:(
          <Link route={`/campaigns/${campaignAddress}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  /**
   * We are using Next.js. Therefore, we would like to retrieve deployed campaigns from server side.
   */
  static async getInitialProps() {
    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  /**
   * Render this component.
   */
  render() {
    return (
      <div>
        <Layout>
          <h3>Open Campaign</h3>
          <Link route="/campaigns/new">
            <a>
              <Button content="Create Campaign" icon="add circle" primary={true} floated="right" />
            </a>
          </Link>
          {this.renderCampaigns()}
        </Layout>
      </div>
    );
  }
  
  //#endregion

  //#region Load the data on front end

  // state = {
  //   campaigns: []
  // };

  // renderCampaigns() {
  //   const items = this.state.campaigns.map(campaign => {
  //     return {
  //       header: campaign,
  //       description: <a>View Campaign</a>,
  //       fluid: true
  //     };
  //   });

  //   return <Card.Group items={items} />;
  // }
  
  // /**
  //  * Initialise deployed campaigns from front end side.
  // */

  // async componentDidMount() {
  //   const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
  //   // console.log(`[DEBUG] - campaigns: \n`, campaigns);
  //   this.setState({campaigns});
  // }
  
  // /**
  //  * Render this component.
  //  */
  // render() {
  //   return <div>{this.renderCampaigns()}</div>;
  // }

  //#endregion
}

