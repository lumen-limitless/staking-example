// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {CREATE3Script} from "../base/CREATE3Script.sol";
import {StakeToken} from "src/StakeToken.sol";
import {xERC20} from "playpen/xERC20.sol";
import {ERC20StakingPool} from "playpen/ERC20StakingPool.sol";
import {ERC20StakingPoolPerpetual} from "playpen/ERC20StakingPoolPerpetual.sol";
import {ERC721StakingPool} from "playpen/ERC721StakingPool.sol";
import {StakingPoolFactory} from "playpen/StakingPoolFactory.sol";

contract DeployFactory is CREATE3Script {
    constructor() CREATE3Script(vm.envString("VERSION")) {}

    function run()
        external
        returns (
            xERC20 xERC20Implementation,
            ERC20StakingPool ERC20StakingPoolImplementation,
            ERC20StakingPoolPerpetual ERC20StakingPoolPerpetualImplementation,
            ERC721StakingPool ERC721StakingPoolImplementation,
            StakingPoolFactory stakingPoolFactory
        )
    {
        uint256 deployerPrivateKey = uint256(vm.envBytes32("PRIVATE_KEY"));

        vm.startBroadcast(deployerPrivateKey);

        // =============================================================
        //                         xERC20 implementation
        // =============================================================
        xERC20Implementation = xERC20(
            create3.deploy(getCreate3ContractSalt("xERC20"), bytes.concat(type(xERC20).creationCode, abi.encode()))
        );

        // =============================================================
        //                 ERC20StakingPool implementation
        // =============================================================
        ERC20StakingPoolImplementation = ERC20StakingPool(
            create3.deploy(
                getCreate3ContractSalt("ERC20StakingPool"),
                bytes.concat(type(ERC20StakingPool).creationCode, abi.encode())
            )
        );

        // =============================================================
        //                 ERC20StakingPoolPerpetual implementation
        // =============================================================
        ERC20StakingPoolPerpetualImplementation = ERC20StakingPoolPerpetual(
            create3.deploy(
                getCreate3ContractSalt("ERC20StakingPoolPerpetual"),
                bytes.concat(type(ERC20StakingPoolPerpetual).creationCode, abi.encode())
            )
        );

        // =============================================================
        //                  ERC721StakingPool implementation
        // =============================================================
        ERC721StakingPoolImplementation = ERC721StakingPool(
            create3.deploy(
                getCreate3ContractSalt("ERC721StakingPool"),
                bytes.concat(type(ERC721StakingPool).creationCode, abi.encode())
            )
        );

        // =============================================================
        //                   StakingPoolFactory deployment
        // =============================================================
        stakingPoolFactory = StakingPoolFactory(
            create3.deploy(
                getCreate3ContractSalt("StakingPoolFactory"),
                bytes.concat(
                    type(StakingPoolFactory).creationCode,
                    abi.encode(
                        address(xERC20Implementation),
                        address(ERC20StakingPoolImplementation),
                        address(ERC20StakingPoolPerpetualImplementation),
                        address(ERC721StakingPoolImplementation)
                    )
                )
            )
        );

        vm.stopBroadcast();
    }
}
