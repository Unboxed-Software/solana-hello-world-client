import * as web3 from "@solana/web3.js";
import { promises as fs } from "fs";
import { config } from "dotenv";

config(); // Load environment variables

export async function initializeKeypair(
    connection: web3.Connection
): Promise<web3.Keypair> {
    if (!process.env.PRIVATE_KEY) {
        console.log("Creating .env file");
        const signer = web3.Keypair.generate();
        await fs.writeFile(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]`);
        await airdropSolIfNeeded(signer, connection);

        return signer;
    }

    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
    await airdropSolIfNeeded(keypairFromSecretKey, connection);
    return keypairFromSecretKey;
}

async function airdropSolIfNeeded(
    signer: web3.Keypair,
    connection: web3.Connection
) {
    const balance = await connection.getBalance(signer.publicKey);
    console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL);
    if (balance < web3.LAMPORTS_PER_SOL) {
        console.log("Airdropping 1 SOL...");
        const signature = await connection.requestAirdrop(
            signer.publicKey,
            web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(signature);
    }
}
