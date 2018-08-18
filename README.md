

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
