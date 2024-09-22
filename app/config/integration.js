
import Web3 from "web3";

import { ethers } from "ethers";

import abi from "./contractAbi.json";




const isBrowser = () => typeof window !== "undefined";

const {ethereum } = isBrowser();


if (ethereum){
    isBrowser().web3 = new Web3(ethereum);
    isBrowser().web3 = new Web3(isBrowser().web3.currentProvider);
}


const contract_address = "0x064fDd34631E558dBD57EA80aaf4B02Da4b1fA19";


export const Buy = async () => {


    // provider
    const provider = window.ethereum != null ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider();
console.log("provider",provider)

    //signer

    const signer = provider.getSigner();

console.log("signer",signer)
    // contract instance

    const contract = new ethers.Contract(contract_address, abi, signer);

    console.log("contract",contract)

    const tx = await contract.buyTokens(    '1',
        '10',
        'Carbon offset Data',
        '16015286601757825753',
        '0x121e8F62F20f34f7071424c567f30518C2735289',{
            value:ethers.utils.parseEther("0.0000001")
        });

    await tx.wait();

    console.log("tx", tx)

    return tx;


}