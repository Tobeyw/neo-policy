// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";


contract PolicyProxy is TransparentUpgradeableProxy {
    constructor(address _logic, address _admin) TransparentUpgradeableProxy(_logic, _admin, ''){
    }

    function getImplementation() external view returns (address implementation_) {
        return _getImplementation();
    }
}