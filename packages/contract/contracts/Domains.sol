// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract Domains {
    mapping (string => address) public domains;
    mapping (string => string) public records;

    constructor() {
        console.log("THIS IS MY DOMAINS CONTRACT. NICE.");
    }

    function register(string calldata domain) public {
        require(domains[domain] == address(0));
        domains[domain] = msg.sender;
        console.log("%s has registered a domain!", msg.sender);
    }

    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        require(domains[name] == msg.sender);
        records[name] = record;
    }

    function getRecord(string calldata name) public view returns (string memory) {
        return records[name];
    }
}
