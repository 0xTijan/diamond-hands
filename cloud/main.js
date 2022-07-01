Moralis.Cloud.define("getStats", async(req) => {
  let chain = req.params.chain;
  let address = req.params.address;
  let abi = req.params.abi;
  let _contract = req.params.contract;
  let web3 = Moralis.web3ByChain(chain);
  let contract = new web3.eth.Contract(abi, _contract);

  let stats = await contract.methods
    .getStats(address)
      .call({});

  let toReturn = {
    balance: stats[0],
      timeLocked: stats[1]
  }
  loger.info(toReturn)
  
  return toReturn;
});

