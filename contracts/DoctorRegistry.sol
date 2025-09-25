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
        bool isVerified;
        uint256 createdAt;
    }

    address public admin;
    mapping(string => Doctor) public doctors;
    mapping(string => bool) public verifiedLicenses;

    event DoctorRegistered(string indexed doctorDid, address doctorAddress);
    event DoctorVerified(string indexed doctorDid, address verifiedBy);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerDoctor(
        string memory doctorDid,
        address doctorAddress,
        string memory licenseNumber,
        string memory specialization
    ) external onlyAdmin {
        require(!doctors[doctorDid].isVerified, "Doctor already registered");
        require(!verifiedLicenses[licenseNumber], "License number already in use");

        doctors[doctorDid] = Doctor({
            doctorAddress: doctorAddress,
            did: doctorDid,
            licenseNumber: licenseNumber,
            specialization: specialization,
            isVerified: false,
            createdAt: block.timestamp
        });

        emit DoctorRegistered(doctorDid, doctorAddress);
    }

    function verifyDoctor(string memory doctorDid) external onlyAdmin {
        require(doctors[doctorDid].createdAt > 0, "Doctor not registered");
        require(!doctors[doctorDid].isVerified, "Doctor already verified");

        doctors[doctorDid].isVerified = true;
        verifiedLicenses[doctors[doctorDid].licenseNumber] = true;

        emit DoctorVerified(doctorDid, msg.sender);
    }

    function isDoctorVerified(string memory doctorDid) external view returns (bool) {
        return doctors[doctorDid].isVerified;
    }

    function getDoctor(string memory doctorDid) external view returns (Doctor memory) {
        return doctors[doctorDid];
    }
}