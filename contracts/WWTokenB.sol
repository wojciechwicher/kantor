pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract WWTokenB is ERC20 {
    constructor() ERC20("Wojciech Wicher Token B", "WWTB") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}