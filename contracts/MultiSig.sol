// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract MultiSigWallet is Initializable{
    using EnumerableSet for EnumerableSet.AddressSet;
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public numConfirmationsRequired;
    address public governance;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
        address[] confirmers;
    }
    struct Phase {
        uint startHeight;
        address[] miners;
        uint preHeight;
    }

    // mapping from tx index => owner => bool
    mapping(uint => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;
    
    modifier onlyOwner() {
        //get owner from governance contract
        owners = getCurrentConsensus(); 
        numConfirmationsRequired = threshold(owners.length);         
        require( containsValue(owners, msg.sender), "not owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }
    
    function initialize(address[] memory _owners,uint _numConfirmationsRequired)public initializer{
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );
     
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
	}



    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction(
        address _to,
        uint _value,
        bytes memory _data
    ) public  onlyOwner returns (uint index){
        uint txIndex = transactions.length;
        
        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0,
                confirmers:new address[](0)
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
        return txIndex;
    }

    function confirmTransaction(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;
        transaction.confirmers.push(msg.sender);  //
        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(
            (transaction.numConfirmations >= numConfirmationsRequired),
            "cannot execute tx"
        );
        
        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "tx failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
         address[] storage confirmers =  transaction.confirmers;
        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");
        
        uint index = indexOf(confirmers, msg.sender); 
        require(index < confirmers.length, "Index out of bounds");
        confirmers[index] = confirmers[confirmers.length-1];
        confirmers.pop();
        transaction.confirmers = confirmers;
        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;
        
        
        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(
        uint _txIndex
    )
        public
        view
        returns (
            address to,
            uint value,
            bytes memory data,
            bool executed,
            uint numConfirmations,
            address[] memory confirmers
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations,
            transaction.confirmers
        );
    }

    function getGovernance() public view returns (address) {
        return governance;
    }

    function getCurrentPhase() public view returns (Phase memory) {  
       
      (bool success, bytes memory result) = address(governance).staticcall('getCurrentPhase()');
      require(success,"MultiSig: getCurrentPhase failed");
      Phase memory dd = abi.decode(result, (Phase));
      return dd;
    }

    function getCurrentConsensus() public  view returns (address[] memory) {      
      Phase memory phase = getCurrentPhase();
      return phase.miners;         
    }

    function containsValue(address[] memory arr, address value) public pure returns (bool) {       
        for (uint i = 0; i < arr.length; i++) {           
            if (arr[i] == value) {
                return true;
            }
        }        
        return false;
    }

    function threshold (uint x) public pure  returns (uint) {        
       uint b;

       if (2*x % 3 ==0){
           b = 2 * x /3;          
       }else{
          b = 2 * x /3 +1;
       }

        return b;    
     }

    function indexOf(address[] memory addressArr,address value) public pure returns (uint) {
        // Loop through the array
        for (uint i = 0; i < addressArr.length; i++) {
            // Check if the element matches the value
            if (addressArr[i] == value) {
                // Return the index
                return i;
            }
        }        
       revert("Not Found");
    } 
}
