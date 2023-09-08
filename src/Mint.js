import React from 'react';
import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import json from './contract/nft.json';

const contractAddress = "0x78ed29165eFa3c26bD2936d64DfB2F7135ED6c01";
const abi = json.abi

function Mint(props) {
    const [amount,setAmount] = useState(0)
    let account = props.account
    let ethBalance = String(props.ethBalance)
    const mintHandler = async (e) => {
        try {
    
          e.preventDefault()
    
          const { ethereum } = window;
    
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const accounts = await provider.send("eth_requestAccounts", []);
            const nftContract = new ethers.Contract(contractAddress, abi, signer);
    
            console.log("Initialize minting");
            let depoTxn = await nftContract.mint(accounts[0],amount, { value: ethers.utils.parseUnits(amount,"finney") });
            console.log(depoTxn)
    
            console.log("Please wait");
            await depoTxn.wait();
    
            console.log(`Deposit Complete`);
            props.fetchEtherBalance()
    
          } else {
            console.log("Ethereum object does not exist");
          }
    
        } catch (err) {
          console.log(err);
        }
      }
    return (
        <div class="container px-5 py-24 mx-auto items-center">

        <section class=" overflow-hidden">
    <div class="">
        <div class="flex flex-col justify-center flex-1 px-4 py-12 overflow-hidden sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="  mx-auto lg:w-96">
                <div>
                    <a  class="text-blue-600 text-medium">Address: {account.slice(0,4)}...{account.slice(-4)}</a><br></br>
                    <a  class="text-blue-600 text-medium">Balance: {ethBalance.slice(0,6)} ETH</a><br></br>
                    <a  class="text-blue-600 text-medium">NFT Balance: {props.balance}</a>
                    <h2 class="mt-6 text-3xl font-extrabold text-neutral-600">Mint</h2>
                </div>

                <div class="mt-8">
                    <div class="mt-6">
                        <form  class="space-y-6">
                            <div>
                                <label for="email" class="block text-sm font-medium text-neutral-600"> Amount to deposit </label>
                                <div class="mt-1">
                                    <input  value={amount} onChange={(e)=>{setAmount(e.target.value)}}  placeholder="1" class="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-300 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-500"/>
                                </div>
                            </div>

                            

                            <div>
                                <button onClick={(e)=>{mintHandler(e)}} class="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Mint</button>
                            </div>
                        </form>
                     
                    </div>
                </div>
            </div>
        </div>

    </div>
</section>
        </div>
    );
}

export default Mint;