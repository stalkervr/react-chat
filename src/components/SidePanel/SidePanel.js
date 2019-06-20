import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';
import Channels from './Chanells';
import DirectMessages from './DirectMessages';
import Starred from './Starred';

class SidePanel extends Component {
    render() {

        const { currentUser } = this.props;

        return (
            <Menu
                size='large'
                inverted
                fixed='left'
                vertical
                style={{ background: '#778899', fontSize: '1.2rem'}}
            >
                <UserPanel currentUser={ currentUser } />
                <Starred currentUser={ currentUser }/>
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={ currentUser } />
            </Menu>
        );
    }
}
//color #ff6f61
export default SidePanel;