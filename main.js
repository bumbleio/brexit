window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
		window.web3 = new Web3(web3.currentProvider);
		// displayMmWarning("hidden");
        displayDonations();
        getVoteCount();
        getContractOwner();
        getLeaveOwner();
        getRemainOwner();
    } else {
		console.log('No Web3 Detected... using HTTP Provider')
		displayMmWarning("visible");
		window.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/486eb31222ab427d9a80d5efa33280ce")); // change for your provider, this is currently for ganache-cli
		displayDonations();
        getVoteCount();
        getContractOwner();
        getLeaveOwner();
        getRemainOwner();
    }
});

contractABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newOwner",
				"type": "address"
			},
			{
				"name": "_optionId",
				"type": "uint256"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_optionId",
				"type": "uint256"
			}
		],
		"name": "donate",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_optionId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawLeave",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawRemain",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_optionId",
				"type": "uint256"
			}
		],
		"name": "votedEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_newOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_optionId",
				"type": "uint256"
			}
		],
		"name": "ownerChangeEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_optionId",
				"type": "uint256"
			}
		],
		"name": "donateEvent",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "contractOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "leaveOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "leaveTotal",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "optionCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Options",
		"outputs": [
			{
				"name": "id",
				"type": "uint256"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "remainOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "remainTotal",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];



    contractAddress = '0xba1777f4646ea9e32eafa6cbf6fa5c7dec87698f';    // add your contract address              
    tokenContract = web3.eth.contract(contractABI).at(contractAddress);
    
    // sets up a event object that connects to our smart contract event
    var voteEvent = tokenContract.votedEvent();
    // This function watches for vote events and refreshs the page when the event triggers
    voteEvent.watch(function(error, result){
        if (!error)
            {
                console.log("vote event fired");
                getVoteCount();
            } else {
                
                console.log(error);
            }
    });

    // sets up a event object that connects to our smart contract event
    var ownerChangeEvent = tokenContract.ownerChangeEvent();
    // This function watches for vote events and refreshs the page when the event triggers
    ownerChangeEvent.watch(function(error, result){
        if (!error)
            {
                console.log("owner change event fired -new owner " + result.args._newOwner + " for " + result.args._optionId);
                if (result.args._optionId == 1) {
                    console.log("got to number1");
                    getLeaveOwner();
                } else if (result.args._optionId == 2) {
                    console.log("got to number2");
                    getRemainOwner();
                } else {
					console.log("else happend")
				}
            } else {
                
                console.log(error);
            }
    });

 // sets up a event object that connects to our smart contract event
 var donateEvent = tokenContract.donateEvent();
 // This function watches for vote events and refreshs the page when the event triggers
 donateEvent.watch(function(error, result){
	 if (!error)
		 {
			 console.log("donate event fired " + result.args._optionId);
			 if (result.args._optionId == 1) {
				 console.log("got to number1");
				 displayDonations();
			 } else if (result.args._optionId == 2) {
				 console.log("got to number2");
				 displayDonations();
			 } else {
				 console.log("else happend")
			 }
		 } else {
			 
			 console.log(error);
		 }
 });


    

function getBalance() {
    var address, wei, balance
    address = document.getElementById("address").value
    try {
        web3.eth.getBalance(address, function (error, wei) {
            if (!error) {
                var balance = web3.fromWei(wei, 'ether');
                document.getElementById("output").innerHTML = balance + " ETH";
            }
        });
    } catch (err) {

        document.getElementById("output").innerHTML = err;
    }
}


function getWeb3Version() {

    var version = web3.version.api;            
    document.getElementById("web3version").innerHTML = version;
    console.log(version)
}

function getContractOwner() {
    
    tokenContract.contractOwner(function (error, result) {
    if (!error) {
        console.log(result);
        document.getElementById("contractOwner").innerHTML = "Contract Owner " + result;
    } else {
        console.error(error);
    }    
});
};

function getLeaveOwner() {
    
    tokenContract.leaveOwner(function (error, result) {
    if (!error) {
        console.log(result);
        document.getElementById("leaveOwner").innerHTML = "Leave Owner " + result;
    } else {
        console.error(error);
    }    
});
};

function getRemainOwner() {
    
    tokenContract.remainOwner(function (error, result) {
    if (!error) {
        console.log(result);
        document.getElementById("remainOwner").innerHTML = "Remain Owner " + result;
    } else {
        console.error(error);
    }    
});
};


function getVoteCount() {

 tokenContract.Options(1, function (error, result) {
 if (!error) {
     console.log('leave count = ' + result[2]);
     document.getElementById("voteLeave").innerHTML ='Votes for leave: ' + result[2];
 } else {
     console.error(error);
 }    
});

  tokenContract.Options(2, function (error, result) {
  if (!error) {
      console.log('Remain count = ' + result[2]);
      document.getElementById("voteRemain").innerHTML ='Votes for remain: ' + result[2];
  } else {
      console.error(error);
  }    
});

}

function Vote(userVote) {
    console.log(userVote)
    tokenContract.vote(userVote, function (error, result) {
    if (!error) {
        console.log('vote for leave successful');
        // document.getElementById("contractOwner").innerHTML = result;
    } else {
        console.error(error);
    }    
});
}


function donate(recipitant, amount) {
	var weiAmount = web3.toWei(amount, 'ether');
    //amountInWei = amount; 
    //console.log("amount = " + amount + "recipitent = " + recipitant)
    tokenContract.donate.sendTransaction(recipitant,{value:weiAmount}, function (error, result) {
  if (!error) {
        console.log('Donation Successful');
    } else {
        console.error(error);
    }    
});
}



function displayDonations() {

tokenContract.remainTotal( function (error, result) {
if (!error) {
    console.log('Remain Donation Amount = ' + result);

    document.getElementById("leaveAmount").innerHTML ='Remain Donation Amount: ' + web3.fromWei(result, 'ether');
} else {
    console.error(error);
}    
});

 tokenContract.leaveTotal( function (error, result) {
 if (!error) {
     console.log('Leave Donation Amount = ' + result);
     document.getElementById("remainAmount").innerHTML ='Leave Donation Amount: ' + web3.fromWei(result, 'ether');
 } else {
     console.error(error);
 }    
});

}


function donateForm() {
    var amountInEther;
    var option;
    amountInEther = document.getElementById("donation").value;
    console.log(amountInEther);
     // radio
    var radios = document.getElementsByName('gridRadios');

    for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
        option = radios[i].value;
        console.log(option);
        donate(option, amountInEther);
        break;
    }
}
    
        
}

function displayMmWarning(hideOrShow) {
	document.getElementById("metamaskWarning").style.visibility = hideOrShow;
	document.getElementById("metamaskWarning").style.color = "red";

}