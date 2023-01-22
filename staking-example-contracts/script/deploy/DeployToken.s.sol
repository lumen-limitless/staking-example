// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {CREATE3Script} from "../base/CREATE3Script.sol";
import {SteakToken} from "src/SteakToken.sol";
import {CookedSteakToken} from "src/CookedSteakToken.sol";

contract DeployToken is CREATE3Script {
    constructor() CREATE3Script(vm.envString("VERSION")) {}

    function run() external returns (SteakToken stakingToken, CookedSteakToken rewardToken) {
        uint256 deployerPrivateKey = uint256(vm.envBytes32("PRIVATE_KEY"));
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // =============================================================
        //                   STAKING TOKEN DEPLOYMENT
        // =============================================================
        stakingToken = SteakToken(
            create3.deploy(
                getCreate3ContractSalt("SteakToken"), bytes.concat(type(SteakToken).creationCode, abi.encode(deployer))
            )
        );

        // =============================================================
        //                  REWARD TOKEN DEPLOYMENT
        // =============================================================
        rewardToken = CookedSteakToken(
            create3.deploy(
                getCreate3ContractSalt("CookedSteakToken"),
                bytes.concat(type(CookedSteakToken).creationCode, abi.encode(deployer))
            )
        );

        vm.stopBroadcast();
    }
}
