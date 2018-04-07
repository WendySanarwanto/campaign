import React, { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/client/web3';

import getCampaignContractInterface from '../../ethereum/client/getCampaignContractInterface';

export default class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaignAddress = props.query.campaignAddress;

        try {
            // Get instance of Campaign contract's interface
            const campaignContractInterface = await getCampaignContractInterface(campaignAddress);

            // Call Campaign contract's getSummary method
            const campaignContractSummary = await campaignContractInterface.methods.getSummary().call();

            // Return the summary result
            return {
                minimumContribution: campaignContractSummary[0],
                contractBalance: campaignContractSummary[1],
                requestsLength: campaignContractSummary[2],
                contributorsCount: campaignContractSummary[3],
                managerAddress: campaignContractSummary[4]
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
            header: `${web3.utils.fromWei(minimumContribution, 'ether')} ETH`,
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
            header: `${web3.utils.fromWei(contractBalance, 'ether')} ETH`,
            meta: 'Campaign Balance (Ether)',
            description: 'The balance is how much money this campaign has left to spend.'
        }];

        return <Card.Group items={items} />
    }

    render() {
        return (
            <div>
                <Layout>
                    <h3> Campaign Shown</h3>
                    <Grid>
                        <Grid.Column width={10}>
                            {this.renderCards()}    
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm />
                        </Grid.Column>
                    </Grid>                    
                </Layout>
            </div>
        )
    }
};
