pragma solidity ^0.4.18;

import "zeppelin/contracts/math/SafeMath.sol";


/** @title Marketplace contract. */
contract Store {
  using SafeMath for uint256;

  address public owner;
  string public name;
  string public description;
  mapping (uint256 => Product) public productsBySku;
  uint256 public newestProductSku;
  bool public stopped = false;

  struct Product {
    uint sku;
    uint inventoryCount;
    uint price;
    string name;
    string description;
  }

  event NewProductAdded(string name, string description, uint256 indexed sku, uint256 price);
  event InventoryCountUpdated(uint256 indexed sku, uint256 newInventoryCount);
  event PurchaseMade(uint256 indexed sku, uint256 quantity);
  event ContractStateToggled(bool isStopped);

  modifier isOwner() {
    require(
      msg.sender == owner,
      "This action can only be performed by the store owner.");
    _;
  }

  modifier stringLengthOkay(string str) {
    require(bytes(str).length <= 32);
    _;
  }

  modifier skuExists(uint256 sku) {
    require(
      newestProductSku.sub(sku) >= 0,
      "This item does not exist in this store.");
    _;
  }

  modifier enoughInventory(uint256 sku, uint256 quantity) {
    require(
      productsBySku[sku].inventoryCount.sub(quantity) >= 0,
      "Not enough inventory left.");
    _;
  }

  modifier enoughEthSent(uint256 sku, uint256 quantity) {
      require(
        msg.value >= productsBySku[sku].price.mul(quantity),
        "Not enough Ether provided.");

      _;

      if (msg.value > productsBySku[sku].price.mul(quantity)) {
        msg.sender.transfer(msg.value.sub(productsBySku[sku].price.mul(quantity)));
      }
  }

  modifier stopInEmergency {
    if (!stopped) {
      _;
    }
  }

  modifier onlyInEmergency {
    if (stopped) {
      _;
    }
  }

  constructor(address sender, string storeName, string storeDescription) 
    public
    stringLengthOkay(storeName)
    stringLengthOkay(storeDescription) {
    owner = sender;
    name = storeName;
    description = storeDescription;
    newestProductSku = 0;
  }

  /** @dev Owner can toggle contract in case of emergency.
    */
  function toggleContractActive() 
    public
    isOwner {
      stopped = !stopped;
      emit ContractStateToggled(stopped);
  }

  /** @dev Owner can withdraw any funds the store has earned by selling products.
    */
  function withdraw() public payable isOwner {
    owner.transfer(address(this).balance);
  }

  /** @dev Owner can add products to his/her store to sell.
    * @param newProductName The name of the product.
    * @param newProductDescription The description of the product.
    * @param newProductPrice The price of the product.
    */
  function addNewProduct(string newProductName, string newProductDescription, uint256 newProductPrice) 
    public
    isOwner
    stringLengthOkay(newProductName)
    stringLengthOkay(newProductDescription) {
    Product memory newProduct = Product({
      sku: newestProductSku.add(1), 
      inventoryCount: 0, 
      price: newProductPrice,
      name: newProductName, 
      description: newProductDescription
    });

    productsBySku[newestProductSku.add(1)] = newProduct;
    newestProductSku = newestProductSku.add(1);
    emit NewProductAdded(newProduct.name, newProduct.description, newProduct.sku, newProduct.price);
  }

  /** @dev Owner can update the inventory for a given product.
    * @param sku The sku of the product.
    * @param newInventoryCount The updated inventory count of the product.
    */
  function updateInventoryCount(uint256 sku, uint256 newInventoryCount) 
    public
    skuExists(sku) 
    isOwner {

    productsBySku[sku].inventoryCount = newInventoryCount;
    emit InventoryCountUpdated(sku, newInventoryCount);
  }

  /** @dev Shoppers call this to purchase a given product from the store.
    * @param sku The sku of the product.
    * @param quantity The number of inventory of the product the user is buying.
    */
  function purchaseProduct(uint256 sku, uint256 quantity) 
    public 
    payable
    skuExists(sku)
    enoughInventory(sku, quantity)
    enoughEthSent(sku, quantity)
    stopInEmergency {

    productsBySku[sku].inventoryCount = productsBySku[sku].inventoryCount.sub(quantity);
    emit PurchaseMade(sku, quantity);
  }
  /** @dev Default payable function.
    */
  function () public payable {}
}
