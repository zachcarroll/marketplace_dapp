import React, { Component } from 'react'
import StoreContract from '../build/contracts/Store.json'

const contract = require("truffle-contract");


class StoreShopperView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      instance: null,
      name: '',
      description: '',
      products: [],
    };

    this.updatePurchaseQuantity = this.updatePurchaseQuantity.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  componentDidMount() {
    const storeContract = contract(StoreContract);
    let instance;
    let name;
    let description;
    let products;

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
        store.newestProductSku()
      ]))
      // save store metadata
      .then(data => {
        name = data[0];
        description = data[1];
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
          description: product[4],
          purchaseQuantity: 0
        }))
      })
      // update state with all the stuff we just fetched
      .then(() => this.setState({
        instance,
        name,
        description,
        products,
        loading: false
      }));
  }

  updatePurchaseQuantity(sku, quantity) {
    // this is a hack - mutating state directly
    this.state.products.find(n => n.sku === sku).purchaseQuantity = quantity;
    this.forceUpdate()
  }

  purchaseProduct(product) {
    this.state.instance.purchaseProduct.sendTransaction(
      product.sku, 
      product.purchaseQuantity, 
      {
        from: this.props.currentAccount, 
        value: product.price * product.purchaseQuantity
      });
  }

  render() {
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
                       value={product.purchaseQuantity} 
                       onChange={(e) => this.updatePurchaseQuantity(product.sku, e.target.value)} />
                <button onClick={() => this.purchaseProduct(product)} 
                        type="button">Purchase</button>
              </div>
              <div style={{fontSize: '12px'}}>Quantity</div>
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

                <div>Products</div>
                {products}
              </div>
            )
        }
      </div>);
  }
}

export default StoreShopperView;
