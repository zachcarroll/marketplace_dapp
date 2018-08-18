# Avoiding Common Attacks
A summary of the safetey precautions implemented across Marketplace and Store smart contracts to mitigate the risk of common attack patterns on smart contracts.

## TX.origin Problem
The Marketplace contract is responsible for instantiating instances of Store contract. As such, it needs to pass the address of the original caller to the constructor of the Store contract. I made sure to use msg.sender, and not tx.origin in order to avoid the unreliable tx.origin.

## Integer Overflow
The Store contract works with `uint256` type data in a couple places, including accepting raw user input data. The Store contract utilizes Open Zeppelin's SafeMath contract for all uint256 calculations in order to guard against integer overflow attacks.

## Poison Data
Both the Marketplace and Store contracts accept user inputs of type string. As such, we must guard against long strings as a potential source of poison data. All places that accept string inputs include a modifier that checks the length of the incoming strings.

## Gas Limits
Although not exactly an attack vector, but a source of common bugs, we've mitigated risk of out of gas exceptions by being careful not to loop over (or delete) arrays that can grow as a result of user input, and instead rely on mappings heavily to retrive data, and by limiting the length of user inputted data such as names and descriptions of stores and products.

## Pull Over Push
The Store contract utilizes a pull over push strategy for sending ETH to store owner to mitigate a potential for sending funds to resulting in a fail to prevent purchases from occuring. 