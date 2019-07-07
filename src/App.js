import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import config from './config/firebase';
import Loading from './common/Loading';
import SignIn from './common/SignIn';
import Home from './common/Home';

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
    const user = this.state.user;
    if (user === false) return <Loading/>;
    if (user) return <Home auth={auth} user={user}/>
    return <SignIn auth={auth}/>;
  }
}

export default App;
