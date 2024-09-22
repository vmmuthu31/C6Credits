// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CarbonToken.sol";
import "../interfaces/ISPHook.sol";
import "../interfaces/ISP.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ProjectRegistry is ISPHook {
    // ISP private s_baseIspContract;
    CarbonToken public tokenContract;
    uint256 public nextProjectId;

    struct Project {
        uint256 id;
        string name;
        string description;
        address payable owner;
        uint256 carbonOffset;
        uint256 tokenAward;
        bool isRegistered;
        uint256 tokenPrice;
    }

    mapping(uint256 => Project) public projects;

    event ProjectRegistered(
        uint256 indexed projectId,
        address indexed owner,
        uint256 tokenAward
    );
    event TokensPurchased(
        uint256 indexed projectId,
        address indexed buyer,
        uint256 amount,
        uint256 totalCost
    );

    constructor(address tokenAddress) {
        tokenContract = CarbonToken(tokenAddress);
        nextProjectId = 1;
        // s_baseIspContract = ISP(0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD);
    }

    function registerProject(
        string memory name,
        string memory description,
        uint256 carbonOffset,
        uint256 tokenPrice
    ) public {
        uint256 tokenAward = calculateTokenAward(carbonOffset);
        Project memory newProject = Project({
            id: nextProjectId,
            name: name,
            description: description,
            owner: payable(msg.sender),
            carbonOffset: carbonOffset,
            tokenAward: tokenAward,
            isRegistered: true,
            tokenPrice: tokenPrice
        });

        projects[nextProjectId] = newProject;
        emit ProjectRegistered(nextProjectId, msg.sender, tokenAward);
        tokenContract.mint(msg.sender, tokenAward);
        nextProjectId++;
    }

    function calculateTokenAward(
        uint256 carbonOffset
    ) private pure returns (uint256) {
        return carbonOffset * 100;
    }

    function buyTokens(uint256 projectId, uint256 amount) public payable {
        Project storage project = projects[projectId];
        require(project.isRegistered, "Project not registered");
        uint256 totalCost = amount * project.tokenPrice;
        require(msg.value >= totalCost, "Insufficient payment");

        tokenContract.transfer(msg.sender, amount);
        project.owner.transfer(msg.value);

        emit TokensPurchased(projectId, msg.sender, amount, totalCost);
    }

    // Overloaded Functions for Attestation with and without ERC20 resolver fee
    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        bytes calldata attestationData
    ) public payable override {
        // Handle attestation without ERC20 fee
        // Attestation memory attestationInfo = s_baseIspContract.getAttestation(attestationId);
        (
            address issuerAddress,
            string memory projectName,
            string memory projectType,
            uint256 carbonAmount,
            string memory tokenStandard,
            string memory blockchainNetwork,
            uint256 timestamp
        ) = abi.decode(
                attestationData,
                (address, string, string, uint256, string, string, uint256)
            );

        registerProject(
            projectName,
            projectType, // projectType can be used as the description
            carbonAmount,
            1 * 10 ** 18 // For example, set token price as 1 Ether; modify as needed
        );
    }

    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata attestationData
    ) public override {
        // Handle attestation with ERC20 fee
        resolverFeeERC20Token.transferFrom(
            attester,
            address(this),
            resolverFeeERC20Amount
        );
        // Attestation memory attestationInfo = s_baseIspContract.getAttestation(attestationId);
        (
            address issuerAddress,
            string memory projectName,
            string memory projectType,
            uint256 carbonAmount,
            string memory tokenStandard,
            string memory blockchainNetwork,
            uint256 timestamp
        ) = abi.decode(
                attestationData,
                (address, string, string, uint256, string, string, uint256)
            );

        registerProject(
            projectName,
            projectType,
            carbonAmount,
            1 * 10 ** 18 // Set token price as 1 Ether, modify as needed
        );
    }

    function didReceiveRevocation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        bytes calldata revocationData
    ) public payable override {
        // Implement logic for handling revocation without ERC20 fee
    }

    function didReceiveRevocation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata revocationData
    ) public override {
        // Implement logic for handling revocation with ERC20 fee
        resolverFeeERC20Token.transferFrom(
            attester,
            address(this),
            resolverFeeERC20Amount
        );
    }

    function getAllProjects()
        public
        view
        returns (
            uint256[] memory ids,
            string[] memory names,
            string[] memory descriptions,
            address[] memory owners,
            uint256[] memory carbonOffsets,
            uint256[] memory tokenAwards
        )
    {
        ids = new uint256[](nextProjectId - 1);
        names = new string[](nextProjectId - 1);
        descriptions = new string[](nextProjectId - 1);
        owners = new address[](nextProjectId - 1);
        carbonOffsets = new uint256[](nextProjectId - 1);
        tokenAwards = new uint256[](nextProjectId - 1);

        for (uint i = 0; i < nextProjectId - 1; i++) {
            uint256 currId = i + 1;
            Project storage project = projects[currId];
            ids[i] = project.id;
            names[i] = project.name;
            descriptions[i] = project.description;
            owners[i] = project.owner;
            carbonOffsets[i] = project.carbonOffset;
            tokenAwards[i] = project.tokenAward;
        }
    }
}
