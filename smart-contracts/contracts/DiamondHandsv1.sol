//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract DiamondHands {

  mapping(address => uint256) balances;
  mapping(address => bool) started;
  mapping(address => uint256) timeLocked;
  mapping(address => bool) everDaimondHanded;

  uint256 public currentDiamondHanders;

  error PaperHandLocated();
  error PaperHandAlert();

  event DiamondHanding(address daimondHands, uint256 time, uint256 amount);
  event DiamondHandLeft(address daimondHands, uint256 amount);
  event Added(address daimondHands, uint256 amount);

  function deposit(uint256 _time) external payable {
    require(_time > 1, "paper hadn detected");
    require(!started[msg.sender], "already started");

    uint256 lockFor = block.timestamp + (_time * 1 seconds);
    balances[msg.sender] += msg.value;
    started[msg.sender] = true;
    timeLocked[msg.sender] = lockFor;
    
    if(!everDaimondHanded[msg.sender]) {
      everDaimondHanded[msg.sender] = true;
      currentDiamondHanders += 1;
    }

    emit DiamondHanding(msg.sender, lockFor, msg.value);
  }

  function depositErc(address _token, uint256 _amount, uint256 _time) external {

  }

  function addFunds() external payable {
    balances[msg.sender] += msg.value;
    emit Added(msg.sender, msg.value);
  }

  function withdraw() external {
    require(block.timestamp >= timeLocked[msg.sender], "paper hadn alert");

    uint256 toTransfer = balances[msg.sender];
    balances[msg.sender] = 0;
    started[msg.sender] = false;
    timeLocked[msg.sender] = 0;
    payable(msg.sender).transfer(toTransfer);

    emit DiamondHandLeft(msg.sender, toTransfer);
  }

  function getStats(address _for) external view returns(uint256, uint256) {
    return (
      balances[_for],
      timeLocked[_for]
    );
  }

}