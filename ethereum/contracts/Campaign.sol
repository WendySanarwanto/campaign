pragma solidity ^0.4.17;

contract Campaign {
    // These fields are stored on storage (disk)
    address public manager;             // address of person who is managing this campaign
    uint public minimumContribution;    // Minimum donation required to be considered  a contributor or 'approver'
    // NOTE: number of approvers can grow over time. In return, this will force us to create 'for' looping
    //       logic to find an approver. The more approvers in the array, the more time to take for finding 
    //       an approver. The more time to take for executing a logic, the more gas will need to be paid.
    //       Thus, it's expensive. Solution: Replace dynamic array with Mapping, because finding item will
    //       take constant amount of time, regardless of how many amount of items within the mapping.
    // address[] public approvers;  
    mapping (address=>bool) public approvers;  // List of addresses for every person who has donated money
    mapping (address=>uint) public donatedMoney; // List of donated money mapped to the contributor
    Request[] public requests;          // List of requests that the manager has created.
    uint public approversCount;         // Indicate total number of donators/apporvers.

    /**
     * Represent a Request created by manager for making payment to other verndors to provide required good or services
     * to be used for building the  product.
     */
    struct Request {
        string description;                 // Purpose of request.
        uint value;                         // Ether to transfer
        address recipient;                  // Who gets the money
        bool complete;                      // Whether the request is done
        mapping(address => bool) approvals; // Track who has voted
        uint approvalCount;                 // Track number of approvals
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    /**
     * Constructor function that sets the minimumContribution and the Owner
     */
    function Campaign(uint minimumContrib, address creator) public {
        manager = creator;
        minimumContribution = minimumContrib;
    }
    
    /** 
     * Called when someone wants to donate money to the campaign and become an `approver` 
    */
    function contribute() public payable {
        // The sent ether should be higher than minimumContribution (in wei)
        require(msg.value > minimumContribution);
        
        // Keep the sender's address into approvers.
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;            
            approversCount++;
        }

        // Keep the sender's value into Approver's Funds Mapping
        donatedMoney[msg.sender] += msg.value;
    }
    
    /** 
     * Created by the manager to create a new `spending request`
    */
    function createRequest(string description, uint value, address recipient) public restricted {
        // Put 'memory' keyword to indicate that newRequest should be created in RAM
        // Note that we only need to initialise Request's value types.
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    /**
     * Called by each contributor to approve a spending request.
    */
    function approveRequest(uint index) public {
        Request storage request = requests[index];

        // Ensure that the sender is a donator of this campaign
        require(approvers[msg.sender]);

        // Ensure that the donator has not voted this request yet.
        require(!request.approvals[msg.sender]);

        // Mark this donator as a approver of this request
        request.approvals[msg.sender] = true;

        // Increment number of approvals on this request.
        request.approvalCount++;
    }

    /**
     * After a request has gotten enough approvals, the manager can call this to get money sent to the vendor.
     * A request is eligible to be finalised if there are more than 50 % of total donators approved this Request.
     */
    function finaliseRequest(uint index) public restricted {
        Request storage request = requests[index];

        // Check if number of votes on this request is higher than 50% of total donators.
        require(request.approvalCount > approversCount/2);

        // Check if the request has not been set as completed
        require(!request.complete);

        // Send the money to Request's recipient
        request.recipient.transfer(request.value);

        // Set the request as completed
        request.complete = true;
    }

    /**
     * Re-claim donated fund and also exit the donator.
     */
    function claimFund() public {
        // Ensure that the sender is a donator of this campaign
        require(approvers[msg.sender]);

        // Send donated money back to the contributor        
        msg.sender.transfer(donatedMoney[msg.sender]);

        // Deactivate the contributor
        approvers[msg.sender] = false;
        donatedMoney[msg.sender] = 0;
        approversCount--;
    }
}
