import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/GroupOneToken.sol/MyToken.json";
import * as dotenv from "dotenv";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerApiKey = process.env.PRIVATE_KEY || "";

async function main() {
  console.log("Getting Name and Symbol of Token Contract");

  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length != 1)
    throw new Error("One Argument required: Contract Address");

  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const tokenName = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "name",
  });
  const tokenSymbol = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "symbol",
  });

  console.log(
    `Token contract at ${contractAddress}: \nName: ${tokenName}\nSymbol: ${tokenSymbol}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});