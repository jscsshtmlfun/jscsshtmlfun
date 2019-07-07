import React from 'react';
import Loading from './Loading';

class User extends React.Component {
  constructor(props) {
    super(props);
    const user = props.user;
    let name = user.displayName;
    if (!user.displayName) name = user.email;
    this.state = {
      name: name,
      loading: false,
    };
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUpdateName = this.handleUpdateName.bind(this);
  }

  handleUpdateName(e) {
    if (!this.state.loading) {
      const user = this.props.auth.currentUser;
      user.updateProfile({
        displayName: this.state.name
      }).then(() => {
        this.setState({loading: false});
      }).catch(error => {console.log(error)});
    }
    this.setState({loading: true});
  }

  handleNameChange(e) {
    this.setState({name: e.target.value});
  }

  handleSignOut(e) {
    if (!this.state.signingOut)
    this.props.auth.signOut();
    this.setState({
      loading: true,
    });
  }

  render() {
    return (
      <div>
        <span>
          Hi, 
          <input
            value={this.state.name}
            onChange={this.handleNameChange}
            autoFocus
          />
          !
        </span>
        &nbsp;
        <button onClick={this.handleUpdateName}>Change</button>
        <button onClick={this.handleSignOut}>Sign Out</button>
        <hr/>
        {this.state.loading && <Loading/>}
      </div>
    );
  }
}

export default User;
