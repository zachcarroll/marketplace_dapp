# Avoiding Common Attacks
A summary of the safetey precautions implemented across Marketplace and Store smart contracts to mitigate the risk of common attack patterns on smart contracts.

## TX.origin Problem
The Marketplace contract is responsible for instantiating instances of Store contract. As such, it needs to pass the address of the original caller to the constructor of the Store contract. I made sure to use msg.sender, and not tx.origin in order to avoid the unreliable tx.origin.

## Integer Overflow
The Store contract works with `uint256` type data in a couple places, including accepting raw user input data. The Store contract utilizes Open Zeppelin's SafeMath contract for all uint256 calculations in order to guard against integer overflow attacks.

## Poison Data
TO DO