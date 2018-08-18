pragma solidity ^0.4.18;

/** @title Marketplace contract. */
contract Store {
  address public owner;
  string public name;
  string public description;
  mapping (uint => Product) public productsBySku;
  uint public newestProductSku;
  bool public stopped = false;

  struct Product {
    uint sku;
    uint inventoryCount;
    uint price;
    string name;
    string description;
  }

  event NewProductAdded(string name, string description, uint indexed sku, uint price);
  event InventoryCountUpdated(uint indexed sku, uint newInventoryCount);
  event PurchaseMade(uint indexed sku, uint quantity);
  event ContractStateToggled(bool isStopped);

  modifier isOwner() {
    require(
      msg.sender == owner,
      "This action can only be performed by the store owner.");
    _;
  }

  modifier skuExists(uint sku) {
    require(
      sku <= newestProductSku,
      "This item does not exist in this store.");
    _;
  }

  modifier enoughInventory(uint sku, uint quantity) {
    require(
      productsBySku[sku].inventoryCount >= quantity,
      "Not enough inventory left.");
    _;
  }

  modifier enoughEthSent(uint sku, uint quantity) {
      require(
        msg.value >= productsBySku[sku].price * quantity,
        "Not enough Ether provided.");
      _;
      if (msg.value > productsBySku[sku].price * quantity) {
        msg.sender.transfer(msg.value - productsBySku[sku].price * quantity);
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

  constructor(address sender, string storeName, string storeDescription) public {
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
  function addNewProduct(string newProductName, string newProductDescription, uint newProductPrice) 
    public
    isOwner {
    Product memory newProduct = Product({
      sku: newestProductSku + 1, 
      inventoryCount: 0, 
      price: newProductPrice,
      name: newProductName, 
      description: newProductDescription
    });

    productsBySku[newestProductSku + 1] = newProduct;
    newestProductSku = newestProductSku + 1;
    emit NewProductAdded(newProduct.name, newProduct.description, newProduct.sku, newProduct.price);
  }

  /** @dev Owner can update the inventory for a given product.
    * @param sku The sku of the product.
    * @param newInventoryCount The updated inventory count of the product.
    */
  function updateInventoryCount(uint sku, uint newInventoryCount) 
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
  function purchaseProduct(uint sku, uint quantity) 
    public 
    payable
    skuExists(sku)
    enoughInventory(sku, quantity)
    enoughEthSent(sku, quantity)
    stopInEmergency {

    productsBySku[sku].inventoryCount = productsBySku[sku].inventoryCount - quantity;
    emit PurchaseMade(sku, quantity);
  }
  /** @dev Default payable function.
    */
  function () public payable {}
}
