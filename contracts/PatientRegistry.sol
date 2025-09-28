// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./utils/Strings.sol";

contract PatientRegistry {
    using Strings for string;

    struct Patient {
        address patientAddress;
        string did;
        string name;
        uint256 dateOfBirth;
        string bloodType;
        string allergies;
        bool exists;
        uint256 createdAt;
    }

    address public admin;
    mapping(string => Patient) public patients;
    mapping(address => string) public addressToDid;

    event PatientRegistered(string indexed patientDid, address patientAddress);
    event PatientUpdated(string indexed patientDid, address updatedBy);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyPatientOrAdmin(string memory patientDid) {
        require(
            patients[patientDid].patientAddress == msg.sender || msg.sender == admin,
            "Only patient or admin can perform this action"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerPatient(
        string memory patientDid,
        string memory name,
        uint256 dateOfBirth,
        string memory bloodType,
        string memory allergies
    ) external onlyAdmin {
        require(!patients[patientDid].exists, "Patient already registered");
        require(!patientDid.isEmpty(), "DID cannot be empty");

        patients[patientDid] = Patient({
            patientAddress: msg.sender,
            did: patientDid,
            name: name,
            dateOfBirth: dateOfBirth,
            bloodType: bloodType,
            allergies: allergies,
            exists: true,
            createdAt: block.timestamp
        });

        addressToDid[msg.sender] = patientDid;

        emit PatientRegistered(patientDid, msg.sender);
    }

    function updatePatient(
        string memory patientDid,
        string memory bloodType,
        string memory allergies
    ) external onlyPatientOrAdmin(patientDid) {
        require(patients[patientDid].exists, "Patient not registered");

        patients[patientDid].bloodType = bloodType;
        patients[patientDid].allergies = allergies;

        emit PatientUpdated(patientDid, msg.sender);
    }

    function getPatient(string memory patientDid) external view returns (Patient memory) {
        require(patients[patientDid].exists, "Patient not registered");
        return patients[patientDid];
    }

    function patientExists(string memory patientDid) external view returns (bool) {
        return patients[patientDid].exists;
    }
}