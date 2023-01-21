# StakingRewards
[Git Source](https://github.com/lumen-limitless/staking-example-contracts/blob/017a93bd48a62b826e2061f0b36575dedc9d4786/src/StakingRewards.sol)

**Inherits:**
Ownable, Pausable, ReentrancyGuard

**Author:**
Lumen Limitless https://github.com/lumen-limitless

*modified from https://github.com/Synthetixio/synthetix/blob/develop/contracts/StakingRewards.sol*


## State Variables
### stakingToken

```solidity
address public immutable stakingToken;
```


### rewardToken

```solidity
address public immutable rewardToken;
```


### rewardRate

```solidity
uint256 public rewardRate;
```


### lastUpdateTime

```solidity
uint256 public lastUpdateTime;
```


### rewardPerTokenStored

```solidity
uint256 public rewardPerTokenStored;
```


### totalSupply

```solidity
uint256 public totalSupply;
```


### userRewardPerTokenPaid

```solidity
mapping(address => uint256) public userRewardPerTokenPaid;
```


### rewards

```solidity
mapping(address => uint256) public rewards;
```


### balanceOf

```solidity
mapping(address => uint256) public balanceOf;
```


## Functions
### updateReward


```solidity
modifier updateReward(address account);
```

### constructor


```solidity
constructor(address stakingToken_, address rewardToken_);
```

### exit

Withdraw total balance of msg.sender from contract and claim any rewards in 1 transaction

**


```solidity
function exit() external;
```

### stake

stake amount tokens in contract

**


```solidity
function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|the amount of tokens to stake|


### stakeWithPermit

stake amount of tokens in contract, approving the transfer with an ERC2612 permit

**


```solidity
function stakeWithPermit(uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
    external
    nonReentrant
    whenNotPaused
    updateReward(msg.sender);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|the amount of tokens to stake|
|`deadline`|`uint256`|the deadline of the transfer|
|`v`|`uint8`|recovery id|
|`r`|`bytes32`|signature|
|`s`|`bytes32`|signature|


### togglePaused

toggles pause functionality

*only stake functions can be paused, withdraws still available*


```solidity
function togglePaused() external onlyOwner;
```

### recoverERC20

recovers ERC20 tokens accidently sent to contract

*can only be called by contract owner*


```solidity
function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`tokenAddress`|`address`|the token address|
|`tokenAmount`|`uint256`|the amount of tokens|


### setRewardRate

sets reward rate

*this is the amount of tokens distributed per second*


```solidity
function setRewardRate(uint256 rate) external onlyOwner updateReward(address(0));
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`rate`|`uint256`|the rate of rewards|


### getRewardForDuration

returns the total reward distributed for the specified duration


```solidity
function getRewardForDuration(uint256 duration) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`duration`|`uint256`|the length of time to calculate the total reward|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|the total reward|


### name

ERC-20 name


```solidity
function name() external pure returns (string memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|name|


### symbol

ERC-20 symbol


```solidity
function symbol() external pure returns (string memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|symbol|


### decimals

ERC-20 decimals


```solidity
function decimals() external pure returns (uint8);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint8`|decimals|


### getReward

receive all rewards available for msg.sender


```solidity
function getReward() public nonReentrant updateReward(msg.sender);
```

### withdraw

Withdraws amount tokens from the contract


```solidity
function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|The amount to withdraw|


### earned

returns the earnings for the specified account


```solidity
function earned(address account) public view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`account`|`address`|the address of the account to fetch earnings for|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|current earnings for the account|


### lastTimeRewardApplicable

retuns the latest timestamp that rewards can be distributed for

*In this contract, rewards are distributed for unlimited duration, so this returns the current block.timestamp*


```solidity
function lastTimeRewardApplicable() public view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|the latest timestamp that rewards can be distributed for|


### rewardPerToken

The reward amount per token

**


```solidity
function rewardPerToken() public view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|reward amount per token|


## Events
### RewardRateSet

```solidity
event RewardRateSet(uint256 rewardRate);
```

### Staked

```solidity
event Staked(address indexed user, uint256 amount);
```

### Withdrawn

```solidity
event Withdrawn(address indexed user, uint256 amount);
```

### RewardPaid

```solidity
event RewardPaid(address indexed user, uint256 reward);
```

### RewardsDurationUpdated

```solidity
event RewardsDurationUpdated(uint256 newDuration);
```

### Recovered

```solidity
event Recovered(address token, uint256 amount);
```

