// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {CREATE3Script} from "../base/CREATE3Script.sol";
import {StakeToken} from "src/StakeToken.sol";
import {RewardToken} from "src/RewardToken.sol";

contract DeployToken is CREATE3Script {
    constructor() CREATE3Script(vm.envString("VERSION")) {}

    function run() external returns (StakeToken stakeToken, RewardToken rewardToken) {
        uint256 deployerPrivateKey = uint256(vm.envBytes32("PRIVATE_KEY"));
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // =============================================================
        //                   STAKING TOKEN DEPLOYMENT
        // =============================================================
        stakeToken = StakeToken(
            create3.deploy(
                getCreate3ContractSalt("StakeToken"), bytes.concat(type(StakeToken).creationCode, abi.encode(deployer))
            )
        );

        // =============================================================
        //                  REWARD TOKEN DEPLOYMENT
        // =============================================================
        rewardToken = RewardToken(
            create3.deploy(
                getCreate3ContractSalt("RewardToken"),
                bytes.concat(type(RewardToken).creationCode, abi.encode(deployer))
            )
        );

        vm.stopBroadcast();
    }
}
