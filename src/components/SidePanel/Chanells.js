import React, { Component, Fragment } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions'; 

class Chanells extends Component {

    state = {
        user: this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetail: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false
    };

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', span => {
            loadedChannels.push(span.val());
            //console.log(loadedChannels);
            this.setState({ channels: loadedChannels });
        })
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetail, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetail,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: '', channelDetail: ''});
                this.closeModal();
                console.log('channel added');
            })
            .catch((err) => {
                console.log(err);
            })
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            //console.log('channel added');
            this.addChannel();
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    changeChannel = channel => {
        this.props.setCurrentChannel(channel);
    }


    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key = {channel.id}
                onClick = {() => this.changeChannel(channel)}
                name = {channel.name}
                style = {{ opacity: 0.7 }}
            >
                # { channel.name }
            </Menu.Item>
        ))
    )

    isFormValid = ({ channelName, channelDetail }) => channelName && channelDetail;

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false})

    render() {

        const { channels, modal } = this.state;

        return (
            <Fragment>
            <Menu.Menu style={{ paddingBottom: '2em'}}>
                <Menu.Item>
                    <span>
                        <Icon name = "exchange"/> CHANNELS
                    </span>{" "}
                    ({ channels.length }) <Icon name="add" onClick={this.openModal} />
                </Menu.Item>
                {/* Channels */}
                { this.displayChannels( channels )}
            </Menu.Menu>
                {/* Add channel modal */}
            <Modal basic open={ modal } onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit = { this.handleSubmit }>
                        <Form.Field>
                            <Input
                                fluid
                                label='Name of Channel'
                                name='channelName'
                                onChange={ this.handleChange }
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                fluid
                                label='About the channel'
                                name='channelDetail'
                                onChange={ this.handleChange }
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick = { this.handleSubmit }>
                        <Icon name="checkmark"/> Add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove"/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </Fragment>
        );
    }
};

// export default Chanells;
// whith redux
export default connect(null, { setCurrentChannel })(Chanells);