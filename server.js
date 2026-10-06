require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");

const app = express();

app.use(express.json());

// Sepolia RPC
const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Frontend files serve panna
app.use(express.static(__dirname));


// Home
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


// Balance API
app.get("/balance", async (req, res) => {

    try {

        const address = req.query.address;

        if (!address) {
            return res.status(400).json({
                error: "Wallet address is required"
            });
        }

        if (!ethers.isAddress(address)) {
            return res.status(400).json({
                error: "Invalid wallet address"
            });
        }

        const balance = await provider.getBalance(address);

        res.json({
            address: address,
            balance: ethers.formatEther(balance),
            currency: "ETH"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
});// Send ETH
app.post("/send", async (req, res) => {

    try {

        const { to, amount,  } = req.body;

        if (!to || !amount || !privateKey) {
            return res.status(400).json({
                error: "To address, amount and private key are required"
            });
        }

        if (!ethers.isAddress(to)) {
            return res.status(400).json({
                error: "Invalid receiver address"
            });
        }

        // Create wallet using private key
        const wallet = new ethers.Wallet(privateKey, provider);

        // Create transaction
        const tx = await wallet.sendTransaction({
            to: to,
            value: ethers.parseEther(amount)
        });

        console.log("Transaction Hash:", tx.hash);

        // Wait for confirmation
        const receipt = await tx.wait();

        res.json({
            message: "Transaction successful!",
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: error.message
        });

    }

});


// Server
const PORT = 3000;

app.listen(PORT, () => {

    console.log("================================");
    console.log("Wallet Server Started!");
    console.log("http://localhost:3000");
    console.log("================================");

});