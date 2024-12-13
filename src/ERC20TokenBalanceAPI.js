// Load environment variables
const dotenv = require("dotenv/config");
// Import ethers.js for Ethereum blockchain interaction
const ethers = require("ethers");
// Import Express.js for creating the API server
const express = require("express");
const app = express();
// Import body-parser to parse incoming JSON requests
const bodyParser = require("body-parser");
// Import CORS for handling cross-origin requests
const cors = require('cors');

// Enable CORS for all origins
app.use(cors({
    origin: '*'
}));
// Use body-parser middleware to handle JSON request bodies
app.use(bodyParser.json());

// Define constants for the server and blockchain configuration
const HTTPPort = 3001; // Server port
const PK = process.env.PK; // Private key for Ethereum wallet
const tokenABI = require("../abis/ERC20TokenABI.json"); // ABI of the ERC20 token
const tokenAddress = process.env.USDT_ADDRESS; // ERC20 token contract address (e.g., USDT)
const RPC = process.env.ETH_RPC; // Ethereum RPC URL

// Variables for storing balance information
let tokenBalance = 0;
let rawTokenBalance = 0;

// Initialize Ethereum provider using the specified RPC URL
const ETHProvider = ethers.providers.getDefaultProvider(RPC);
// Create a wallet instance using the private key and provider
const ETHWallet = new ethers.Wallet(PK, ETHProvider);

// Initialize the ERC20 token contract using its address, ABI, and wallet
const tokenContract = new ethers.Contract(tokenAddress, tokenABI.abi, ETHWallet);

// Define a POST endpoint to get the balance of a wallet address
app.post("/get_balance", async (req, res) => {
    // Check if the request body contains an address
    if (!req.body.address) {
        console.log("get_balance request: Missing address.");
        res.send(`{ "error": "get_balance request: Missing address." }`);
        return;
    }

    let walletAddress;
    try {
        // Validate and normalize the Ethereum address
        walletAddress = ethers.utils.getAddress(req.body.address);
    }
    catch(e) {
        // Handle invalid Ethereum addresses
        console.log("Error: Bad address checksum.");
        res.send(`{ "error": "Bad address checksum." }`);
        return;
    }

    // Fetch the balance of the specified address
    const balance = await getUSDTBalance(walletAddress);

    // Send the balance in the response
    res.send(`{
        "address": "${walletAddress}",
        "USDT balance": "${balance}"
    }`);
    console.log("Balance of %s (%s) sent.", walletAddress, balance);
});

// Function to fetch the USDT balance of a specified address
async function getUSDTBalance(address) {
    try {
        // Query the balance from the token contract
        rawTokenBalance = parseInt(await tokenContract.balanceOf(address));
        // Convert raw balance (in smallest unit) to human-readable format
        tokenBalance = rawTokenBalance / 1e6; // Assuming USDT has 6 decimal places
        return tokenBalance;
    }
    catch(e) {
        // Log any errors during the balance query
        console.log("Error getting USDT token balance.", e);
    }
}

// Function to start the Express.js server
async function start() {
    app.listen({ port: HTTPPort }, () => {
        console.log(`ℹ️  Server started on port ${HTTPPort}`);
    });
}

// Start the server
start();
