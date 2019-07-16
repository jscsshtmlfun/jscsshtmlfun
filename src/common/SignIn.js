import React from 'react';
import './SignIn.css';
import Loading from './Loading';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'dummy@us.er',
      password: 'fR58fT}F@)Mc*E"S',
      loading: false,
    };
    this.refEmail = React.createRef();
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  clearForm(e) {
    this.setState({email: '', password: ''});
    this.refEmail.current.focus();
    e.preventDefault();
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleSignIn(e) {
    const email = this.state.email;
    const password = this.state.password;
    if (email && password) this.handleSubmit(e);
  }

  catchError(error) {
    alert(error.message);
    this.setState({loading: false});
  }

  firebaseAction(e, type) {
    e.preventDefault();
    if (this.state.loading) return;
    const auth = this.props.auth;
    const email = this.state.email;
    const password = this.state.password;
    let action;
    if (type === 'password-reset') {
      action = auth.sendPasswordResetEmail(email).then(() => {
        alert('Password reset email sent!');
        this.setState({loading: false});
      });
    } else if (type === 'sign-up') {
      action = auth.createUserWithEmailAndPassword(email, password);
    } else if (type === 'sign-in') {
      action = auth.signInWithEmailAndPassword(email, password);
    }
    action.catch(error => {this.catchError(error)});
    this.setState({loading: true});
  }

  handleResetPassword(e) {
    this.firebaseAction(e, 'password-reset');
  }

  handleSignUp(e) {
    this.firebaseAction(e, 'sign-up');
  }

  handleSubmit(e) {
    this.firebaseAction(e, 'sign-in');
  }

  render() {
    return (
      <div className="SignIn text-center">
        <form className="form-signin" onSubmit={this.handleSubmit}>
          <h1 className="h3 mb-3 font-weight-normal">
            Welcome
            &nbsp;
            <a
              href="#/"
              onClick={this.clearForm}
              className="btn btn-outline-secondary"
            >
              New
            </a>
          </h1>
          <hr/>
          <input
            className="form-control"
            value={this.state.email}
            onChange={this.handleEmailChange}
            ref={this.refEmail}
            type="email"
            placeholder="email"
            autoFocus
            required
          />
          <input
            className="form-control"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            type="password"
            placeholder="password"
            required
          />
          <button className="btn btn-primary btn-block" onClick={this.handleSignIn}>
            Sign In
          </button>
          <br/>
          <button className="btn btn-secondary" onClick={this.handleSignUp}>
            Sign Up
          </button>
          &nbsp;&nbsp;&nbsp;
          <button className="btn btn-light" onClick={this.handleResetPassword}>
            Reset Password
          </button>
          {this.state.loading && <Loading/>}
        </form>
      </div>
    );
  }
}

export default SignIn;
