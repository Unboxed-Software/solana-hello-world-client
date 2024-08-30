import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { initializeKeypair } from "@solana-developers/helpers";
import dotenv from "dotenv";

dotenv.config();

const programId = new PublicKey("8ziTvCeyd66eRqKAv1e5jB61Q4WbRacmNVHwrDP4YJay");
const connection = new Connection(clusterApiUrl("devnet"));

export const sayHello = async (payer: Keypair): Promise<string> => {
  const transaction = new Transaction();
  const instruction = new TransactionInstruction({
    keys: [],
    programId,
  });

  transaction.add(instruction);

  return sendAndConfirmTransaction(connection, transaction, [payer]);
};

try {
  const payer = await initializeKeypair(connection);
  await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);

  const transactionSignature = await sayHello(payer);

  console.log(
    `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
  console.log("Finished successfully");
} catch (error) {
  if (error instanceof Error) {
    throw new Error(`An error occurred: ${error.message}`);
  } else {
    throw new Error("An unknown error occurred");
  }
}