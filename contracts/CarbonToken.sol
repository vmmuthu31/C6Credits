// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonToken is ERC20 {
    constructor() ERC20("CarbonToken", "CTN") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals()))); // Initial mint to the deployer, can be modified as per requirement
    }
    
    function mint(address to, uint256 amount) public {
        // Add your access control logic here (e.g., onlyOwner)
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}

