pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Kantor is Ownable {

  ERC20 private firstToken;
  ERC20 private secondToken;
  uint256 private tokenPrice;

  // Event that log deposit operation
  event DepositTokens(address sender, uint256 amount);

  // Event that log exchange operation
  event ExchangeTokens(address buyer, uint256 amountTokenA, uint256 amountTokenB);

  constructor(address firstTokenAddress, address secondTokenAddress, uint256 price) {
    firstToken = ERC20(firstTokenAddress);
    secondToken = ERC20(secondTokenAddress);
    tokenPrice = price;
  }

  function updatePrice(uint256 price) public onlyOwner {
    tokenPrice = price;
  }

  function deposit ( address token, uint256 amount) public onlyOwner {
    require (token == address(firstToken) || token == address(secondToken), "address of the token should be known");
      ERC20(token).transferFrom(msg.sender, address(this), amount);
      emit DepositTokens(msg.sender, amount);
  }

  function exchange ( address token, uint256 amount) public returns (bool){
    if (token == address(firstToken)){
      uint256 computedAmount = amount * tokenPrice;
      swap(firstToken, secondToken, amount, computedAmount);
    }
    else if (token == address(secondToken)){
      uint256 computedAmount = amount / tokenPrice;
      swap(secondToken, firstToken, amount, computedAmount);
    }
    else {
      return false;
    }
      return true;
  }

  function swap (ERC20 token1, ERC20 token2, uint256 amount, uint256 computedAmount) internal{
      require (token2.balanceOf(address(this)) >= computedAmount,"Tokens amount exceeded");
      token1.transferFrom(msg.sender, address(this), amount);
      token2.increaseAllowance(msg.sender, computedAmount);
      token2.transfer(msg.sender, computedAmount);
      emit ExchangeTokens(msg.sender, amount, computedAmount);
  }

}