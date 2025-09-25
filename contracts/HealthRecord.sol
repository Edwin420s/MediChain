// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./utils/Strings.sol";

contract HealthRecord {
    using Strings for string;
    
    struct Patient {
        address patientAddress;
        string did;
        bool exists;
        uint256 createdAt;
    }
    
    struct MedicalRecord {
        string recordId;
        string patientDid;
        string cid; // IPFS Content ID
        string recordHash;
        string recordType;
        address uploadedBy;
        uint256 createdAt;
    }
    
    struct Consent {
        string recordId;
        string patientDid;
        string doctorDid;
        bool isActive;
        uint256 expiryDate;
        uint256 grantedAt;
    }
    
    address public admin;
    mapping(string => Patient) public patients;
    mapping(string => MedicalRecord) public records;
    mapping(string => Consent) public consents;
    mapping(string => bool) public usedHashes;
    
    event PatientRegistered(string indexed patientDid, address patientAddress);
    event RecordCreated(string indexed recordId, string patientDid, string cid);
    event ConsentGranted(string indexed recordId, string patientDid, string doctorDid);
    event ConsentRevoked(string indexed recordId, string patientDid, string doctorDid);
    
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
    
    function registerPatient(string memory patientDid, address patientAddress) external onlyAdmin {
        require(!patients[patientDid].exists, "Patient already registered");
        
        patients[patientDid] = Patient({
            patientAddress: patientAddress,
            did: patientDid,
            exists: true,
            createdAt: block.timestamp
        });
        
        emit PatientRegistered(patientDid, patientAddress);
    }
    
    function createRecord(
        string memory recordId,
        string memory patientDid,
        string memory cid,
        string memory recordHash,
        string memory recordType
    ) external onlyAdmin {
        require(patients[patientDid].exists, "Patient not registered");
        require(!usedHashes[recordHash], "Record hash already used");
        
        records[recordId] = MedicalRecord({
            recordId: recordId,
            patientDid: patientDid,
            cid: cid,
            recordHash: recordHash,
            recordType: recordType,
            uploadedBy: msg.sender,
            createdAt: block.timestamp
        });
        
        usedHashes[recordHash] = true;
        
        emit RecordCreated(recordId, patientDid, cid);
    }
    
    function grantConsent(
        string memory recordId,
        string memory patientDid,
        string memory doctorDid,
        uint256 expiryDate
    ) external onlyPatientOrAdmin(patientDid) {
        require(records[recordId].createdAt > 0, "Record does not exist");
        
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
    
    function revokeConsent(string memory recordId, string memory patientDid) 
        external 
        onlyPatientOrAdmin(patientDid) 
    {
        require(consents[recordId].grantedAt > 0, "Consent not found");
        
        consents[recordId].isActive = false;
        
        emit ConsentRevoked(recordId, patientDid, consents[recordId].doctorDid);
    }
    
    function verifyConsent(string memory recordId, string memory doctorDid) 
        external 
        view 
        returns (bool) 
    {
        Consent memory consent = consents[recordId];
        
        if (consent.grantedAt == 0) return false;
        if (!consent.isActive) return false;
        if (block.timestamp > consent.expiryDate) return false;
        
        return Strings.equal(consent.doctorDid, doctorDid);
    }
    
    function getRecord(string memory recordId) 
        external 
        view 
        returns (MedicalRecord memory) 
    {
        return records[recordId];
    }
    
    function patientExists(string memory patientDid) external view returns (bool) {
        return patients[patientDid].exists;
    }
}