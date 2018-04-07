import React, { Component } from 'react';
import Layout from '../../components/Layout';

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

    render() {
        return (
            <div>
                <Layout>
                    <h1> Show Campaign! </h1>
                </Layout>
            </div>
        )
    }
};
