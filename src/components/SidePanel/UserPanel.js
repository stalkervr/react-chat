import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../firebase';

class UserPanel extends Component {

    state = {
        user: this.props.currentUser
    };

/* #region   */
    // componentDidMount() {
    //     this.setState({
    //         user: this.props.currentUser
    //     });
    // }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         user: nextProps.currentUser
    //     });
    // }
/* #endregion */

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(()=>console.log('Signed out'))
    }

    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>{ this.state.user.displayName }</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={ this.handleSignOut }>Sign Out</span>
        }
    ];

    render() {
        //console.log(this.props.currentUser);
        const { user } = this.state;
        return (
            <Grid style={{ background: '#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        {/* APP HEADER */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                        {/* USER DROPDOWN */}
                        <Header style={{ padding: '0.25em'}} as="h4" inverted>
                            <Dropdown trigger={ <span> <Image src= {user.photoURL} spaced="right"avatar> </Image>{ user.displayName }</span>}
                            options={this.dropdownOptions()}/>
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

/* #region   */
// const mapStateToProps = state => ({
//     currentUser: state.user.currentUser
// });

// export default connect(mapStateToProps)(UserPanel);
/* #endregion */

export default UserPanel;