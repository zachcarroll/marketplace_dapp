# Design Pattern Decisions

## Contract Design Decisions
 The contracts themselves are well commented, so look there for individual methods and property descriptions. This section's purpose is to give an overview of how the contracts work together to form a cohesive application, and design decisions that informed how they are structured.

### Marketplace Contract
Top level application contract. Responsible for storing information about the types of users including:
- Admins
- Store Owners
- Shoppers
As well as deploying new instances of Store contracts, and storing information about where Store contract instances are located. Storage variables here rely heavily on mappings instead of arrays of data in order to reduce the need to loop over arbitrary length arrays.


### Store Contract
Store contracts are what users interact with when they purchase products.

Each store created in the marketplace is it's own Store contract instance. This makes sense due to stores having to hold Ether, and have special properties related to store ownership. This way, each instance is responsible for holding it's own ETH, which reduces the amount of ETH stored in a given contract. 

## Other Patterns Included in Design

### The Circuit Breaker or Emergency Stop Pattern
The Circuit Breaker has been implemented at the Store contract level because this is the only place where users can send Ether. Owners are able to toggle contract availability via a button on the UI.

### Library Usage
The SafeMath Library contract from OpenZeppelin was used to prevent integer overflow attacks and conduct arithmetic safely in the Store contract.