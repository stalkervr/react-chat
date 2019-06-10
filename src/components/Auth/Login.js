import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

class Login extends Component {

        state = {
          email: '',
          password: '',
          errors: [],
          loading: false
        };


    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
        this.setState({errors: [], loading: true});
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
                console.log(signedInUser);
                this.setState({
                    errors: [],
                    loading: false
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    loading: false
                });
            });
        }
    };

    isFormValid = ({email, password}) => email && password;

    

    hendleInputError = (errors, inputName) => {
        return (
            errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
        );
    }

    render() {

        const { email, password, errors, loading} = this.state;

        return (
            <Grid textAlign = 'center' verticalAlign = 'middle' className="app">
                <Grid.Column style = {{ maxWidth: 450}}>
                    <Header as = 'h2' icon color = 'violet' textAlign = 'center'>
                        <Icon name = 'code branch' color='violet'/>
                        Login to DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size='large'>
                        <Segment stacked>

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" 
                            placeholder="Email" onChange={this.handleChange}
                            value={email}
                            // change className atribut if have error in state
                            className={ this.hendleInputError(errors, 'email') }
                            type="email"/>

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" 
                            placeholder="Password" onChange={this.handleChange}
                            className={ this.hendleInputError(errors, 'password') }
                            value={password} 
                            type="password"/>

                            <Button disabled={ loading } className={ loading ? 'loading' : ''} color="violet" fluid size="large">Login</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message color='orange' error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Don't have an account ? <Link to='/register'> Register </Link> </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;