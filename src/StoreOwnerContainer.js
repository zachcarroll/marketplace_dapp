import React, { Component } from 'react'
import StoreOwnerView from './StoreOwnerView.js'
import Header from './Header.js';


class StoreOwnerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      storeAddresses: [],
      newStoreName: '',
      newStoreDescription: ''
    };

    this.createNewStore = this.createNewStore.bind(this);
    this.getStoreAddresses = this.getStoreAddresses.bind(this);
  }

  componentDidMount() {
    let newStoreCreatedEvent = this.props.marketplace.NewStoreCreated();

    newStoreCreatedEvent.watch((error, result) => {
      if (!error) {
        this.setState(
          {newStoreName: '', newStoreDescription: ''}, 
          () => this.getStoreAddresses());
      }
    });

    this.getStoreAddresses();
  }

  getStoreAddresses() {
    this.props.marketplace.getStoreAddressesByOwner
      .call({from: this.props.currentAccount})
        .then(storeAddresses => this.setState({storeAddresses, loading: false}));
  }

  createNewStore() {
    if (!this.state.newStoreName || !this.state.newStoreDescription) {
      return;
    }

    this.setState({loading: true}, () => {
      this.props.marketplace.createNewStore.sendTransaction(
        this.state.newStoreName, 
        this.state.newStoreDescription, 
        {from: this.props.currentAccount}).then(() => {
          console.log('new store created successfully called');
        });
    });
  }

  render() {
    const stores = this.state.storeAddresses.map(storeAddress => 
      <StoreOwnerView key={storeAddress}
                      address={storeAddress}
                      web3={this.props.web3}
                      currentAccount={this.props.currentAccount}></StoreOwnerView>);

    return (
      <div>
        <Header currentAccount={this.props.currentAccount} pageTitle='Store Owner Page'></Header>

        <div style={{
          border: '1px solid #0000001e', 
          borderRadius: '4px', 
          backgroundColor: '#fafafa',
          padding: '15px 15px 60px 15px',
          margin: '15px',
          position: 'relative'}}>

          <div style={{fontSize: '24px'}}>New Store</div>
          <div style={{fontSize: '14px', height: '20px', width: '100%'}}></div>

          <input type="text" 
                 value={this.state.newStoreName}
                 disabled={this.state.loading}
                 placeholder="Name"
                 style={{marginRight: '5px'}}
                 onChange={(e) => this.setState({newStoreName: e.target.value})} />

          <input type="text" 
                 value={this.state.newStoreDescription}
                 disabled={this.state.loading}
                 placeholder="Description"
                 onChange={(e) => this.setState({newStoreDescription: e.target.value})} />

          {this.state.loading 
            ? <div style={{
                        position: 'absolute', 
                        bottom: '15px', 
                        left: '15px', 
                        right: '15px'}}>Loading...</div>
            : <button onClick={this.createNewStore} 
                      style={{
                        position: 'absolute', 
                        bottom: '15px', 
                        left: '15px', 
                        right: '15px'}}>Create</button>}
        </div>

        {stores.length ? stores : <div>No stores yet...</div>}


      </div>
    );
  }
}

export default StoreOwnerContainer
