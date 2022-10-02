import { showThrottleMessage } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config()
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY
  }
  const provider = ethers.getDefaultProvider("goerli", options);
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? " ")
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  if (balance < 0.01) {
    throw new Error("Not enough ether")
  }
  const ballotFactory = new Ballot__factory(signer);
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS)
  );
  await ballotContract.deployed();
  // for (let index = 0; index < PROPOSALS.length; index++) {
  //   const proposal = await ballotContract.proposals(index);
  //   const name = ethers.utils.parseBytes32String(proposal.name);
  //   console.log({index, name, proposal});
  // };
  // let voterForAddress1 = await ballotContract.voters(accounts[1].address)
  // const chairperson = await ballotContract.chairperson();
  // console.log({ chairperson });
  // console.log(accounts[0].address);
  // const giveRightToVotTx = await ballotContract.giveRightToVote(
  //   accounts[1].address
  // );
  // const giveRightToVoteTxReceipt = await giveRightToVotTx.wait()
  // console.log(giveRightToVoteTxReceipt)
  // voterForAddress1 = await ballotContract.voters(accounts[1].address)
  // console.log(voterForAddress1)
  // const castVoteTx = await ballotContract.connect(accounts[1]).vote(0)
  // const castVoteTxReceipt = await castVoteTx.wait()
  // console.log({castVoteTxReceipt})
  // const propsal
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});