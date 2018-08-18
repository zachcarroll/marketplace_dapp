var Store = artifacts.require("./Store.sol");


contract('Store', function(accounts) {
  let contract;

  before(() => Store.new(accounts[0], 'Test Store Name', 'Test Store Description')
    .then(instance => contract = instance));

  /*  
   * This test ensures that the store contract creator
   * is correctly set as the owner of the store.
   * This is important because only owners are allowed to 
   * take specific actions like adding products and withdrawing funds.
   */
  it("should set the store owner correctly.", function() {
    return contract.owner.call()
      .then(owner => assert.equal(owner, accounts[0], "The store contract creator was not set as owner."));
  });

  /*  
   * This test ensures that the store owner can create
   * a new product in the store, and that the product 
   * initializes correctly.
   */
  it("should allow store owner to add a new product.", function() {
    return contract.addNewProduct.sendTransaction('Test Product 1', 'Test Product 1 Description', 1)
      .then(() => contract.productsBySku.call(1))
      .then(product => {
        assert.equal(product[0].toNumber(), 1, "Product's SKU was not correctly set.");
        assert.equal(product[1].toNumber(), 0, "Product's inventory was not initially set to zero.");
        assert.equal(product[2].toNumber(), 1, "Product's price was not correctly set.");
        assert.equal(product[3], "Test Product 1", "Product's name was not correctly set.");
        assert.equal(product[4], "Test Product 1 Description", "Product's description was not correctly set.");
      });
  });

  /*  
   * This test ensures that the store owner can update
   * inventory for an existing product.
   */
  it("should allow store owner to add inventory to an existing product.", function() {
    return contract.updateInventoryCount.sendTransaction(1, 5)
      .then(() => contract.productsBySku.call(1))
      .then(product => {
        assert.equal(product[1].toNumber(), 5, "Product's inventory was not updated correctly.");
      });
  });

  /*  
   * This test ensures that the store owner can update
   * inventory for an existing product.
   */
  it("should allow a shopper to purchase a product from the store, and product balance reduces by correct amount.", function() {
    return contract.purchaseProduct.sendTransaction(1, 5, {value: 5})
      .then(() => contract.productsBySku.call(1))
      .then(product => {
        assert.equal(product[1].toNumber(), 0, "Product's inventory was not updated after a sale correctly.");
      });
  });

  /*  
   * This test ensures that the store owner can withdraw
   * funds from the store upon successful sale.
   */
  it("should allow a store owner to withdraw funds after a sale.", function() {
    var ownerBalanceBefore = web3.eth.getBalance(accounts[0]).toNumber();
    var contractBalanceBefore = web3.eth.getBalance(contract.address).toNumber();

    return contract.withdraw.sendTransaction({from: accounts[0]})
      .then(() => assert.equal(ownerBalanceBefore - contractBalanceBefore, ownerBalanceBefore, "Contract balance did not successfully transfer to owner."));
  });



});
