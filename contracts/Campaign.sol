pragma solidity ^0.4.17;

contract Campaign {
    // These fields are stored on storage (disk)
    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    Request[] public requests;

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimumContrib) public {
        manager = msg.sender;
        minimumContribution = minimumContrib;
    }
    
    function contribute() public payable {
        // The sent ether should be higher than minimumContribution (in wei)
        require(msg.value > minimumContribution);
        
        // Keep the sender's address into approvers.
        approvers.push(msg.sender);
        
        // TODO: Keep the sender's value into Approver's Funds Hashtable
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {
        // Put 'memory' keyword to indicate that newRequest should be created in RAM
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false
        });

        requests.push(newRequest);
    }

    function getApprovers() public restricted view returns (address[]){
        return approvers;
    }
}
