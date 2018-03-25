pragma solidity ^0.4.17;

contract Campaign {
    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
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
    
    function getApprovers() public view returns (address[]){
        return approvers;
    }
}
