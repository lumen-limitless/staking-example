// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {Owned} from "solmate/auth/Owned.sol";

contract StakeToken is ERC20, Owned {
    // =============================================================
    //                         STATE
    // =============================================================
    mapping(address => uint256) public lastFaucetMint;
    mapping(address => bool) public isMinter;

    // =============================================================
    //                         MODIFIERS
    // =============================================================

    /// @notice requires the last faucet mint timestamp plus 1 day is less than or equal to the current block.timestamp
    modifier onlyOncePerDay() {
        require(lastFaucetMint[msg.sender] + 1 days <= block.timestamp);
        _;
    }

    modifier onlyOwnerOrMinter() {
        require(msg.sender == owner || isMinter[msg.sender]);
        _;
    }
    // =============================================================
    //                         CONSTRUCTOR
    // =============================================================

    constructor(address owner_) Owned(owner_) ERC20("StakeToken", "STAKE", 18) {
        _mint(owner_, 1000e18);
    }

    // =============================================================
    //                         EXTERNAL FUNCTIONS
    // =============================================================

    function faucetMint() external onlyOncePerDay {
        lastFaucetMint[msg.sender] = block.timestamp;
        _mint(msg.sender, 100e18);
    }

    function mint(address to, uint256 amount) external onlyOwnerOrMinter {
        _mint(to, amount);
    }

    function setMinter(address newMinter, bool canMint) external onlyOwner {
        isMinter[newMinter] = canMint;
    }
}
