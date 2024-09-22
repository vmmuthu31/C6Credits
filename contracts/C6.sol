// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
    
import "./CarbonToken.sol";
import {IRouterClient} from "@chainlink/contracts-ccip@1.4.0/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip@1.4.0/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip@1.4.0/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts@1.2.0/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

contract ProjectRegistry is OwnerIsCreator {
    struct Project {
        uint256 id;
        string name;
        string description;
        address payable  owner;
        uint256 carbonOffset; // Amount of carbon offset in tons
        uint256 tokenAward; // Amount of carbon tokens awarded
        bool isRegistered;
        uint256 tokenPrice; // Price per token in wei
    }


    struct Company {
        uint256 id;
        string name;
        string description;
        uint256 carbonEmitted; // Total carbon emitted by the company in tons
        uint256 creditsBought; // Total credits bought by the company
        bool isOnboarded;
    }


 error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance.

    // Event emitted when a message is sent to another chain.
    event MessageSent(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        string text, // The text being sent.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the CCIP message.
    );

    IRouterClient private s_router;

    LinkTokenInterface private s_linkToken;
    CarbonToken public tokenContract;
    uint256 public nextProjectId;
        uint256 public nextCompanyId;

    mapping(uint256 => Project) public projects;
        mapping(uint256 => Company) public companies;

    event ProjectRegistered(uint256 indexed projectId, address indexed owner, uint256 tokenAward);
    event TokensPurchased(uint256 indexed projectId, address indexed buyer, uint256 amount, uint256 totalCost);
    event CompanyOnboarded(uint256 indexed companyId, string name, uint256 carbonEmitted, uint256 creditsBought);

    constructor(address tokenAddress,address _router, address _link) {
        tokenContract = CarbonToken(tokenAddress);
        nextProjectId = 1;
         nextCompanyId = 1;
             s_router = IRouterClient(_router);
        s_linkToken = LinkTokenInterface(_link);
    }

   function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        string calldata text
    ) internal  returns (bytes32 messageId) {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver), // ABI-encoded receiver address
            data: abi.encode(text), // ABI-encoded string
            tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array indicating no tokens are being sent
            extraArgs: Client._argsToBytes(
                // Additional arguments, setting gas limit
                Client.EVMExtraArgsV1({gasLimit: 200_000})
            ),
            // Set the feeToken  address, indicating LINK will be used for fees
            feeToken: address(s_linkToken)
        });

        // Get the fee required to send the message
        uint256 fees = s_router.getFee(
            destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

        // approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
        s_linkToken.approve(address(s_router), fees);

        // Send the message through the router and store the returned message ID
        messageId = s_router.ccipSend(destinationChainSelector, evm2AnyMessage);

        // Emit an event with message details
        emit MessageSent(
            messageId,
            destinationChainSelector,
            receiver,
            text,
            address(s_linkToken),
            fees
        );

        // Return the message ID
        return messageId;
    }
    

    function registerProject(string memory name, string memory description, uint256 carbonOffset,  uint256 tokenPrice) public {
        // uint256 tokenAward = calculateTokenAward(carbonOffset);
        uint256 tokenAward = 123;
        Project memory newProject = Project({
            id: nextProjectId,
            name: name,
            description: description,
            owner: payable (msg.sender),
            carbonOffset: carbonOffset,
            tokenAward: tokenAward,
            isRegistered: true,
            tokenPrice: tokenPrice
        });

        projects[nextProjectId] = newProject;
        emit ProjectRegistered(nextProjectId, msg.sender, tokenAward);

        tokenContract.mint(msg.sender, tokenAward);
        tokenContract.mint(address(this), tokenAward);
        nextProjectId++;
    }

    function calculateTokenAward(uint256 carbonOffset) private pure returns (uint256) {
        return carbonOffset * 100; // Modify this logic as needed
    }



     function buyTokens(uint256 projectId, uint256 amount, string calldata text, uint64 id, address contractAddr ) public payable {
        Project storage project = projects[projectId];
        require(project.isRegistered, "Project not registered");
        uint256 totalCost = amount * project.tokenPrice;
        require(msg.value >= totalCost, "Insufficient payment");
        require(project.tokenAward - amount >= 0 , "Insufficient Tokens");
        tokenContract.transfer(msg.sender, amount); // Transfer tokens to the buyer
        (bool success, ) = project.owner.call{value: msg.value}("");
        require(success, "Ether transfer failed");

        project.tokenAward = project.tokenAward - amount; // Send Ether to the project owner
        // Send a message (assuming sendMessage is a valid function)
        sendMessage(id, contractAddr, text);
        emit TokensPurchased(projectId, msg.sender, amount, totalCost);
    }

    // Function to return details of all projects
    function getAllProjects() public view returns (
        uint256[] memory ids,
        string[] memory names,
        string[] memory descriptions,
        address[] memory owners,
        uint256[] memory carbonOffsets,
        uint256[] memory tokenAwards
    ) {
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


      // Onboard a new company
    function onboardCompany(
        string memory name,
        string memory description,
        uint256 carbonEmitted,
        uint256 creditsBought
    ) public {
        Company memory newCompany = Company({
            id: nextCompanyId,
            name: name,
            description: description,
            carbonEmitted: carbonEmitted,
            creditsBought: creditsBought,
            isOnboarded: true
        });

        companies[nextCompanyId] = newCompany;
        emit CompanyOnboarded(nextCompanyId, name, carbonEmitted, creditsBought);

        nextCompanyId++;
    }


     // Get details of all onboarded companies
    function getAllCompanies() public view returns (
        uint256[] memory ids,
        string[] memory names,
        string[] memory descriptions,
        uint256[] memory carbonEmissions,
        uint256[] memory creditsBought
    ) {
        ids = new uint256[](nextCompanyId - 1);
        names = new string[](nextCompanyId - 1);
        descriptions = new string[](nextCompanyId - 1);
        carbonEmissions = new uint256[](nextCompanyId - 1);
        creditsBought = new uint256[](nextCompanyId - 1);

        for (uint i = 0; i < nextCompanyId - 1; i++) {
            uint256 currId = i + 1;
            Company storage company = companies[currId];
            ids[i] = company.id;
            names[i] = company.name;
            descriptions[i] = company.description;
            carbonEmissions[i] = company.carbonEmitted;
            creditsBought[i] = company.creditsBought;
        }
    }
}
