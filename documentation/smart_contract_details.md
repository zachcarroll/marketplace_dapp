# Smart Contract Detailed Documentation
## The contracts themselves are well commented, so look there for individual methods and property descriptions. This document's purpose is to give an overview of how the contracts work together to form a cohesive application.

### Marketplace Contract
Top level application contract. Responsible for storing information about the types of users including:
- Admins
- Store Owners
- Shoppers
As well as deploying new instances of Store contracts, and storing information about where Store contract instances are located.


### Store Contract
Each store created in the marketplace is it's own Store contract instance. This makes sense due to stores having to hold Ether, and have special properties related to store ownership. Store contracts are what users interact with when they purchase products. The emergency stop pattern has been implemented at the Store contract level because this is the only place where users can send Ether.
