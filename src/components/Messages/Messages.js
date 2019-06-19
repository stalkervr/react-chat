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
        numUniqUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
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

    displayChannelName = (channel) => channel ? `# ${channel.name} ` :  '';

    render() {
        const { messagesRef, messages, channel, user, progressBar, 
            numUniqUsers, searchTerm, searchResults, searchLoading } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqUsers={ numUniqUsers }
                    handleSearchChange={ this.handleSearchChange }
                    searchLoading={ searchLoading }
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
                    isProgressBarVisible={ this.isProgressBarVisible }
                />
            </React.Fragment>
        );
    }
}

export default Messages;