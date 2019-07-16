import React from 'react';
import './User.css';
import Croppie from 'croppie';
import 'croppie/croppie.css';
import $ from 'jquery';
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
      photo: '',
      updatePhoto: null,
    };
    this.fileInput = React.createRef();
    this.cropperImg = React.createRef();
    this.choosePhoto = this.choosePhoto.bind(this);
    this.clickPhoto = this.clickPhoto.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
  }

  clickPhoto(e) {
    this.fileInput.current.click();
  }

  choosePhoto(e) {
    const src = URL.createObjectURL(e.target.files[0]);
    this.setState({updatePhoto: src});
    $("#exampleModal").modal("show");
  }

  setUserPhoto() {
    const user = this.props.user;
    const storage = this.props.storage;
    if (!user.photoURL) {
      storage.child(
        'user_profile_photos/user.svg'
      ).getDownloadURL().then(url => {
        user.updateProfile({photoURL: url}).then(() => {
          this.setState({photo: user.photoURL});
        });
      });
    } else {
      this.setState({photo: user.photoURL});
    }
  }

  componentDidMount() {
    this.setUserPhoto();
    this.croppie = new Croppie(this.cropperImg.current, {
      enableExif: true,
      viewport: {
        width: 256,
        height: 256,
        type: 'circle'
      },
      boundary: {
        width: 256,
        height: 256
      }
    });
    let self = this;
    $('#exampleModal').on('shown.bs.modal', function (e) {
      self.croppie.bind({url: self.state.updatePhoto});
      console.log(self);
      let modal = $(this);
      console.log(modal, modal.find(".modal-footer"));
      modal.find(".modal-footer .btn").click(e => {
        console.log('ok');
        self.croppie.result('blob').then(function(blob) {
          console.log(blob);
        });
      });
    });
  }

  handleUpdateProfile(e) {
    if (!this.state.loading) {
      const user = this.props.user;
      user.updateProfile({
        displayName: this.state.name,
        photoURL: this.state.photo,
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
      <div className="User">
        <img
          src={this.props.user.photoURL}
          onClick={this.clickPhoto}
          className="User-current-photo"
          alt="profile"
        />
        <br/>
        <input
          type="file"
          ref={this.fileInput}
          onChange={this.choosePhoto}
          accept="image/*"
        />
        <div>
          Hi, 
          <input
            value={this.state.name}
            onChange={this.handleNameChange}
            autoFocus
          />
          !
        </div>
        <button onClick={this.handleUpdateProfile}>Update</button>
        <button onClick={this.handleSignOut}>Sign Out</button>
        {this.state.loading && <Loading/>}

        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <img
                  className="User-photo-cropper"
                  ref={this.cropperImg}
                  alt="update"
                />
              </div>
              <div className="modal-footer text-center">
                <button type="button" className="btn btn-primary btn-block">OK</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default User;
