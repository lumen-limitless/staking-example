// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {Owned} from "solmate/auth/Owned.sol";

contract CookedSteakToken is ERC20, Owned {
    // =============================================================
    //                         STATE
    // =============================================================
    mapping(address => bool) public isMinter;

    // =============================================================
    //                         MODIFIERS
    // =============================================================

    modifier onlyOwnerOrMinter() {
        require(msg.sender == owner || isMinter[msg.sender]);
        _;
    }

    // =============================================================
    //                         CONSTRUCTOR
    // =============================================================

    constructor(address owner_) Owned(owner_) ERC20("CookedSteakToken", "CSTEAK", 18) {
        isMinter[owner_] = true;
        _mint(owner_, 1_000_000_000e18);
    }

    // =============================================================
    //                         EXTERNAL FUNCTIONS
    // =============================================================

    function mint(address to, uint256 amount) external onlyOwnerOrMinter {
        _mint(to, amount);
    }

    function setMinter(address newMinter, bool canMint) external onlyOwner {
        isMinter[newMinter] = canMint;
    }
}
