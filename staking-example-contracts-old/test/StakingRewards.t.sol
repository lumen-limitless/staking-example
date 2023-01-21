// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "src/SteakToken.sol";
import "src/StakingRewards.sol";

contract StakingRewardsTest is Test {
    SteakToken public steakToken;
    StakingRewards public stakingRewards;

    address public user1;
    address public user2;
    address public user3;
    address public user4;
    address public user5;

    function setUp() public {
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        user4 = makeAddr("user4");
        user5 = makeAddr("user5");
        
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
        vm.deal(user3, 1 ether);
        vm.deal(user4, 1 ether);
        vm.deal(user5, 1 ether);

        steakToken = new SteakToken(1000 ether);
        stakingRewards = new StakingRewards(address(steakToken), address(steakToken));

        steakToken.setMinter(address(stakingRewards));
        stakingRewards.setRewardRate(1 ether);

        steakToken.transfer(user1, 200 ether);
        steakToken.transfer(user2, 200 ether);
        steakToken.transfer(user3, 200 ether);
        steakToken.transfer(user4, 200 ether);
        steakToken.transfer(user5, 200 ether);
    }

    function test_initialValues() public {
        assertEq(address(this), stakingRewards.owner());
        assertEq(address(this), steakToken.owner());
        assertEq(address(stakingRewards), steakToken.minter());
    }

    function test_revert_Stake0() public {
        vm.expectRevert();
        vm.prank(user1);
        stakingRewards.stake(0);
    }

    function test_stake() public {
        vm.startPrank(user1);
        steakToken.approve(address(stakingRewards), 200 ether);
        stakingRewards.stake(200 ether);
        vm.stopPrank();

        assertEq(steakToken.balanceOf(user1), 0);
        assertEq(stakingRewards.balanceOf(user1), 200 ether);
        assertEq(stakingRewards.lastUpdateTime(), block.timestamp);
        assertEq(stakingRewards.totalSupply(), 200 ether);
    }

    function test_fuzz_stake(uint256 amount) public {
        vm.assume(amount < 200 ether && amount > 0);

        vm.startPrank(user1);
        steakToken.approve(address(stakingRewards), 200 ether);
        stakingRewards.stake(amount);
        vm.stopPrank();

        assertEq(stakingRewards.balanceOf(user1), amount);
        assertEq(steakToken.balanceOf(user1), 200 ether - amount);
        assertEq(stakingRewards.totalSupply(), amount);
    }

    function test_fuzz_earned(uint256 time) public {
        test_stake();
        vm.assume(time > block.timestamp + 1 && time < block.timestamp + 1_000_000_000_000);
        vm.warp(time);
        assertEq(stakingRewards.earned(user1), stakingRewards.rewardRate() * (time - stakingRewards.lastUpdateTime()));
    }

    function test_revert_withdraw0() public {
        test_stake();

        vm.expectRevert();
        vm.prank(user1);
        stakingRewards.withdraw(0);
    }

    function test_fuzz_withdraw(uint256 amount) public {
        test_stake();
        vm.assume(amount > 0 && amount <= stakingRewards.balanceOf(user1));

        uint256 prevBal = stakingRewards.balanceOf(user1);
        uint256 prevSupply = stakingRewards.totalSupply();
        vm.prank(user1);
        stakingRewards.withdraw(amount);
        assertEq(stakingRewards.balanceOf(user1), prevBal - amount);
        assertEq(stakingRewards.totalSupply(), prevSupply - amount);
    }

    function test_exit() public {
        test_stake();

        vm.warp(block.timestamp + 1000);

        uint256 bal = steakToken.balanceOf(user1);
        uint256 staked = stakingRewards.balanceOf(user1);
        uint256 earned = stakingRewards.earned(user1);

        vm.prank(user1);
        stakingRewards.exit();
        assertEq(steakToken.balanceOf(user1), bal + staked + earned);
    }

    function test_fuzz_exit(uint256 time) public {
        test_stake();

        vm.assume(time > block.timestamp + 1 && time < block.timestamp + 1_000_000_000_000);
        vm.warp(time);

        uint256 bal = steakToken.balanceOf(user1);
        uint256 staked = stakingRewards.balanceOf(user1);
        uint256 earned = stakingRewards.earned(user1);

        vm.prank(user1);
        stakingRewards.exit();
        assertEq(steakToken.balanceOf(user1), bal + staked + earned);
    }
}
