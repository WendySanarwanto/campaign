import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import web3 from '../ethereum/client/web3';

export default class RequestRow extends Component {
    render() {
        const { Cell, Row } = Table;
        const { approversCount, campaignAddress, id, request } = this.props;
        const { approvalCount, complete, description, recipient, value } = request;
        
        return (
            <Row>
                <Cell>{id+1}</Cell>
                <Cell>{description}</Cell>
                <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
                <Cell>{recipient}</Cell>
                <Cell>{approvalCount}/{approversCount}</Cell>
                <Cell></Cell>
                <Cell></Cell>
            </Row>
        );
    }
};
