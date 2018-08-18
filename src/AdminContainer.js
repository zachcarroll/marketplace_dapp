import React, { Component } from 'react'
import Header from './Header.js';


class AdminContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      openStoreRequests: []
    };

    this.handleApproveStoreRequest = this.handleApproveStoreRequest.bind(this);
    this.updateOpenStoreOwnerRequests = this.updateOpenStoreOwnerRequests.bind(this);
  }

  componentDidMount() {
    this.updateOpenStoreOwnerRequests();
    
    this.props.marketplace.StoreOwnerAdded().watch((error, result) => {
      if (!error) {
        this.updateOpenStoreOwnerRequests();
      }
    });
  }

  updateOpenStoreOwnerRequests() {
    this.props.marketplace.getStoreOwnerRequests.call().then(requests => {
      this.props.marketplace.StoreOwnerAdded({}, {fromBlock: 0, toBlock: 'latest'}).get((error, events) => {
        if (!error) {
          const ownersAdded = events.map(event => event.args.storeOwnerAddress);
          this.setState({
            openStoreRequests: requests.filter(n => !ownersAdded.includes(n)),
            loading: false
          })
        }
      });
    });
  }

  handleApproveStoreRequest(index, requestAddress) {
    this.setState(
      {loading: true}, 
      () => this.props.marketplace.addStoreOwner.sendTransaction(index, requestAddress, {from: this.props.currentAccount}));
  }

  render() {
    const requests = this.state.openStoreRequests.length
      ? this.state.openStoreRequests.map((request, index) => 
        <div key={request}>
          <span style={{marginRight: '10px'}}>Requesting Address: {request}</span>
          <button onClick={() => this.handleApproveStoreRequest(index, request)}>Approve</button>
        </div>)
      : <div>No open requests...</div>;

    return (
      <div>
        <Header currentAccount={this.props.currentAccount} pageTitle='Admin Page'></Header>

        <div style={{
          border: '1px solid #0000001e', 
          borderRadius: '4px', 
          backgroundColor: '#fafafa',
          padding: '15px 15px 60px 15px',
          margin: '15px',
          position: 'relative'}}>
          <div style={{fontSize: '24px'}}>Open Store Owner Requests</div>
          
          {this.state.loading ? <div>Loading...</div> : requests}
        </div>

      </div>
    );
  }
}

export default AdminContainer
