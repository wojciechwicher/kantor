pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract WWTokenA is ERC20 {
    constructor() ERC20("Wojciech Wicher Token A", "WWTA") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}