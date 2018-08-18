import React, { Component } from 'react'
import StoreContract from '../build/contracts/Store.json'

const contract = require("truffle-contract");


class StoreOwnerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingNewProduct: false,
      instance: null,
      name: '',
      isStopped: false,
      description: '',
      products: [],
      newProductName: '',
      newProductDescription: '',
      newProductPrice: '',
      loadingStoppedStateChange: false
    };

    this.addNewProduct = this.addNewProduct.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.updateInventoryCount = this.updateInventoryCount.bind(this);
    this.toggleEmergencyStop = this.toggleEmergencyStop.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const storeContract = contract(StoreContract);
    let instance;
    let name;
    let description;
    let products;
    let isStopped;

    storeContract.setProvider(this.props.web3.currentProvider);
    storeContract.at(this.props.address)
      // save reference to store instance
      .then(store => {
        instance = store;
        return store;
      })
      // call contract for store metadata 
      .then(store => Promise.all([
        store.name(), 
        store.description(),
        store.newestProductSku(),
        store.stopped()
      ]))
      // save store metadata
      .then(data => {
        name = data[0];
        description = data[1];
        isStopped = data[3];
        return data[2].toNumber();
      })
      // call contract for each products metadata
      .then(newestProductSku => {
        const result = [];
        for (let i = 1; i <= newestProductSku; i++) {
          result.push(instance.productsBySku(i));
        }
        return Promise.all(result);
      })
      // save product metadata
      .then(data => {
        console.log(name, data);
        products = data.map(product => ({
          sku: product[0].toNumber(), 
          inventoryCount: product[1].toNumber(),
          price: product[2].toNumber(),
          name: product[3], 
          description: product[4]
        }))
      })
      // update state with all the stuff we just fetched
      .then(() => this.setState({
        instance,
        name,
        description,
        products,
        isStopped,
        loading: false
      }));
  }

  addNewProduct() {
    if (!this.state.newProductName || !this.state.newProductDescription || !this.state.newProductPrice) {
      return;
    }

    this.setState({loadingNewProduct: true}, () => {
      const wei = this.props.web3.toWei(this.state.newProductPrice, "ether");
      this.state.instance.addNewProduct.sendTransaction(
        this.state.newProductName, 
        this.state.newProductDescription, 
        wei,
        {from: this.props.currentAccount})
      .then(() => {
        var event = this.state.instance.NewProductAdded(
          // using products.length as a hack to get the sku
          // for the product that should be generated 
          // from this call to addNewProduct.
          {sku: this.state.products.length + 1}, 
          {fromBlock: 'latest'});

        event.watch((error, result) => {
          if (!error) {
            this.state.instance.newestProductSku()
              .then(res => res.toNumber())
              .then(latestSku => {
                const result = [];
                for (let i = 1; i <= latestSku; i++) {
                  result.push(this.state.instance.productsBySku(i));
                }
                return Promise.all(result);
              })
              .then(data => {
                return data.map(product => ({
                  sku: product[0].toNumber(), 
                  inventoryCount: product[1].toNumber(), 
                  price: product[2].toNumber(),
                  name: product[3], 
                  description: product[4]
                }))
              })
              .then(products => {
                this.setState({
                  loadingNewProduct: false, 
                  products: products,
                  newProductName: '',
                  newProductDescription: '',
                  newProductPrice: ''
                });                
              });
          }
        });
      });

    });
  }

  updateInventoryCount(sku, newVal) {
    // this is a hack - mutating state directly
    this.state.products.find(n => n.sku === sku).inventoryCount = newVal;
    this.forceUpdate()
  }

  sendUpdateInventoryCount(sku, newCount) {
    this.state.instance.updateInventoryCount.sendTransaction(
      sku, 
      newCount,
      {from: this.props.currentAccount});
  }

  toggleEmergencyStop() {
    this.setState({loadingStoppedStateChange: true}, () => {
      this.state.instance.toggleContractActive.sendTransaction({from: this.props.currentAccount})
        .then(() => {
          let event = this.state.instance.ContractStateToggled();
          event.watch((error, result) => {
            if (!error) {
              this.setState({
                isStopped: !this.state.isStopped, 
                loadingStoppedStateChange: false
              }, () => {
                event.stopWatching();
              });
            }
          })
        });
    });
  }

  render() {


    //TODO: add withdraw button to store

    const products = this.state.products.length 
      ? this.state.products.map(product => 
          <div key={product.sku}
               style={{
                  borderBottom: '1px solid #0000001e', 
                  margin: '0 auto',
                  padding: '5px 0 5px 0',
                  overflow: 'auto'}}>
            <div style={{width: '100%', marginBottom: '5px'}}>
              <div style={{fontSize: '18px'}}>{product.name}</div>
              <div style={{fontSize: '12px'}}>{product.description}</div>
            </div>
            <div style={{float: 'left'}}>
              <div style={{fontSize: '18px'}}>{this.props.web3.fromWei(product.price, "ether")}</div>
              <div style={{fontSize: '12px'}}>Price (ETH)</div>
            </div>
            <div style={{float: 'right'}}>
              <div>
                <input type="number" 
                       style={{width: '50px', marginRight: '5px'}}
                       value={product.inventoryCount} 
                       onChange={(e) => this.updateInventoryCount(product.sku, e.target.value)} />
                <button onClick={() => this.sendUpdateInventoryCount(product.sku, product.inventoryCount)} 
                        type="button">Update</button>
              </div>
              <div style={{fontSize: '12px'}}>Inventory</div>
            </div>
          </div>) 
      : <div>None yet...</div>;

    return (
      <div style={{
        border: '1px solid #0000001e', 
        borderRadius: '4px', 
        backgroundColor: '#fafafa',
        width: '33%',
        padding: '15px 15px 60px 15px',
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '15px'}}>

        {this.state.loading 
          ? <div>Loading...</div> 
          : (
              <div>
                <div style={{fontSize: '24px' }}>{this.state.name}</div>
                <div style={{fontSize: '14px', height: '20px', width: '100%'}}>{this.state.description}</div>

                <br />

                <div style={{borderBottom: '1px solid #0000001e'}}>Products</div>
                {products}

                <br />

                <div>New Product</div>

                <input type="text"
                       value={this.state.newProductName} 
                       placeholder="Name" 
                       style={{marginBottom: '5px', width: '100%'}}
                       disabled={this.state.loadingNewProduct}
                       onChange={e => this.setState({newProductName: e.target.value})} />

                <input type="text"
                       value={this.state.newProductDescription} 
                       placeholder="Description"
                       style={{marginBottom: '5px', width: '100%'}}
                       disabled={this.state.loadingNewProduct}
                       onChange={e => this.setState({newProductDescription: e.target.value})} />

                <input type="text"
                       value={this.state.newProductPrice} 
                       placeholder="Price (ETH)"
                       style={{width: '100%'}}
                       disabled={this.state.loadingNewProduct}
                       onChange={e => this.setState({newProductPrice: e.target.value})} />

                {
                  this.state.loadingNewProduct 
                    ? <div style={{
                             position: 'absolute', 
                             bottom: '15px',
                             left: '15px'}}>Loading...</div>
                    : <button onClick={this.addNewProduct}
                              style={{
                                position: 'absolute', 
                                bottom: '15px',
                                left: '15px'}}>Add</button>
                }

                {
                  this.state.loadingStoppedStateChange
                    ? <div style={{
                            position: 'absolute', 
                           bottom: '15px',
                           right: '15px'}}>Loading...</div>
                    : <button onClick={this.toggleEmergencyStop}
                              style={{
                                position: 'absolute', 
                                bottom: '15px',
                                right: '15px'}}>{this.state.isStopped ? 'Start' : 'Stop'} Store</button>
                }
              </div>
            )
        }
      </div>);
  }
}

export default StoreOwnerView;
