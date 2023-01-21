// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract SteakToken is ERC20, ERC20Permit {
    // =============================================================
    //                            STATE
    // =============================================================
    address public immutable owner;
    address public minter;

    mapping(address => uint256) public lastFaucetMint;

    // =============================================================
    //                            EVENTS
    // =============================================================

    event MinterSet(address newMinter);

    // =============================================================
    //                            MODIFIERS
    // =============================================================
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // =============================================================
    //                            CONSTRUCTOR
    // =============================================================
    constructor(uint256 initialSupply) ERC20("Steak Token", "STEAK") ERC20Permit("Steak Token") {
        owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    modifier onlyOncePerDay() {
        require(block.timestamp - lastFaucetMint[msg.sender] > 1 days);
        _;
    }

    modifier onlyMinterOrOwner() {
        require(msg.sender == minter || msg.sender == owner);
        _;
    }

    // =============================================================
    //                            FUNCTIONS
    // =============================================================
    function setMinter(address newMinter) external onlyOwner {
        require(newMinter != address(0));
        minter = newMinter;

        emit MinterSet(newMinter);
    }

    function mint(uint256 amount, address to) public onlyMinterOrOwner {
        _mint(to, amount);
    }

    function faucetMint() public onlyOncePerDay {
        lastFaucetMint[msg.sender] = block.timestamp;
        _mint(msg.sender, 100e18);
    }
}
