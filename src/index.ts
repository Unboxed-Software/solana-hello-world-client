import web3 = require("@solana/web3.js");
import Dotenv from "dotenv";
Dotenv.config();

let programId = new web3.PublicKey(
  "5Q7oKQf3JXrLG4qkZ9bdiGsB6JTkQyREGg3hzKjvd2SQ"
);

let payer = initializeKeypair();
let connection = new web3.Connection(web3.clusterApiUrl("devnet"));

async function main() {
  await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL * 1);

  const transactionSignature = await sayHello();

  console.log(
    `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
}

main()
  .then(() => {
    console.log("Finished successfully");
  })
  .catch((error) => {
    console.error(error);
  });

export async function sayHello(): Promise<web3.TransactionSignature> {
  const transaction = new web3.Transaction();

  const instruction = new web3.TransactionInstruction({
    keys: [],
    programId,
    data: Buffer.alloc(0),
  });

  transaction.add(instruction);

  const transactionSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );

  return transactionSignature;
}

function initializeKeypair(): web3.Keypair {
  const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecretKey;
}
