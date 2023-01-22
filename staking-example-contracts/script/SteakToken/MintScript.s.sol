// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {CREATE3Script} from "../base/CREATE3Script.sol";
import {SteakToken} from "src/SteakToken.sol";

contract MintScript is CREATE3Script {
    constructor() CREATE3Script(vm.envString("VERSION")) {}

    function run() external {
        uint256 deployerPrivateKey = uint256(vm.envBytes32("PRIVATE_KEY"));
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        SteakToken steakToken = SteakToken(create3.getDeployed(deployer, getCreate3ContractSalt("SteakToken")));

        steakToken.mint(deployer, 1000000000e18);

        vm.stopBroadcast();
    }
}
