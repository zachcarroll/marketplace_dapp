

# Decentralized Online Marketplace
## Consensys Academy Final Project
### Zach Carroll - carroll.zach@gmail.com

#### Useful Links
- [Detailed Smart Contract Documentation](documentation/smart_contract_details.md)
- [Design Pattern Documentation](documentation/design_pattern_decisions.md)
- [Avoiding Common Attacks Documentation](documentation/avoiding_common_attacks.md)
- [React Truffle Box](https://truffleframework.com/boxes/react)

#### Application Overview
An online decentralized marketplace. 

The account that deploys the marketplace contract is set as the first admin of the marketplace, but the ability to add additional admins is available. Admins are responsible for approving store ownership requests from users. 

Regular users can shop at available stores and purchase products by spending Ether. Users can also request to become store owners (with admin approval).

Once granted store ownership approval, new store owners can create stores, add products, and sell on the marketplace. 

#### Setup/Run Steps
1. Open a terminal session and move into the root directory of the project.
1. Run truffle develop to start a new local blockchain.
1. Inside the truffle console (which should now be running), run migrate --reset to migrate contracts onto your local blockchain.
1. Open a second terminal window and navigate to the root directory of the project.
1. Run npm run start to build the React front end and open a browser window pointed at localhost:3000/ where the app should now run.

#### Interacting with the Application Steps
1. When you land on the application, you should have the Admin Account (Account 1 by default) selected in MetaMask. As there are no open requests for store ownership, there is nothing to do on this page.
1. Open MetaMask and select Account 2.
1. Reload the page. You should now be on the standard Shopper Page. From here, you would be able to shop and purchase products at available stores on the marketplace. However, no stores have been created yet. Click the Request Store Ownership button to 