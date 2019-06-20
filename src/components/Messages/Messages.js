import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import ProgressBar from './ProgressBar';



class Messages extends Component {

    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref("privateMessages"),
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        isChannelStarred: false,
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        progressBar: false,
        numUniqUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
      };

    componentDidMount() {
        const {
            channel,
            user
        } = this.state;

        if (channel && user) {
            this.addListeners(channel.id);
            this.addUserStarsListener(channel.id, user.uid);
        }
    };
//TODO: DISPLAY STARRED ON SIDE PANNEL
    addUserStarsListener = (channelId, userId) => {
        this.state.usersRef
            .child(userId)// select user
            .child('starred')// select starred channel
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({ isChannelStarred: prevStarred });
                }
            });
    };

    addListeners = channelId => {
        this.addMessageListener(channelId);
    };

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            //console.log(loadedMessages);
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqUser(loadedMessages);
        });
    };

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;
        return privateChannel ? privateMessagesRef : messagesRef;
    };

    handleStar = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel());
    };
// write starred channel to database after we mast add listener for this!!!
    starChannel = () => {
        if (this.state.isChannelStarred) {
            //console.log('star');
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id]: {
                        name: this.state.channel.name,
                        details: this.state.channel.details,
                        createdBy: {
                            name: this.state.channel.createdBy.name,
                            avatar: this.state.channel.createdBy.avatar
                        }
                    }
                });
        } else {
            //console.log('unstar');
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if( err !== null) {
                        console.log(err);
                    }
                });
        }
    };

    handleSearchChange = (event) => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages());
    };

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex) || 
                message.user.name.match(regex)) 
            {
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);

    }

    countUniqUser = messages => {
        const uniquUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural = uniquUsers.length > 1 || uniquUsers === 0;
        const numUniqUsers = `${uniquUsers.length} user${plural ? "s" : ""}`;
        this.setState({ numUniqUsers });
    };

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    );

    isProgressBarVisible = (percent) => {
        if (percent > 0 ) {
            this.setState({ progressBar: true });
        }
    };

    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@  ' : '#  '}${channel.name}` : '';
    };

    render() {
        const { messagesRef, messages, channel, user, progressBar, isChannelStarred,
            numUniqUsers, searchTerm, searchResults, searchLoading, privateChannel } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqUsers={ numUniqUsers }
                    handleSearchChange={ this.handleSearchChange }
                    searchLoading={ searchLoading }
                    isPrivateChannel={ privateChannel }
                    handleStar={ this.handleStar }
                    isChannelStarred= { isChannelStarred }
                />
                <Segment>
                    <Comment.Group className={ progressBar ? "messages__progress" : "messages"}>
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessageForm 
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={ privateChannel }
                    getMessagesRef={ this.getMessagesRef }
                    isProgressBarVisible={ this.isProgressBarVisible }
                />
            </React.Fragment>
        );
    }
}

export default Messages;