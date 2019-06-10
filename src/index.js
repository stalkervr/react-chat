import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import registerServiceWorker from './registerServiceWorker';
import firebase from './firebase'

import 'semantic-ui-css/semantic.min.css';

import { BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom';

class Root extends Component {

    componentDidMount() {
        firebase
            .auth()
            .onAuthStateChanged(user => {
                if(user) {
                    this.props.history.push('/');
                    console.log(user);
                }
            })
    }

    render() {
        return (
                <Switch>
                    < Route exact path = '/' component = {App} />
                    < Route path = '/login' component = {Login} />
                    < Route path = '/register' component = {Register} />
                </Switch>
            
        );
    }
};

const RootwithAuth = withRouter(Root);

ReactDOM.render(
    <Router>
        <RootwithAuth/>
    </Router>,
    document.getElementById('root')
    );
registerServiceWorker();
