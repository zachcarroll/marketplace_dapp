# Decentralized Online Marketplace
## Consensys Academy Final Project
### Zach Carroll - carroll.zach@gmail.com

#### Additional Internal Documentation
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
**Note 1:** These steps assume you have NodeJS, NPM, Truffle, Git and MetaMask already set up. If you are missing any of those dependencies, please find their respective documentation online and set them up first.

**Note 2:** These instructions use truffle develop instead of the ganache-cli to run a local blockchain. If you are used to ganache, please note the default port for truffle develop is different, so please follow the below steps carefully. 

1. Open a terminal session and navigate to the location you'd like to store a copy of the repo in. 
1. Clone the repo: `git clone https://github.com/zachcarroll/marketplace_dapp.git`.
1. Move into the root directory of the project: `cd marketplace_dapp`.
1. Install ETHpm library dependencies (Open Zeppelin): `truffle install`.
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
1. Reload the page. You should now be on the standard Shopper Page. From here, you would be able to shop and purchase products at available stores on the marketplace. However, no stores have been created yet. The only thing to do at this point is to click the Request Store Ownership button to send a request to the marketplace admins to set Account 2 as a store owner, and submit the transaction via MetaMask. You should see the UI update to a loading state, and then once the transaction is processed by the network, the UI should update to notify you that your request has been received by the admins.
1. Open MetaMask and select Account 1 and reload. You should now be back on the Admin account page, where the open request from Account 2 should be available for approval.
1. Click the approve button, and submit the transaction via MetaMask. You should see the UI go to a loading state, and then once the transaction has been verified by the network, the UI should update to reflect the new empty state of open requests.
1. Open MetaMask and navigate back to Account 2, and reload. You should now land on the Store Owner page. 
1. Create a new store by filling in the inputs and clicking submit, submitting the transaction via MetaMask when it pops up.
1. The UI should react to the updates, and eventually render your new store in the bottom section of the page.
1. Add a product or two by filling in the form at the bottom of the store widget, clicking submit, and verifying via MetaMask. 
1. Once the UI updates with your new products, add some inventory to them via the number input and submit button next to each product, verify via MetaMask.
1. Now that you've got some products to sell on the marketplace, it's time to assume the role of the shopper.
1. Open MetaMask and select Account 3 and reload.
1. As this account hasn't done anything on the marketplace yet, the default Shopper page should load.
1. This time though, the marketplace has a store with some products. The UI should render a shopper version of the store(s) at the bottom of the page.
1. As Account 3, you can now input a quantity to purchase of a given product, and click the purchase button to make a purchase in ETH. Verify in Metamask after it pops up. You've new successfuly paid for a product using ETH, and sent that ETH to the store contract, which allows only the store owner to withdraw.

#### Running Tests
1. From the project root start the truffle development blockchain: `truffle develop`.
1. Execute all unit tests: `test`.

#### Issues
MetaMask transaction nonce doesnt' match local blockchain:
1. Reset all accounts in MetaMask (via settings in the MetaMask UI)
1. Re-migrate and reset accounts and contracts from truffle development environment: `migrate --reset`.

`truffle migrate` fails:
1. Usually this occurs when contracts have been migrated before, and the JSON ABI files are pointing to the old addresses. Fix by re-running migrations with the reset flag: `migrate --reset`.

MetaMask won't connect to the local blockchain.
1. It's possible you are running against the wrong port. The instructions use the new truffle develop blockchain, which runs on port `9545` compared to the ganache-cli blockchain that runs on port `8545`. Make sure you set your local RPC in the MetaMask UI to point to `9545`.