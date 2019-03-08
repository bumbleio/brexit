pragma solidity 0.4.25;

contract brexit {
    // Model remain or leave
    struct Option {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store options
    // Fetch options
    mapping(uint => Option) public Options;
    // Store Candidates Count
    uint public optionCount;
    address public contractOwner;
    address public leaveOwner;
    address public remainOwner;
    uint256 public remainTotal;
    uint256 public leaveTotal;

    // voted event
    event votedEvent (
        uint indexed _optionId
    );
    
    event ownerChangeEvent ( address _newOwner, uint _optionId );

    constructor () public {
        contractOwner = msg.sender;
        addOption("Leave");
        addOption("Remain");
    }

    function addOption (string _LeaveOrRemain) private {
        optionCount ++;
        Options[optionCount] = Option(optionCount, _LeaveOrRemain, 0);
    }

    function vote (uint _optionId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_optionId > 0 && _optionId <= optionCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        Options[_optionId].voteCount ++;

        // trigger voted event
        emit votedEvent(_optionId);
    }

// function donate to the respective campaign remain or leave
    function donate(uint _optionId) payable public {
        require(_optionId > 0 && _optionId <= optionCount);
        // amount += msg.value;
        if(_optionId == 1) {
            leaveTotal += msg.value;
        } else if (_optionId == 2) {
            remainTotal += msg.value; 
        }
    }

    function changeOwner(address _newOwner,uint _optionId) public {
        require(contractOwner == msg.sender);
         if(_optionId == 1) {
            leaveOwner = _newOwner;
            emit ownerChangeEvent(_newOwner, _optionId);
        } else if (_optionId == 2) {
            remainOwner = _newOwner;
            emit ownerChangeEvent(_newOwner, _optionId);
        }
    }

    function withdrawLeave(uint _amount) public {
        require(leaveOwner == msg.sender);
        require(_amount <= leaveTotal);
        leaveTotal -= _amount;
        msg.sender.transfer(_amount);
    }


}
    