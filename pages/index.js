import React, { Component } from 'react';
import campaignFactory from '../ethereum/client/campaign-factory';

export default class CampaignIndex extends Component {

  //#region Load the data on server side
  
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
    return <h1>{this.props.campaigns[0]}</h1>;
  }
  
  //#endregion

  //#region Load the data on front end

  // state = {
  //   campaigns: []
  // };

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
  //   return <h1>{this.state.campaigns[0]}</h1>;
  // }

  //#endregion
}

