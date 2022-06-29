//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiamondHandsv2 is Ownable {

  enum Time { SECONDS, MINUTES, HOURS, DAYS, CUSTOM }

  mapping(address => mapping(uint256 => uint256)) balances;
  mapping(address => mapping(uint256 => bool)) active;
  mapping(address => mapping(uint256 => uint256)) timeLocked;
  mapping(address => mapping(uint256 => bool)) everDaimondHanded;
  
  Time[] vaults;

  error PaperHandLocated();
  error HodlAreYouAPaperHand();
  error AlreadyActive();
  error DoInitialDepositFirst();

  event DiamondHanding(address daimondHands, uint256 time, uint256 amount, uint256 vault);
  event DiamondHandLeft(address daimondHands, uint256 amount, uint256 vault);
  event Added(address daimondHands, uint256 amount, uint256 vault);

  constructor(Time[] memory _vaults) {
    vaults = _vaults;
  }

  function editVaults() external onlyOwner {

  }

  function depositToVault(uint256 _time, uint256 _vaultId) external payable {
    if(_time > 0) revert PaperHandLocated();
    if(!active[msg.sender][_vaultId]) revert AlreadyActive();

    uint256 lockFor = block.timestamp + (_time * 1 seconds);
    balances[msg.sender][_vaultId] += msg.value;
    active[msg.sender][_vaultId] = true;
    timeLocked[msg.sender][_vaultId] = lockFor;
    
    if(!everDaimondHanded[msg.sender][_vaultId]) {
      everDaimondHanded[msg.sender][_vaultId] = true;
    }

    emit DiamondHanding(msg.sender, lockFor, msg.value, _vaultId);
  }

  function depositToVault() external {}

  function addFundsTo(uint256 _vaultId) external payable {
    if(active[msg.sender][_vaultId]) revert DoInitialDepositFirst();
    balances[msg.sender][_vaultId] += msg.value;
    emit Added(msg.sender, msg.value, _vaultId);
  }

  function withdrawFromVault(uint256 _vaultId, uint256 _amount) external {
    if(!(block.timestamp >= timeLocked[msg.sender][_vaultId])) revert HodlAreYouAPaperHand();

    if(balances[msg.sender][_vaultId] == _amount) {
      active[msg.sender][_vaultId] = false;
    }

    balances[msg.sender][_vaultId] -= _amount;
    timeLocked[msg.sender][_vaultId] = 0;
    payable(msg.sender).transfer(_amount);

    emit DiamondHandLeft(msg.sender, _amount, _vaultId);
  }

  function getStats(address _for, uint256 _vaultId) external view returns(uint256, uint256) {
    return (
      balances[_for][_vaultId],
      timeLocked[_for][_vaultId]
    );
  }

}