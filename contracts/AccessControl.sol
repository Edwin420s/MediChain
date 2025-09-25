// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./utils/Strings.sol";

contract AccessControl {
    using Strings for string;

    struct AccessRule {
        string recordId;
        string doctorDid;
        uint256 grantedAt;
        uint256 expiryDate;
        bool isActive;
    }

    address public admin;
    mapping(string => mapping(string => AccessRule)) public accessRules;

    event AccessGranted(string indexed recordId, string indexed doctorDid, uint256 expiryDate);
    event AccessRevoked(string indexed recordId, string indexed doctorDid);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function grantAccess(
        string memory recordId,
        string memory doctorDid,
        uint256 expiryDate
    ) external onlyAdmin {
        require(expiryDate > block.timestamp, "Expiry date must be in the future");

        accessRules[recordId][doctorDid] = AccessRule({
            recordId: recordId,
            doctorDid: doctorDid,
            grantedAt: block.timestamp,
            expiryDate: expiryDate,
            isActive: true
        });

        emit AccessGranted(recordId, doctorDid, expiryDate);
    }

    function revokeAccess(string memory recordId, string memory doctorDid) external onlyAdmin {
        AccessRule storage rule = accessRules[recordId][doctorDid];
        require(rule.grantedAt > 0, "Access rule not found");

        rule.isActive = false;
        emit AccessRevoked(recordId, doctorDid);
    }

    function hasAccess(string memory recordId, string memory doctorDid) external view returns (bool) {
        AccessRule memory rule = accessRules[recordId][doctorDid];
        
        if (rule.grantedAt == 0) return false;
        if (!rule.isActive) return false;
        if (block.timestamp > rule.expiryDate) return false;

        return true;
    }

    function getAccessRule(string memory recordId, string memory doctorDid) 
        external 
        view 
        returns (AccessRule memory) 
    {
        return accessRules[recordId][doctorDid];
    }
}