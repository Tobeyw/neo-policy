
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Context.sol"; 
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Policy is Context{
    using EnumerableSet for EnumerableSet.AddressSet;
    address public  multi;    //多签地址
    uint public  minGasPrice ;
    mapping(address=>bool) public isBlackListed;
    EnumerableSet.AddressSet  blackList;
    bool private initialized;
   

    function initialize(address _multi)public{
        minGasPrice = 10000000;
        multi = _multi;
        initialized = true;
	}

     modifier onlyOwner() {
         require(_msgSender() == multi, "Policy: onlyOwner");
        _;
    }
    // 设置最低 GASPRICE
    function setMinGasPrice (uint _gasPrice) external onlyOwner {
        require(_gasPrice > 0, "Policy: setMinGasPrice invalid parameter");
        minGasPrice = _gasPrice;    
    }
    //查询最低GSAPRICE
    function getMinGasPrice () external view returns (uint) {
        return minGasPrice;
    }

   //加入/取消 黑名单
    function setBlackList (address _addr,bool _isBlackListed) external onlyOwner {
        isBlackListed[_addr] = _isBlackListed;  
        if (_isBlackListed){
           require( blackList.add(_addr), "Policy: blacklisted add error");
        }else{
           require( blackList.remove(_addr), "Policy: blacklisted remove error");
        }
           
    }
    
     //查地址有没有被加入黑名单
    function isBlackList(address _maker) external view returns (bool) {
        return isBlackListed[_maker];
    }
    // 设置 owner 方法，只有共识节点可以调用，某个地址收集到足够投票（2/3共识）后生效
    function changeOwner(address _addr) external onlyOwner() {
       multi = _addr;  
    }
     // 获取 owner
    function getOwner() external view returns (address){
         return multi;
    }


}
