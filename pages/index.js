import React, { Component } from 'react';
import {Card} from 'semantic-ui-react';
import campaignFactory from '../ethereum/client/campaign-factory';

export default class CampaignIndex extends Component {

  //#region Load the data on server side
  
  renderCampaigns() {
    const items = this.props.campaigns.map(campaign => {
      return {
        header: campaign,
        description: <a>View Campaign</a>,
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
    return <div>{this.renderCampaigns()}</div>;
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

