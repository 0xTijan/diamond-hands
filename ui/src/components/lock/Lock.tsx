import React, { useEffect, useState } from "react";
import { Input, Select, Button } from "web3uikit";
import { Time } from "../../helpers/interfaces";
import { convertToSec } from "../../helpers/formatters";
import { useWeb3Contract, useMoralis, useChain } from "react-moralis";
import { abi, address } from "../../helpers/contract";
import { useNotification } from "web3uikit";

import "./Lock.css";

interface LockProps {
  getPosition: Function;
}

const Lock: React.FC<LockProps> = ({ getPosition }) => {

  const [amountInput, setAmountInput] = useState<number>();
  const [timeInput, setTimeInput] = useState<number>();
  const [timeTypeInput, setTimeTypeInput] = useState<Time>();
  const [txHash, setTxHash] = useState<string>("");

  const dispatch = useNotification();

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

  const { Moralis, isWeb3Enabled, isWeb3EnableLoading, enableWeb3 } = useMoralis();
  const { chainId, switchNetwork } = useChain();
  const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "deposit",
    msgValue: Moralis.Units.ETH(amountInput ? amountInput : 0),
    params: {
      _time: 0
    }
  });

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

  const lock = async() => {
    try{
      if(!timeInput || !amountInput || !timeTypeInput) throw new Error("Please fill in all fields!");
      
      await checkChainAndWeb3();

      const time = convertToSec(timeInput, timeTypeInput);
      const options = {
        abi: abi,
        contractAddress: address,
        functionName: "deposit",
        msgValue: Moralis.Units.ETH(amountInput),
        params: {
          _time: time
        }
      }

      let tx: any = await runContractFunction({ params: options });
      if(tx) setTxHash(tx.hash);
    }catch(err: any){
      notify("error", "Error! 😥", err.message);
    }
  }

  useEffect(() => {
    if(isFetching) notify("info", "Pending! ⏳", "Transaction is pending, please wait!");
  }, [isFetching]);

  useEffect(() => {
    if(error) notify("error", "Error! 😥", error.message);
  }, [error]);

  useEffect(() => {
    if(data && !isFetching && !isLoading && txHash) {
      notify("success", "Success! 😀", "You are officialy part Diamond Hands gang!");
      getPosition();
    }
  }, [data,isFetching,isLoading]);


  return(
    <div>
      <div className="inputs">
        <Input
          label="Amount"
          name="Amount Input"
          onChange={(e: any) => setAmountInput(e.target.value)}
          prefixIcon="avax"
          iconPosition="end"
          description="Amount of vax to lock"
          type="number"
        />
        <Input
          label="Time"
          name="Time Input"
          onChange={(e: any) => setTimeInput(e.target.value)}
          prefixIcon="atomicApi"
          iconPosition="end"
          description="Lock-up time"
          type="number"
        />   
        <Select
          label="Select Timeframe"
          onChange={(e: any) => setTimeTypeInput(e.id)}
          prefixIcon="calendar"
          options={[
            {
              id: 'seconds',
              label: 'Seconds',
            },
            {
              id: 'minutes',
              label: 'Minutes',
            },
            {
              id: 'hours',
              label: 'Hours',
            },
            {
              id: 'days',
              label: 'Days',
            },
          ]}
        />
      </div>
      
      <div className="lock-btn">
        <Button
          id="test-button"
          onClick={lock}
          text="Lock"
          theme="primary"
          type="button"
          size="large"
          icon="lockClosed"
        />
      </div>
    </div>
  )
}

export default Lock;