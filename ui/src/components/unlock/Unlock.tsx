import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis, useChain, useMoralisCloudFunction, MoralisProvider } from "react-moralis";
import { abi, address } from "../../helpers/contract";
import { useNotification, Button, Input } from "web3uikit";

import "./Unlock.css";

type Position = {
  balance: string,
  lockedTill: string
}

const Unlock = () => {

  const [txHash, setTxHash] = useState<string>("");
  const [position, setPosition] = useState<Position>();
  const [amount, setAmount] = useState<number>();
  const handleAmountInput = (e: any) => setAmount(e.target.value);

  const { Moralis, isWeb3Enabled, isWeb3EnableLoading, enableWeb3, account, user } = useMoralis();
  const { chainId, switchNetwork } = useChain();

  const dispatch = useNotification();
  const { error, data, runContractFunction, isFetching, isLoading } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "getStats",
    params: {
      _for: ""
    },
  });
  const GetStats = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "getStats",
    params: {
      _for: ""
    },
  });

  const notify = (
    type: "error" | "success" | "info",
    title: string,
    message: string,
  ) => {
    dispatch({
      type,
      message: message,
      title: title,
      icon: undefined,
      position: 'topR',
    });
  };

  const lockMore = async() => {
    try{
      if(!amount) throw new Error("Please fill in amount field!");
      if(amount <= 0) throw new Error("Amount must be bigger than 0!");
      
      await checkChainAndWeb3();
      const options = {
        abi: abi,
        contractAddress: address,
        functionName: "addFunds",
        msgValue: Moralis.Units.ETH(amount)
      }

      let tx: any = await runContractFunction({ params: options });
      if(tx) setTxHash(tx.hash);
    }catch(err: any){
      notify("error", "Error! ", err.message);
    }
  }

  const withdraw = async() => {
    try{
      await checkChainAndWeb3();
      const options = {
        abi: abi,
        contractAddress: address,
        functionName: "withdraw",
      }

      let tx: any = await runContractFunction({ params: options });
      if(tx) setTxHash(tx.hash);
    }catch(err: any){
      notify("error", "Error! 😥", err.message);
    }
  }

  const getPosition = async() => {
    try{
      console.log(account)
      await checkChainAndWeb3();
      let options = {
        abi: abi,
        contractAddress: address,
        functionName: "getStats",
        params: {
          _for: account
        },
      }
      await GetStats.runContractFunction({ params: options });
      console.log("getting")
    }catch(err: any){
      console.log(err)
      notify("error", "Error - couldn't get position! 😥", err.message);
    }
  }

  const checkChainAndWeb3 = async() => {
    try{
      if(chainId != "0xa869") {
        await switchNetwork("0xa869");
      }
      if(!isWeb3Enabled || !isWeb3EnableLoading) {
        await enableWeb3({chainId: 1337});
      }
    }catch(err: any){
      notify("error", "Error! 😥", err.message);
    }
  }

  useEffect(() => {
    if(isFetching) notify("info", "Pending! ⏳", "Transaction is pending, please wait!" + txHash + "");
  }, [isFetching]);

  useEffect(() => {
    if(error) notify("error", "Error! 😥", error.message);
  }, [error]);

  useEffect(() => {
    if(data) notify("success", "Success! 😀", "Transaction was successful!");
  }, [data]);

  useEffect(() => {
    if(GetStats.error != null) {
      notify("error", "Error! 😥", GetStats.error.message)
      console.log(GetStats.error);
    };
  }, [GetStats.error]);

  useEffect(() => {
    if(GetStats.data){
      console.log(GetStats.data)
      let data: any = GetStats.data;
      let date = new Date(data[1] * 1000);
      setPosition({
        balance: Moralis.Units.FromWei(data[0].toString()),
        lockedTill: date.toString(),
      })

    }
  }, [GetStats.data]);

  useEffect(() => {
    getPosition();
  }, [])

  return(
    <div>
      <h1>Locked Positions</h1>
      <button onClick={getPosition}>Refresh</button>
      {position ? (
        <>
          <hr/>
          <p>Locked: {position.balance}</p>
          <p>Time Locked: {position.lockedTill}</p>
          <p>Lock More:</p>
          <Input
            label="Amount"
            name="Amount Input"
            onChange={handleAmountInput}
            prefixIcon="avax"
            iconPosition="end"
            description="Amount of AVAX to lock"
            type="number"
          />
          <Button
            id="lock-more-button"
            onClick={lockMore}
            text="Add More"
            theme="primary"
            type="button"
            size="large"
            icon="plus"
          />
          <Button
            id="withdraw-button"
            onClick={withdraw}
            text="Withdraw"
            theme="primary"
            type="button"
            size="large"
            icon="minus"
          />
        </>
      ):(
        GetStats.isLoading ? (
          <p>Loading . . .</p>
        ):(
          <p>You do not have anything locked. Lock it above!</p>
        )
      )}
    </div>
  )
}

export default Unlock;