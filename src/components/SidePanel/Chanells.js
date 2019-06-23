import React, { Component, Fragment } from 'react';
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions'; 

class Chanells extends Component {

    state = {
        activeChannel: '',
        user: this.props.currentUser,
        channel: null,
        channels: [],
        channelName: '',
        channelDetail: '',
        channelsRef: firebase.database().ref('channels'),
        messagesRef: firebase.database().ref('messages'),
        typingRef: firebase.database().ref('typing'),
        notifications: [],
        modal: false,
        firstLoad: true
    };

    componentDidMount() {
        this.addListeners();
    };

    componentWillUnmount() {
        this.removeListeners();
    };

    removeListeners = () => {
        this.state.channelsRef.off();
    };

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            //console.log(loadedChannels);
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
            this.addNotificationListener(snap.key);
        });
    };

    addNotificationListener = channelId => {
        this.state.messagesRef.child(channelId).on('value', snap => {
            if (this.state.channel) {
                this.handleNotification(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        })
    };

    handleNotification = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === channelId);

        if (index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = notifications[index].total;

                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            });
        }

        this.setState({ notifications });
    };

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            this.setState({ channel: firstChannel });
        }
        this.setState({
            firstLoad: false
        });
    };

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
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            //console.log('channel added');
            this.addChannel();
        }
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove();
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel });
    };

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);
        
        if (index !== -1) {
            let updateNotifications = [...this.state.notifications];
            updateNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updateNotifications[index].count = 0;
            this.setState({ notifications: updateNotifications });
        }
    };

    setActiveChannel = channel => {
        this.setState({
            activeChannel: channel.id
        });
    };

    getNotificationsCount = channel => {
        let count = 0;

        this.state.notifications.forEach(notification => {
            if (notification.id === channel.id) {
                count = notification.count;
            }
        });

        if (count > 0) return count;
    }


    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key = {channel.id}
                onClick = {() => this.changeChannel(channel)}
                name = {channel.name}
                style = {{ opacity: 0.7 }}
                active = {channel.id === this.state.activeChannel}
            >
                { this.getNotificationsCount(channel) && (
                    <Label color="red">{ this.getNotificationsCount(channel) }</Label>
                )}
                # { channel.name }
            </Menu.Item>
        ))
    );

    isFormValid = ({ channelName, channelDetail }) => channelName && channelDetail;

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false})

    render() {

        const { channels, modal } = this.state;

        return (
            <Fragment>
            <Menu.Menu className="menu">
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
export default connect(null, { setCurrentChannel, setPrivateChannel })(Chanells);