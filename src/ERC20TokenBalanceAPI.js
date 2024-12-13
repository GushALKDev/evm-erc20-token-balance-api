const dotenv = require("dotenv/config");
const ethers = require("ethers");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

const HTTPPort = 3001;
const PK = process.env.PK;
const tokenABI = require("../abis/ERC20TokenABI.json");
const tokenAddress = process.env.USDT_ADDRESS;
const RPC = process.env.ETH_RPC;

let tokenBalance = 0;
let rawTokenBalance = 0;

// ETH RPC
const ETHProvider = ethers.providers.getDefaultProvider(RPC);
const ETHWallet = new ethers.Wallet(PK, ETHProvider);

// Contract
const tokenContract = new ethers.Contract(tokenAddress, tokenABI.abi, ETHWallet);

app.post("/get_balance", async (req, res) => {
    if (!req.body.address) {
      console.log("get_balance request: Missing address.");
      res.send(`{ "error": "get_balance request: Missing address." }`);
      return;
    }

    let walletAddress;
    try {
        walletAddress = ethers.utils.getAddress(req.body.address);
    }
    catch(e) {
        console.log("Error: Bad address checksum.");
        res.send(`{ "error": "Bad address checksum." }`);
        return;
    }
    const balance = await getUSDTBalance(walletAddress);

    res.send(`{
        "address": "${walletAddress}",
        "USDT balance": "${balance}"
    }`);
    console.log("Balance of %s (%s) sent.", walletAddress, balance);
});

async function getUSDTBalance(address) {
    try {
        rawTokenBalance = parseInt(await tokenContract.balanceOf(address));
        tokenBalance = rawTokenBalance / 1e6;
        return tokenBalance;
    }
    catch(e) {
        console.log("Error getting USDT token balance.", e);
    }
}

async function start() {
    app.listen({ port: HTTPPort }, () => { console.log(`ℹ️  Server started on port ${HTTPPort}`); });
}

start();