pragma solidity ^0.4.18;

import './Store.sol';

/** @title Marketplace contract. */
contract Marketplace {
  mapping (address => bool) public admins;
  mapping (address => bool) public storeOwners;
  address[] public storeOwnerRequests;
  mapping (address => address[]) public storeAddressesByOwner;

  event StoreOwnerRequestSent(address storeOwnerRequestAddress);
  event StoreOwnerAdded(address storeOwnerAddress);
  event StoreOwnerRequestsUpdated(address[]);
  event NewStoreCreated(address owner, address store);

  modifier isAdmin() {
    require(admins[msg.sender] == true);
    _;
  }

  modifier isStoreOwner() {
    require(storeOwners[msg.sender] == true);
    _;
  }

  constructor() public {
    admins[msg.sender] = true;
  }

  /** @dev Gets a list of store contract addresses that the msg.sender is the owner of.
    * @return The list of store contract addresses.
    */
  function getStoreAddressesByOwner() public view returns (address[]) {
    return storeAddressesByOwner[msg.sender];
  }

  /** @dev Generates a new store contract with msg.sender as the owner.
    * @param name The name of the store.
    * @param description The description of the store.
    */
  function createNewStore(string name, string description) public isStoreOwner {
    Store newStore = new Store(msg.sender, name, description);
    storeAddressesByOwner[msg.sender].push(newStore);
    emit NewStoreCreated(msg.sender, newStore);
  }

  /** @dev Figures out what type of user msg.sender is.
    * @return A string indicating what type of user msg.sender is.
    */
  function getUserType() public view returns (string) {
    if (admins[msg.sender] == true) {
      return 'admin';
    }
    else if (storeOwners[msg.sender] == true) {
      return 'storeOwner';
    }
    else {
      return 'shopper';
    }
  }

  /** @dev Adds a request for msg.sender to become a store owner (pending admin approval).
    */
  function addStoreOwnerRequest() public {
    storeOwnerRequests.push(msg.sender);
    emit StoreOwnerRequestSent(msg.sender);
  }

  /** @dev Adds a new store owner from the list of requests.
    * @param index The index in the list of requests of the approved store owner.
    * @param storeOwner The address of the store owner being approved.
    */
  function addStoreOwner(uint index, address storeOwner) public isAdmin {
    require(storeOwnerRequests.length > index);
    require(storeOwnerRequests[index] == storeOwner);
    storeOwners[storeOwner] = true;

    emit StoreOwnerAdded(storeOwner);
  }

  /** @dev Gets all the store owner requests.
    * @return A list of all the addresses of the open requests.
    */
  function getStoreOwnerRequests() public view returns (address[]) {
    return storeOwnerRequests;
  }

  /** @dev Adds a new admin to the marketplace.
    * @param newAdmin Address of the new admin to add.
    */
  function addAdmin(address newAdmin) public isAdmin {
    admins[newAdmin] = true;
  }

  /** @dev Admins can withdraw any funds sent to the contract.
    */
  function withdraw() public payable isAdmin {
    msg.sender.transfer(address(this).balance);
  }

  /** @dev Default payable function.
    */
  function () public payable {}
}


