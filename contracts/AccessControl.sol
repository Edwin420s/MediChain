// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./utils/Strings.sol";

contract AccessControl {
    using Strings for string;

    struct Consent {
        string recordId;
        string patientDid;
        string doctorDid;
        bool isActive;
        uint256 expiryDate;
        uint256 grantedAt;
    }

    mapping(string => Consent) public consents;
    mapping(string => bool) public emergencyAccess;

    event ConsentGranted(string indexed recordId, string patientDid, string doctorDid);
    event ConsentRevoked(string indexed recordId, string patientDid, string doctorDid);
    event EmergencyAccessGranted(string indexed patientDid, address grantedBy);
    event EmergencyAccessRevoked(string indexed patientDid, address revokedBy);

    modifier onlyPatient(string memory patientDid) {
        require(
            // In a real scenario, you would check the patient's identity
            // This is a simplified check
            msg.sender == address(this), // This is not correct, just a placeholder
            "Only patient can perform this action"
        );
        _;
    }

    function grantConsent(
        string memory recordId,
        string memory patientDid,
        string memory doctorDid,
        uint256 expiryDate
    ) external {
        require(!consents[recordId].grantedAt > 0, "Consent already granted");

        consents[recordId] = Consent({
            recordId: recordId,
            patientDid: patientDid,
            doctorDid: doctorDid,
            isActive: true,
            expiryDate: expiryDate,
            grantedAt: block.timestamp
        });

        emit ConsentGranted(recordId, patientDid, doctorDid);
    }

    function revokeConsent(string memory recordId, string memory patientDid) external {
        require(consents[recordId].grantedAt > 0, "Consent not found");

        consents[recordId].isActive = false;

        emit ConsentRevoked(recordId, patientDid, consents[recordId].doctorDid);
    }

    function grantEmergencyAccess(string memory patientDid) external {
        emergencyAccess[patientDid] = true;
        emit EmergencyAccessGranted(patientDid, msg.sender);
    }

    function revokeEmergencyAccess(string memory patientDid) external {
        emergencyAccess[patientDid] = false;
        emit EmergencyAccessRevoked(patientDid, msg.sender);
    }

    function verifyConsent(string memory recordId, string memory doctorDid) external view returns (bool) {
        Consent memory consent = consents[recordId];

        if (consent.grantedAt == 0) return false;
        if (!consent.isActive) return false;
        if (block.timestamp > consent.expiryDate) return false;

        return Strings.compare(consent.doctorDid, doctorDid);
    }

    function hasEmergencyAccess(string memory patientDid) external view returns (bool) {
        return emergencyAccess[patientDid];
    }
}