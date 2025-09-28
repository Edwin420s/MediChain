// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./utils/Strings.sol";

contract AccessControl {
    using Strings for string;

    struct Access {
        string recordId;
        string patientDid;
        string doctorDid;
        uint256 grantedAt;
        uint256 expiresAt;
        bool isActive;
    }

    address public admin;
    mapping(string => Access) public accesses;
    mapping(string => string[]) public patientAccesses;

    event AccessGranted(string indexed recordId, string patientDid, string doctorDid, uint256 expiresAt);
    event AccessRevoked(string indexed recordId, string patientDid, string doctorDid);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function grantAccess(
        string memory recordId,
        string memory patientDid,
        string memory doctorDid,
        uint256 duration
    ) external onlyAdmin {
        require(!accesses[recordId].isActive, "Access already granted for this record");

        uint256 expiresAt = block.timestamp + duration;
        
        accesses[recordId] = Access({
            recordId: recordId,
            patientDid: patientDid,
            doctorDid: doctorDid,
            grantedAt: block.timestamp,
            expiresAt: expiresAt,
            isActive: true
        });

        patientAccesses[patientDid].push(recordId);

        emit AccessGranted(recordId, patientDid, doctorDid, expiresAt);
    }

    function revokeAccess(string memory recordId) external onlyAdmin {
        require(accesses[recordId].isActive, "Access not active");

        accesses[recordId].isActive = false;

        emit AccessRevoked(recordId, accesses[recordId].patientDid, accesses[recordId].doctorDid);
    }

    function hasAccess(string memory recordId, string memory doctorDid) external view returns (bool) {
        Access memory access = accesses[recordId];
        
        if (!access.isActive) return false;
        if (block.timestamp > access.expiresAt) return false;
        
        return Strings.compare(access.doctorDid, doctorDid);
    }

    function getAccess(string memory recordId) external view returns (Access memory) {
        return accesses[recordId];
    }

    function getPatientAccesses(string memory patientDid) external view returns (string[] memory) {
        return patientAccesses[patientDid];
    }
}