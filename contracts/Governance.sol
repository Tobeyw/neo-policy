// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Governance{    

     struct Phase {
        uint startHeight;
        address[] miners;
        uint preHeight;
    }
    
    Phase public phase;
     constructor(address[] memory _owner){
          phase.miners = _owner;
    }

    function getCurrentPhase() external view returns (Phase memory)
      {
       return phase;
            
      }
}