import React from 'react';
import './Home.css';
import userPhotoDefault from './user.svg';
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
      userPhotoURL: userPhotoDefault,
    };
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUpdateName = this.handleUpdateName.bind(this);
    this.handleUploadPhoto = this.handleUploadPhoto.bind(this);
    this.handleInputPhoto = this.handleInputPhoto.bind(this);
    this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
    this.fileInputPhoto = React.createRef();
    this.photo();
  }

  photo(file) {
    const path = 'user_profile_photos/' + this.props.user.uid;
    const ref = this.props.storage.ref().child(path);
    if (file) {
      ref.put(file).then(snapshot => {
        console.log('uploaded!', snapshot);
        this.photo();
      });
      return;
    }
    ref.getDownloadURL().then(url => {
      this.setState({userPhotoURL: url});
    }).catch(error => {
      console.log(error);
    });
  }

  handleChoosePhoto(e) {
    console.log(this.fileInputPhoto);
    this.fileInputPhoto.current.click();
  }

  handleInputPhoto(e) {
  }

  handleUploadPhoto(e) {
    const file = this.fileInputPhoto.current.files[0];
    this.photo(file);
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
      <div className="Home">
        <div className="text-right">
          <button onClick={this.handleSignOut}>Sign Out</button>
        </div>
        <hr/>
        <div className="text-center">
          <input type="file" accept="image/*" ref={this.fileInputPhoto}/>
          <button onClick={this.handleUploadPhoto}>Upload</button>
          <br/>
          <img
            onClick={this.handleChoosePhoto}
            src={this.state.userPhotoURL}
            className="Home-user-photo"
            alt="user"
          />
          <br/>
          <br/>
          <span>
            <input
              value={this.state.name}
              onChange={this.handleNameChange}
              className="form-control form-control-lg text-center"
            />
          </span>
          <br/>
          <button onClick={this.handleUpdateName}>Change</button>
        </div>
        {this.state.loading && <Loading/>}
      </div>
    );
  }
}

export default User;
