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
    mapping (address=>bool) approvers;  // List of addresses for every person who has donated money
    Request[] public requests;          // List of requests that the manager has created.

    /**
     * Represent a Request creted by manager for making payment to other verndors to provide required good or services
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
    function Campaign(uint minimumContrib) public {
        manager = msg.sender;
        minimumContribution = minimumContrib;
    }
    
    /** 
     * Called when someone wants to donate money to the campaign and become an `approver` 
    */
    function contribute() public payable {
        // The sent ether should be higher than minimumContribution (in wei)
        require(msg.value > minimumContribution);
        
        // Keep the sender's address into approvers.
        // approvers.push(msg.sender);
        approvers[msg.sender] = true;
        
        // TODO: Keep the sender's value into Approver's Funds Hashtable
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

    // TODO: Create `finaliseRequest` method.
}
