import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import config from './config/firebase';
import SignIn from './common/SignIn';

const auth = firebase.initializeApp(config).auth();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: false};
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      this.setState({user: user});
    });
  }

  render() {
    return <SignIn auth={auth}/>;
  }
}

export default App;
