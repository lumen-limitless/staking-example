// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";

interface IERC20Mintable {
    function mint(uint256 amount, address to) external;
}

/// @author Lumen Limitless https://github.com/lumen-limitless
/// @dev modified from https://github.com/Synthetixio/synthetix/blob/develop/contracts/StakingRewards.sol
contract StakingRewards is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Permit;

    // =============================================================
    //                            STATE
    // =============================================================

    address public immutable stakingToken;
    address public immutable rewardToken;

    // Reward to be paid out per second
    uint256 public rewardRate;
    // Minimum of last updated time and reward finish time
    uint256 public lastUpdateTime;
    // Sum of (reward rate * dt * 1e18 / total supply)
    uint256 public rewardPerTokenStored;
    // Total staked
    uint256 public totalSupply;

    // User address => rewardPerTokenStored
    mapping(address => uint256) public userRewardPerTokenPaid;
    // User address => rewards to be claimed
    mapping(address => uint256) public rewards;
    // User address => staked amount
    mapping(address => uint256) public balanceOf;

    // =============================================================
    //                            EVENTS
    // =============================================================

    event RewardRateSet(uint256 rewardRate);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event Recovered(address token, uint256 amount);

    // =============================================================
    //                          MODIFIERS
    // =============================================================

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();

        if (account != address(0)) {
            //update rewards for account
            rewards[account] = earned(account);
            //update userRewardPerTokenPaid for account
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }

        _;
    }

    // =============================================================
    //                         CONSTRUCTOR
    // =============================================================

    constructor(address stakingToken_, address rewardToken_) {
        require(stakingToken_ != address(0) && rewardToken_ != address(0));
        stakingToken = stakingToken_;
        rewardToken = rewardToken_;
    }

    // =============================================================
    //                      EXTERNAL FUNCTIONS
    // =============================================================

    /// @notice Withdraw total balance of msg.sender from contract and claim any rewards in 1 transaction
    /// @dev
    function exit() external {
        withdraw(balanceOf[msg.sender]);
        getReward();
    }

    /// @notice stake amount tokens in contract
    /// @dev
    /// @param amount the amount of tokens to stake
    function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");

        totalSupply += amount;
        balanceOf[msg.sender] += amount;
        IERC20(stakingToken).safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    /// @notice stake amount of tokens in contract, approving the transfer with an ERC2612 permit
    /// @dev
    /// @param amount the amount of tokens to stake
    /// @param deadline the deadline of the transfer
    /// @param v recovery id
    /// @param r signature
    /// @param s signature
    function stakeWithPermit(uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
        external
        nonReentrant
        whenNotPaused
        updateReward(msg.sender)
    {
        require(amount > 0, "Cannot stake 0");

        totalSupply += amount;
        balanceOf[msg.sender] += amount;
        IERC20Permit(stakingToken).safePermit(msg.sender, address(this), amount, deadline, v, r, s);
        IERC20(stakingToken).safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    /// @notice toggles pause functionality
    /// @dev only stake functions can be paused, withdraws still available
    function togglePaused() external onlyOwner {
        paused() ? _unpause() : _pause();
    }

    /// @notice recovers ERC20 tokens accidently sent to contract
    /// @dev can only be called by contract owner
    /// @param tokenAddress the token address
    /// @param tokenAmount the amount of tokens
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        require(
            tokenAddress != address(stakingToken) && tokenAddress != address(rewardToken),
            "Cannot withdraw staking/reward token"
        );
        require(IERC20(tokenAddress).transfer(msg.sender, tokenAmount));

        emit Recovered(tokenAddress, tokenAmount);
    }

    /// @notice sets reward rate
    /// @dev this is the amount of tokens distributed per second
    /// @param rate the rate of rewards
    function setRewardRate(uint256 rate) external onlyOwner updateReward(address(0)) {
        rewardRate = rate;

        emit RewardRateSet(rewardRate);
    }

    /// @notice returns the total reward distributed for the specified duration
    /// @param duration the length of time to calculate the total reward
    /// @return the total reward
    function getRewardForDuration(uint256 duration) external view returns (uint256) {
        return rewardRate * duration;
    }

    /// @notice ERC-20 name
    /// @return name
    function name() external pure returns (string memory) {
        return "Staking Rewards";
    }

    /// @notice ERC-20 symbol
    /// @return symbol
    function symbol() external pure returns (string memory) {
        return "sSTEAK";
    }

    /// @notice ERC-20 decimals
    /// @return decimals
    function decimals() external pure returns (uint8) {
        return 18;
    }

    // =============================================================
    //                      PUBLIC FUNCTIONS
    // =============================================================

    /// @notice receive all rewards available for msg.sender
    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            IERC20Mintable(rewardToken).mint(reward, msg.sender);

            emit RewardPaid(msg.sender, reward);
        }
    }

    /// @notice Withdraws amount tokens from the contract
    /// @param amount The amount to withdraw
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        totalSupply -= amount;
        balanceOf[msg.sender] -= amount;
        IERC20(stakingToken).safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /// @notice returns the earnings for the specified account
    /// @param account the address of the account to fetch earnings for
    /// @return current earnings for the account
    function earned(address account) public view returns (uint256) {
        return ((balanceOf[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) + rewards[account];
    }

    /// @notice retuns the latest timestamp that rewards can be distributed for
    /// @dev In this contract, rewards are distributed for unlimited duration, so this returns the current block.timestamp
    /// @return the latest timestamp that rewards can be distributed for
    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp;
    }

    /// @notice The reward amount per token
    /// @dev
    /// @return reward amount per token
    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored + (((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18) / totalSupply);
    }
}
