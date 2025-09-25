// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./utils/Strings.sol";

contract DoctorRegistry {
    using Strings for string;

    struct Doctor {
        address doctorAddress;
        string did;
        string licenseNumber;
        string specialization;
        string department;
        bool isVerified;
        uint256 verifiedAt;
        uint256 createdAt;
    }

    address public admin;
    mapping(string => Doctor) public doctors;
    mapping(string => bool) public usedLicenses;
    mapping(address => string) public addressToDid;

    event DoctorRegistered(string indexed doctorDid, address doctorAddress);
    event DoctorVerified(string indexed doctorDid, address verifiedBy);
    event DoctorRevoked(string indexed doctorDid, address revokedBy);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyVerifiedDoctor() {
        require(
            doctors[addressToDid[msg.sender]].isVerified,
            "Only verified doctors can perform this action"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerDoctor(
        string memory doctorDid,
        string memory licenseNumber,
        string memory specialization,
        string memory department
    ) external {
        require(!doctors[doctorDid].createdAt > 0, "Doctor already registered");
        require(!usedLicenses[licenseNumber], "License number already in use");
        require(!doctorDid.isEmpty(), "DID cannot be empty");

        doctors[doctorDid] = Doctor({
            doctorAddress: msg.sender,
            did: doctorDid,
            licenseNumber: licenseNumber,
            specialization: specialization,
            department: department,
            isVerified: false,
            verifiedAt: 0,
            createdAt: block.timestamp
        });

        addressToDid[msg.sender] = doctorDid;
        usedLicenses[licenseNumber] = true;

        emit DoctorRegistered(doctorDid, msg.sender);
    }

    function verifyDoctor(string memory doctorDid) external onlyAdmin {
        require(doctors[doctorDid].createdAt > 0, "Doctor not registered");
        require(!doctors[doctorDid].isVerified, "Doctor already verified");

        doctors[doctorDid].isVerified = true;
        doctors[doctorDid].verifiedAt = block.timestamp;

        emit DoctorVerified(doctorDid, msg.sender);
    }

    function revokeDoctor(string memory doctorDid) external onlyAdmin {
        require(doctors[doctorDid].isVerified, "Doctor not verified");

        doctors[doctorDid].isVerified = false;
        usedLicenses[doctors[doctorDid].licenseNumber] = false;

        emit DoctorRevoked(doctorDid, msg.sender);
    }

    function isDoctorVerified(string memory doctorDid) external view returns (bool) {
        return doctors[doctorDid].isVerified;
    }

    function getDoctor(string memory doctorDid) external view returns (Doctor memory) {
        return doctors[doctorDid];
    }

    function getDoctorByAddress(address doctorAddress) external view returns (Doctor memory) {
        return doctors[addressToDid[doctorAddress]];
    }
}