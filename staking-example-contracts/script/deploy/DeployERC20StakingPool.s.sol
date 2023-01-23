// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {CREATE3Script} from "../base/CREATE3Script.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {ERC20StakingPool} from "playpen/ERC20StakingPool.sol";
import {StakingPoolFactory} from "playpen/StakingPoolFactory.sol";

contract DeployERC20StakingPool is CREATE3Script {
    constructor() CREATE3Script(vm.envString("VERSION")) {}

    function run() external returns (ERC20StakingPool pool) {
        uint256 deployerPrivateKey = uint256(vm.envBytes32("PRIVATE_KEY"));

        address deployer = vm.addr(deployerPrivateKey);

        StakingPoolFactory factory =
            StakingPoolFactory(create3.getDeployed(deployer, getCreate3ContractSalt("StakingPoolFactory")));

        ERC20 stakeToken = ERC20(create3.getDeployed(deployer, getCreate3ContractSalt("StakeToken")));

        ERC20 rewardToken = ERC20(create3.getDeployed(deployer, getCreate3ContractSalt("RewardToken")));

        vm.startBroadcast(deployerPrivateKey);

        pool = factory.createERC20StakingPool(rewardToken, stakeToken, 365 days);

        /// @dev set deployer as reward distributor
        ERC20StakingPool(pool).setRewardDistributor(deployer, true);

        vm.stopBroadcast();
    }
}
