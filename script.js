let currentWallet = null;

const createButton = document.getElementById("createWallet");

createButton.addEventListener("click", async function () {

    // Create wallet
    currentWallet = ethers.Wallet.createRandom();

    const wallet = currentWallet;

    // Display address
    document.getElementById("address").innerText =
        wallet.address;

    // Display private key
    document.getElementById("privateKey").innerText =
        wallet.privateKey;

    // Get balance of newly created wallet
    getBalance(wallet.address);

});


async function getBalance(walletaddress) {

    try {

        const response = await fetch(
            `http://localhost:3000/balance?address=${walletaddress}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        document.getElementById("balance").innerText =
            data.balance + " ETH";

    } catch (error) {

        console.log(error);

        document.getElementById("balance").innerText =
            "Unable to get balance";
    }
}


// ===============================
// SEND ETH
// ===============================

const sendButton = document.getElementById("sendEth");

sendButton.addEventListener("click", async function () {

    const to =
        document.getElementById("toAddress").value.trim();

    const amount =
        document.getElementById("amount").value.trim();

    const status =
        document.getElementById("sendStatus");


    // Wallet check
    if (!currentWallet) {

        status.innerText =
            "First create a wallet";

        return;
    }


    // Address check
    if (!ethers.isAddress(to)) {

        status.innerText =
            "Invalid receiver address";

        return;
    }


    // Amount check
    if (!amount || Number(amount) <= 0) {

        status.innerText =
            "Enter a valid amount";

        return;
    }


    status.innerText = "Sending...";


    try {

        const response = await fetch(
            "http://localhost:3000/send",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    to: to,

                    amount: amount,

                    privateKey: currentWallet.privateKey

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Transaction failed"
            );
        }


        status.innerText =
            "Transaction successful! Hash: " +
            data.transactionHash;


        // Refresh balance
        getBalance(currentWallet.address);


    } catch (error) {

        console.log(error);

        status.innerText =
            "Error: " + error.message;
    }

});