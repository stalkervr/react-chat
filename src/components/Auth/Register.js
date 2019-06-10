import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

class Register extends Component {
        state = {
          username: '',
          email: '',
          password: '',
          passwordConfirmation: '',
          errors: []
        };

        isFormValid = () => {
            let errors = [];
            let error;
        
            if (this.isFormEmpty(this.state)) {
              error = { message: 'Fill in all fields sss1' };
              this.setState({ errors: errors.concat(error) });
              return false;
            } else if (!this.isPasswordValid(this.state)) {
              error = { message: 'Password is invalid sss1' };
              this.setState({ errors: errors.concat(error) });
              return false;
            } else {
              return true;
            }
          };
//TODO: DONT ANDERSTAND

/* #region   search error*/
//   isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
//       return (
//           !username.lenght ||
//           !email.lenght ||
//           !password.lenght ||
//           !passwordConfirmation.lenght
//       );
//   };
/* #endregion */

        isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return (
            !username.length ||
            !email.length ||
            !password.length ||
            !passwordConfirmation.length
            );
        };

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if  ( password.lenght < 6 || passwordConfirmation.lenght < 6) {
            return false;
        } else if ( password !== passwordConfirmation ){
            return false;
        } else {
            return true;
        }
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        if (this.isFormValid()) {
        event.preventDefault();
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
            console.log(createdUser);
        })
        .catch(err => {
            console.error(err.message);
        });}
    };

    render() {

        const { username, email, password, passwordConfirmation, errors} = this.state;

        return (
            <Grid textAlign = 'center' verticalAlign = 'middle' className="app">
                <Grid.Column style = {{ maxWidth: 450}}>
                    <Header as = 'h2' icon color = 'orange' textAlign = 'center'>
                        <Icon name = 'users' color='orange'/>
                        Register for DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size='large'>
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" 
                            placeholder="User name" onChange={this.handleChange}
                            value={username} 
                            type="text"/>

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" 
                            placeholder="Email" onChange={this.handleChange}
                            value={email} 
                            type="email"/>

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" 
                            placeholder="Password" onChange={this.handleChange}
                            value={password} 
                            type="password"/>

                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" 
                            placeholder="Password confirmation" onChange={this.handleChange}
                            value={passwordConfirmation} 
                            type="password"/>

                            <Button color="orange" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a user ? <Link to='/login'> Login </Link> </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;