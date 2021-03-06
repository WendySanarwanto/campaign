import React, { Component } from 'react';
import { Button, Card, Grid, Message } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/client/web3';
import { Link } from '../../routes';

import getCampaignContractInterface from '../../ethereum/client/getCampaignContractInterface';

export default class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaignAddress = props.query.campaignAddress;

        try {
            // Get instance of Campaign contract's interface
            const campaignContractInterface = await getCampaignContractInterface(campaignAddress);
            if (campaignContractInterface === null) {
              throw new Error(`Web3 instance is not available. Have you installed Metamask yet ? 
              Follow the instructions in this link to install Metamask on your Chrome or Firefox browser: https://metamask.io/`);
            }

            // Call Campaign contract's getSummary method
            const campaignContractSummary = await campaignContractInterface.methods.getSummary().call();

            // Return the summary result
            console.log(`[DEBUG] - <CampaignShow.getInitialProps> campaignContractSummary: \n`, campaignContractSummary);
            return {
                minimumContribution: campaignContractSummary[0],
                contractBalance: campaignContractSummary[1],
                requestsLength: campaignContractSummary[2],
                contributorsCount: campaignContractSummary[3],
                managerAddress: campaignContractSummary[4],
                campaignAddress: campaignAddress
            };
        } catch(err) {
            console.log(`[ERROR] - <show.getInitialProps> details: \n`, err);
            return { errorMessage: err.message }
        }

        return {};
    }

  renderCards() {
    const {
        minimumContribution,
        contractBalance,
        requestsLength,
        contributorsCount,
        managerAddress
    } = this.props;

    const items = [{
        header: managerAddress,
        meta: 'Address of Manager',
        description: 'The manager created this campaign and can create requests to withdraw money.',
        style: { overflowWrap: 'break-word' }
    }, {
        header: `${web3.utils.fromWei(minimumContribution.toString(), 'ether')} ETH`,
        meta: 'Minimum Contribution (ether)',
        description: 'You must contribute at least this much ether to become an contributor.'
    }, {
        header: requestsLength,
        meta: 'Number of Requests',
        description: 'a request tries to withdraw money from the contract. Requests must be approved by contributors.'
    }, {
        header: contributorsCount,
        meta: 'Number of Contributors',
        description: 'Number of people who have already contributed to this campaign.'
    }, {
        header: `${web3.utils.fromWei(contractBalance.toString(), 'ether')} ETH`,
        meta: 'Campaign Balance (Ether)',
        description: 'The balance is how much money this campaign has left to spend.'
    }];

    return <Card.Group items={items} />
  }

  renderGrids = () => {
    return (
      <Grid>

        <Grid.Row>
            <Grid.Column width={10}>
                {this.renderCards()}                                                                                    
            </Grid.Column>

            <Grid.Column width={6}>
                <ContributeForm campaignAddress={this.props.campaignAddress}/>
            </Grid.Column>
        </Grid.Row>

        <Grid.Row>
            <Grid.Column>
                <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                    <a>
                        <Button primary>View Requests</Button>
                    </a>
                </Link>
            </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  
  render() {
    return (
      <div>
        <Layout>
          <h3> Campaign Shown</h3>
          { 
            !!this.props.errorMessage ? ( <Message error header='Oops' list={[this.props.errorMessage]} /> )
              : this.renderGrids()
          }
        </Layout>
      </div>
    )
  }
};
