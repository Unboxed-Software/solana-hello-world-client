import * as web3 from "@solana/web3.js";
import { config } from "dotenv";
import { initializeKeypair } from "./initializeKeypair";

config(); // Load environment variables

const programId = new web3.PublicKey("<YOUR_PROGRAM_ID>");
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

async function main() {
    try {
        const payer = await initializeKeypair(connection);

        const transactionSignature = await sayHello(payer);

        console.log(
            `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
        );

        console.log("Finished successfully");
    } catch (error) {
        console.error(error);
    }
}

async function sayHello(payer: web3.Keypair): Promise<string> {
    const transaction = new web3.Transaction();
    const instruction = new web3.TransactionInstruction({
        keys: [],
        programId,
    });

    transaction.add(instruction);

    const transactionSignature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    );

    return transactionSignature;
}

main();
