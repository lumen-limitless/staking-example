# SteakToken
[Git Source](https://github.com/lumen-limitless/staking-example-contracts/blob/017a93bd48a62b826e2061f0b36575dedc9d4786/src/SteakToken.sol)

**Inherits:**
ERC20, ERC20Permit


## State Variables
### owner

```solidity
address public immutable owner;
```


### minter

```solidity
address public minter;
```


### lastFaucetMint

```solidity
mapping(address => uint256) public lastFaucetMint;
```


## Functions
### onlyOwner


```solidity
modifier onlyOwner();
```

### constructor


```solidity
constructor(uint256 initialSupply) ERC20("Steak Token", "STEAK") ERC20Permit("Steak Token");
```

### onlyOncePerDay


```solidity
modifier onlyOncePerDay();
```

### onlyMinterOrOwner


```solidity
modifier onlyMinterOrOwner();
```

### setMinter


```solidity
function setMinter(address newMinter) external onlyOwner;
```

### mint


```solidity
function mint(uint256 amount, address to) public onlyMinterOrOwner;
```

### faucetMint


```solidity
function faucetMint() public onlyOncePerDay;
```

## Events
### MinterSet

```solidity
event MinterSet(address newMinter);
```

