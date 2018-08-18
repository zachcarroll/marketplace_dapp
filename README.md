

# Decentralized Online Marketplace
## Consensys Academy Final Project
### Zach Carroll - carroll.zach@gmail.com

#### Additional Internal Documentation
- [Detailed Smart Contract Documentation](documentation/smart_contract_details.md)
- [Design Pattern Documentation](documentation/design_pattern_decisions.md)
- [Avoiding Common Attacks Documentation](documentation/avoiding_common_attacks.md)

#### Application Overview
An online decentralized marketplace. 

The application supports three types of accounts:
- Admins - Responsible for approving shop owner requests
- Store Owners - Create stores, add products, sell stuff, make Ether
- Shoppers - Browse stores, purchase products

Upon first deploying the marketplace contract, the account that deploys the contract is the first Admin. The marketplace starts with no store owners, no stores, no products. 

Users can shop at available stores and purchase products by spending Ether. Users can also request to become store owners (with admin approval).

Once granted store ownership approval, new store owners can create stores, add products, and sell on the marketplace. 

When users purchase products from a given store, inventory is adjusted, Ether is held in the store for store owners to withdraw.

#### Setup/Run Steps
These steps assume you have NodeJS, NPM, Truffle, and MetaMask already set up. If you are missing any of those dependencies, please find their respective documentation online and set them up first.

1. Open a terminal session and navigate to the location you'd like to store a copy of the repo in. 
1. Clone the repo: `git clone https://github.com/zachcarroll/marketplace_dapp.git`.
1. Move into the root directory of the project: `cd marketplace_dapp`.
1. Start a local blockchain using truffle: `truffle develop`.
1. Inside the truffle console (which you should now be in), migrate smart contracts: `migrate`.
1. Open a second terminal window and navigate to the root directory of the project.
1. Install front end dependencies via npm: `npm install`.
1. Build the front end react app and open it in the browser (at http://localhost:3000): `npm run start`.
1. Open MetaMask and connect to the truffle blockchain via standard process (seed phrase, custom RPC - if necessary, see MetaMask + Truffle documentation).
1. Refresh

If you followed all these steps correctly, you should land on the Admin Page, and your account address should display on the right side of the header.

If you ever encounter an issue, please see the Issues section below.

#### Interacting with the Application Steps
1. When you first land on the application, you should have the Admin Account (Account 1 by default) selected in MetaMask. As there are no open requests for store ownership, there is nothing to do on this page.
1. Open MetaMask and select Account 2.
1. Reload the page. You should now be on the standard Shopper Page. From here, you would be able to shop and purchase products at available stores on the marketplace. However, no stores have been created yet. Click the Request Store Ownership button to 

#### Running Tests
1. From the project root start the truffle development blockchain: `truffle develop`.
1. Execute all unit tests: `test`.

#### Issues
MetaMask transaction nonce doesnt' match local blockchain:
1. Reset all accounts in MetaMask (via settings in the MetaMask UI)
1. Re-migrate and reset accounts and contracts from truffle development environment: `migrate --reset`.

