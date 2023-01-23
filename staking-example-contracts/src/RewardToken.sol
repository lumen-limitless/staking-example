// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {Owned} from "solmate/auth/Owned.sol";

/// @title RewardToken
/// @author lumenlimitless.eth
/// @notice the reward token
contract RewardToken is ERC20, Owned {
    // =============================================================
    //                         STATE
    // =============================================================
    /// @notice mapping of address with mint rights
    /// @dev only address with mint rights can mint
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

    constructor(address owner_) Owned(owner_) ERC20("RewardToken", "RWRD", 18) {
        isMinter[owner_] = true;
        _mint(owner_, 1_000_000_000e18);
    }

    // =============================================================
    //                         EXTERNAL FUNCTIONS
    // =============================================================

    /// @notice mint new tokens
    /// @dev Explain to a developer any extra details
    /// @param to the address to mint the tokens to
    /// @param amount the amount of tokens to mint
    function mint(address to, uint256 amount) external onlyOwnerOrMinter {
        _mint(to, amount);
    }

    /// @notice sets minter role for the address
    /// @param minter the address of the minter
    /// @param canMint true if the address can mint the token
    function setMinter(address minter, bool canMint) external onlyOwner {
        isMinter[minter] = canMint;
    }
}
