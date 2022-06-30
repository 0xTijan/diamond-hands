import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header';
import Lock from './components/lock/Lock';
import Unlock from './components/unlock/Unlock';
import { useWeb3Contract, useMoralis, useChain, useMoralisCloudFunction, MoralisProvider } from "react-moralis";
import { abi, address } from "./helpers/contract";
import { useNotification, Button, Input } from "web3uikit";


type Position = {
  balance: string,
  lockedTill: string
}


function App() {

  const [position, setPosition] = useState<Position>();

  const { Moralis, isWeb3Enabled, isWeb3EnableLoading, enableWeb3, account, user } = useMoralis();
  const { chainId, switchNetwork } = useChain();

  const dispatch = useNotification();

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

  const getPosition = async() => {
    try{
      await checkChainAndWeb3();
      if(!isWeb3Enabled) return;
      let options = {
        abi: abi,
        contractAddress: address,
        functionName: "getStats",
        params: {
          _for: account
        },
      }
      await GetStats.runContractFunction({ params: options });
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
    if(GetStats.error != null) {
      notify("error", "Error! g😥", GetStats.error.message)
      console.log(GetStats.error);
    };
  }, [GetStats.error]);

  useEffect(() => {
    if(GetStats.data){
      console.log(GetStats.data)
      let data: any = GetStats.data;
      let date = data[1].toString() == "0" ? "0" : new Date(data[1] * 1000);
      if(date != "0") {
        setPosition({
          balance: Moralis.Units.FromWei(data[0].toString()),
          lockedTill: date.toString(),
        })
      }
    }
  }, [GetStats.data]);

  useEffect(() => {
    if(isWeb3Enabled) getPosition();
  }, [])

  useEffect(() => {
    if(isWeb3Enabled) getPosition();
  }, [isWeb3Enabled])


  return (
    <div className='bg'>
      <Header />
      <Lock getPosition={getPosition} />
      <Unlock getPosition={getPosition} position={position} isLoadingStats={GetStats.isLoading} />
    </div>
  );
}

export default App;
