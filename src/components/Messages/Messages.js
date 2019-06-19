import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import firebase from '../../firebase';
import ProgressBar from './ProgressBar';


class Messages extends Component {

    state = {
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        progressBar: false,
        numUniqUsers: ''
      };

      componentDidMount() {
        const { channel, user } = this.state;
    
        if (channel && user) {
          this.addListeners(channel.id);
        }
      }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    };

    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            //console.log(loadedMessages);
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqUser(loadedMessages);
        });
    };

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

    displayChannelName = (channel) => channel ? `# ${channel.name} ` :  '';

    render() {
        const { messagesRef, messages, channel, user, progressBar, numUniqUsers } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqUsers={ numUniqUsers }
                />
                <Segment>
                    <Comment.Group className={ progressBar ? "messages__progress" : "messages"}>
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessageForm 
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={ this.isProgressBarVisible }
                />
            </React.Fragment>
        );
    }
}

export default Messages;