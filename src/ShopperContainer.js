import React, { Component } from 'react'
import Header from './Header.js';
import StoreShopperView from './StoreShopperView';


class ShopperContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores: [],
      storeOwnershipState: 'loading' // ['loading', 'requestSent', 'noRequestSent']
    }

    this.handleRequestStoreOwnership = this.handleRequestStoreOwnership.bind(this);
  }

  componentDidMount() {
    const marketplace = this.props.marketplace;
    const currentAccount = this.props.currentAccount;
    let storeOwnershipState;
    let stores;

    marketplace.NewStoreCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
      if (!error) {
        stores = result.map(n => n.args.store);
    
        marketplace.getStoreOwnerRequests()
          .then(storeOwnerRequests => {
            storeOwnershipState = storeOwnerRequests.includes(currentAccount) 
                ? 'requestSent' 
                : 'noRequestSent';
          })
          .then(() => this.setState({
            storeOwnershipState,
            stores,
          }));
      }
    });
  }

  handleRequestStoreOwnership() {
    this.setState(
      {storeOwnershipState: 'loading'}, 
      () => this.props.marketplace.addStoreOwnerRequest({from: this.props.currentAccount}));


    this.props.marketplace.StoreOwnerRequestSent().watch((error, result) => {
      if (!error) {
        const requestSent = result.args.storeOwnerRequestAddress === this.props.currentAccount;
        if (requestSent) {
          this.setState({storeOwnershipState: 'requestSent'});
        }
      }
      else {
        console.log('error: ', error);
      }
    });
  }

  handleGoToStorePage(storeId) {
    console.log('handleGoToStorePage': storeId);
  }

  render() {
    const stores = this.state.stores.length
      ? this.state.stores.map(store =>
          <StoreShopperView currentAccount={this.props.currentAccount} 
                            web3={this.props.web3} 
                            address={store} 
                            key={store}></StoreShopperView>)
      : <div>There are no stores in the marketplace yet, check back later!</div>;

    var requestStoreButton;
    if (this.state.storeOwnershipState === 'loading') {
      requestStoreButton = <div style={{
                              position: 'absolute', 
                              bottom: '15px', 
                              left: '15px', 
                              right: '15px'}}>Loading...</div>;
    }
    else if (this.state.storeOwnershipState === 'requestSent') {
      requestStoreButton = <div style={{
                            position: 'absolute', 
                            bottom: '15px', 
                            left: '15px', 
                            right: '15px'}}>Store ownership request sent, waiting for admin approval...</div>;
    }
    else if (this.state.storeOwnershipState === 'noRequestSent') {
      requestStoreButton = <button style={{
                                      position: 'absolute', 
                                      bottom: '15px', 
                                      left: '15px', 
                                      right: '15px'}}
                                   onClick={this.handleRequestStoreOwnership}>Request</button>;
    }

    return (
      <div>
        <Header currentAccount={this.props.currentAccount} pageTitle='Shopper Page'></Header>

        <div style={{
          border: '1px solid #0000001e', 
          borderRadius: '4px', 
          backgroundColor: '#fafafa',
          padding: '15px 15px 60px 15px',
          margin: '15px',
          position: 'relative'}}>
          <div style={{fontSize: '24px'}}>Become a Store Owner</div>
          {requestStoreButton}
        </div>

        <div style={{fontSize: '24px'}}>Shop</div>
        {stores}
      </div>
    );
  }
}

export default ShopperContainer;
