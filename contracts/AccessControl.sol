// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./utils/Strings.sol";

contract AccessControl {
    using Strings for string;
    
    struct Role {
        string name;
        string description;
        bytes32[] permissions;
        mapping(address => bool) members;
        address[] memberList;
    }
    
    struct Permission {
        string resource;
        string action;
        bool granted;
    }
    
    address public admin;
    mapping(string => Role) public roles;
    mapping(string => bool) public roleExists;
    mapping(bytes32 => bool) public permissions;
    mapping(address => string) public userRoles;
    
    event RoleCreated(string indexed roleName, string description);
    event RoleGranted(string indexed roleName, address indexed member);
    event RoleRevoked(string indexed roleName, address indexed member);
    event PermissionGranted(string resource, string action, string roleName);
    event PermissionRevoked(string resource, string action, string roleName);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyRole(string memory roleName) {
        require(
            roles[roleName].members[msg.sender],
            "Caller does not have required role"
        );
        _;
    }
    
    constructor() {
        admin = msg.sender;
        
        // Create default roles
        _createRole("PATIENT", "Medical record owners");
        _createRole("DOCTOR", "Medical professionals");
        _createRole("ADMIN", "System administrators");
        _createRole("SUPER_ADMIN", "Super administrators");
        
        // Grant admin role to deployer
        _grantRole("SUPER_ADMIN", msg.sender);
    }
    
    function createRole(string memory roleName, string memory description) 
        external 
        onlyAdmin 
    {
        _createRole(roleName, description);
    }
    
    function _createRole(string memory roleName, string memory description) internal {
        require(!roleExists[roleName], "Role already exists");
        
        roles[roleName].name = roleName;
        roles[roleName].description = description;
        roleExists[roleName] = true;
        
        emit RoleCreated(roleName, description);
    }
    
    function grantRole(string memory roleName, address member) 
        external 
        onlyAdmin 
    {
        _grantRole(roleName, member);
    }
    
    function _grantRole(string memory roleName, address member) internal {
        require(roleExists[roleName], "Role does not exist");
        require(!roles[roleName].members[member], "Member already has role");
        
        roles[roleName].members[member] = true;
        roles[roleName].memberList.push(member);
        userRoles[member] = roleName;
        
        emit RoleGranted(roleName, member);
    }
    
    function revokeRole(string memory roleName, address member) 
        external 
        onlyAdmin 
    {
        require(roleExists[roleName], "Role does not exist");
        require(roles[roleName].members[member], "Member does not have role");
        
        roles[roleName].members[member] = false;
        
        // Remove from memberList
        for (uint i = 0; i < roles[roleName].memberList.length; i++) {
            if (roles[roleName].memberList[i] == member) {
                roles[roleName].memberList[i] = roles[roleName].memberList[roles[roleName].memberList.length - 1];
                roles[roleName].memberList.pop();
                break;
            }
        }
        
        delete userRoles[member];
        
        emit RoleRevoked(roleName, member);
    }
    
    function addPermission(
        string memory roleName, 
        string memory resource, 
        string memory action
    ) external onlyAdmin {
        bytes32 permissionHash = keccak256(abi.encodePacked(resource, action));
        
        require(!permissions[permissionHash], "Permission already exists");
        
        permissions[permissionHash] = true;
        roles[roleName].permissions.push(permissionHash);
        
        emit PermissionGranted(resource, action, roleName);
    }
    
    function removePermission(
        string memory roleName, 
        string memory resource, 
        string memory action
    ) external onlyAdmin {
        bytes32 permissionHash = keccak256(abi.encodePacked(resource, action));
        
        require(permissions[permissionHash], "Permission does not exist");
        
        permissions[permissionHash] = false;
        
        // Remove from role's permissions
        bytes32[] storage rolePerms = roles[roleName].permissions;
        for (uint i = 0; i < rolePerms.length; i++) {
            if (rolePerms[i] == permissionHash) {
                rolePerms[i] = rolePerms[rolePerms.length - 1];
                rolePerms.pop();
                break;
            }
        }
        
        emit PermissionRevoked(resource, action, roleName);
    }
    
    function hasPermission(
        address user, 
        string memory resource, 
        string memory action
    ) external view returns (bool) {
        string memory roleName = userRoles[user];
        
        if (Strings.compare(roleName, "")) {
            return false;
        }
        
        bytes32 permissionHash = keccak256(abi.encodePacked(resource, action));
        bytes32[] storage rolePerms = roles[roleName].permissions;
        
        for (uint i = 0; i < rolePerms.length; i++) {
            if (rolePerms[i] == permissionHash) {
                return permissions[permissionHash];
            }
        }
        
        return false;
    }
    
    function getUserRole(address user) external view returns (string memory) {
        return userRoles[user];
    }
    
    function getRoleMembers(string memory roleName) 
        external 
        view 
        returns (address[] memory) 
    {
        return roles[roleName].memberList;
    }
    
    function getRolePermissions(string memory roleName) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return roles[roleName].permissions;
    }
}