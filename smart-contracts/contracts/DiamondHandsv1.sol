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
  error AlreadyStarted();
  error DepositMoreThanZero();
  error NoMoneyLeft();

  event DiamondHanding(address daimondHands, uint256 time, uint256 amount);
  event DiamondHandLeft(address daimondHands, uint256 amount);
  event Added(address daimondHands, uint256 amount);

  function deposit(uint256 _time) external payable {
    if(_time == 0) revert PaperHandLocated();
    if(started[msg.sender]) revert AlreadyStarted();
    if(msg.value == 0) revert DepositMoreThanZero();

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

  function addFunds() external payable {
    balances[msg.sender] += msg.value;
    emit Added(msg.sender, msg.value);
  }

  function withdraw() external {
    if(block.timestamp < timeLocked[msg.sender]) revert PaperHandAlert();
    if(balances[msg.sender] == 0) revert NoMoneyLeft();

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