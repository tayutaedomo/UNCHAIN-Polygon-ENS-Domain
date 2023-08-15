// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import { StringUtils } from "./libraries/StringUtils.sol";

import "hardhat/console.sol";

contract Domains {
    string public tld;

    mapping (string => address) public domains;
    mapping (string => string) public records;

    constructor(string memory _tld) payable {
        tld = _tld;
        console.log("THIS IS MY DOMAINS CONTRACT. NICE.");
    }

    function price(string calldata name) public pure returns (uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0);

        if (len == 3) {
            return 0.005 ether;
        } else if (len == 4) {
            return 0.003 ether;
        } else {
            return 0.001 ether;
        }
    }

    function register(string calldata domain) public payable {
        require(domains[domain] == address(0));

        uint _price = price(domain);
        require(msg.value >= _price, "Not enough MATIC paid");

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
