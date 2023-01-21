// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract SigUtils {
    bytes32 internal DOMAIN_SEPARATOR;

    constructor(bytes32 _DOMAIN_SEPARATOR) {
        DOMAIN_SEPARATOR = _DOMAIN_SEPARATOR;
    }

    // keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    bytes32 public constant PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;

    struct Permit {
        address owner;
        address spender;
        uint256 value;
        uint256 nonce;
        uint256 deadline;
    }

    // computes the hash of a permit
    function getStructHash(Permit memory _permit) internal pure returns (bytes32) {
        return keccak256(
            abi.encode(PERMIT_TYPEHASH, _permit.owner, _permit.spender, _permit.value, _permit.nonce, _permit.deadline)
        );
    }

    // computes the hash of the fully encoded EIP-712 message for the domain, which can be used to recover the signer
    function getTypedDataHash(Permit memory _permit) public view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, getStructHash(_permit)));
    }
}

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract ExampleERC20 is ERC20("ExampleERC20", "ERC20"), ERC20Permit("ExampleERC20") {
    constructor() {
        _mint(msg.sender, 999 ether);
    }
}

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ExampleERC721 is ERC721("ExampleERC721", "ERC721") {
    constructor() {
        _mint(msg.sender, 0);
        _mint(msg.sender, 1);
        _mint(msg.sender, 2);
    }
}

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ExampleERC1155 is ERC1155("ExampleERC1155") {
    constructor() {
        _mint(msg.sender, 0, 1, "");
        _mint(msg.sender, 1, 100 ether, "");
    }
}
