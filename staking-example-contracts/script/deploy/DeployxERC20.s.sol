// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {CREATE3Script} from "../base/CREATE3Script.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {xERC20} from "playpen/xERC20.sol";
import {StakingPoolFactory} from "playpen/StakingPoolFactory.sol";

contract DeployxERC20 is CREATE3Script {
    constructor() CREATE3Script(vm.envString("VERSION")) {}

    function run() external returns (xERC20 pool) {
        uint256 deployerPrivateKey = uint256(vm.envBytes32("PRIVATE_KEY"));

        address deployer = vm.addr(deployerPrivateKey);

        StakingPoolFactory factory =
            StakingPoolFactory(create3.getDeployed(deployer, getCreate3ContractSalt("StakingPoolFactory")));

        ERC20 stakingToken = ERC20(create3.getDeployed(deployer, getCreate3ContractSalt("SteakToken")));

        vm.startBroadcast(deployerPrivateKey);

        pool = factory.createXERC20("SteakPool", "xSTEAK", uint8(18), stakingToken, type(uint64).max - 1);

        vm.stopBroadcast();
    }
}
