import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis, useChain, useMoralisCloudFunction, MoralisProvider } from "react-moralis";
import { abi, address } from "../../helpers/contract";
import { useNotification, Button, Input } from "web3uikit";

import "./Unlock.css";

type Position = {
  balance: string,
  lockedTill: string
}

interface UnlockProps {
  getPosition: Function;
  position: Position | undefined;
  isLoadingStats: boolean;
}

const Unlock: React.FC<UnlockProps> = ({ getPosition, position, isLoadingStats }) => {

  const [txHash, setTxHash] = useState<string>("");
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

  return(
    <div>
      <h1 style={{ marginTop: "6vh" }}>Your Locked Position:</h1>
      {!account ? (
        <p>Connect your wallet above!</p>
      ):(
        <>
        <Button
          id="refresh-button"
          onClick={() => getPosition()}
          text="Refresh"
          theme="secondary"
          type="button"
          size="large"
          icon="reload"
        />
        
        {position ? (
          <div className="position">
            <p><b>Locked:</b> {position.balance}</p>
            <p><b>Locked Till:</b> {position.lockedTill}</p>
            <p><b>Lock More:</b></p>
            <div className="add-more">
              <Input
                label="Amount"
                name="Amount Input"
                onChange={handleAmountInput}
                prefixIcon="avax"
                iconPosition="end"
                description="Amount of AVAX to lock"
                type="number"
                width="83%"
                style={{ marginRight: "2%" }}
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
            </div>
            <Button
              id="withdraw-button"
              onClick={withdraw}
              text="Unlock"
              theme="primary"
              type="button"
              size="large"
              icon="bin"
            />
          </div>
        ):(
          isLoadingStats ? (
            <p>Loading . . .</p>
          ):(
            <p>You do not have anything locked. Lock it above!</p>
          )
        )}
        </>
      )}
    </div>
  )
}

export default Unlock;