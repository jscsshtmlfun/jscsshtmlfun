import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import config from './config/firebase';
import Loading from './common/Loading';
import SignIn from './common/SignIn';
import Home from './common/Home';

const firebaseApp = firebase.initializeApp(config);
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

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
    const user = this.state.user;
    if (user === false) return <Loading/>;
    if (user) return <Home auth={auth} user={user} storage={storage}/>
    return <SignIn auth={auth}/>;
  }
}

export default App;
