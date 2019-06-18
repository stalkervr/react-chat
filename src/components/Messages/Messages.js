import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

class Messages extends Component {
    render() {
        return (
            <React.Fragment>
                <MessagesHeader/>
                <Segment fluid>
                    <Comment.Group className='messages'>
                        {/*Messages*/}
                    </Comment.Group>
                </Segment>
                <MessageForm/>
            </React.Fragment>
        );
    }
}

export default Messages;