// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Strings {
    function compare(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function toHash(string memory s) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(s));
    }

    function isEmpty(string memory s) internal pure returns (bool) {
        return bytes(s).length == 0;
    }
}