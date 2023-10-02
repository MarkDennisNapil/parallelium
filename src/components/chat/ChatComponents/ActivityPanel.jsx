/* eslint-disable react/jsx-key */
import React from 'react';
import axios from 'axios';
import api from '../../../api';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Chat from '../chat';
import '../../../styles/chat/ActivityPanel.css';

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      message: '',
      contactlist: [],
      chatlist: [],
      last_contact: localStorage.getItem('last_contact'),
      viewtype: '',
      showContacts: 'none',
      token: localStorage.getItem('token'),
      user_id: localStorage.getItem('user_id')
    }
  }
  componentDidMount() {
    axios.get(`${api}messages/user/${this.state.user_id}`)
      .then(res => {
        this.setState({ chatlist: res.data.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios.get(`${api}collection/users`)
      .then(result => {
        this.setState({ contactlist: result.data.data, showContacts: 'block' });
      })
      .catch(err => {
        console.log(err);
      });
  }
  MessageListCard() {
    return this.state.chatlist.map((message, i) => {
      return <div className='message-contact-card' onClick={this.getConversation.bind(this, i)}>
        <img src={`${api}resources/${this.state.chatlist.myphoto}`} alt="Failed to load image!" />
        <img src={`${api}resources/${this.state.chatlist.myphoto}`} alt="Failed to load image!" />
        <span>{this.state.chatlist.first_name + " " + this.state.chatlist.last_name}</span>
      </div>;
    });
  }
  getConversation = (i) => {
    localStorage.setItem('last_contact', this.state.chatlist[i]._id);
    this.setState({ last_contact: this.state.chatlist[i]._id });
    this.ContactList()
    return <Chat last_contact={this.state.last_contact} />;
  }
  showPanel() {
    if (this.state.viewtype === 'contact') {
      return this.ContactListItem();
    }
    else {
      return this.MessageListCard();
    }
  }
  ContactList = () => {
    axios.get(`${api}collection/users`)
      .then(result => {
        this.setState({ contactlist: result.data.data, viewtype: 'contact' });
      })
      .catch(e => {
        console.log(e);
      });
  }
  sentMessages = () => {
    axios.get(`${api}messages/user/${this.state.user_id}/sent`)
      .then(res => {
        this.setState({ chatlist: res.data.data, viewtype: 'sentbox' });
      })
      .catch(err => {
        console.log(err);
      });
  }
  inboxMessages = () => {
    axios.get(`${api}messages/user/${this.state.user_id}/inbox`)
      .then(res => {
        this.setState({ chatlist: res.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className='contactlist-container'>
        <div className='contactlist-sidebar'>
          <div className='contactlist-search-bar'>
            <input type='text' className='contactlist-search-contact' placeholder='Find contact...' />
          </div>
          <div className='contactlist-message-nav'>
            <Link to='/chat'><Button>All</Button></Link>
            <Button onClick={this.ContactList}>Contacts</Button>
            <Button onClick={this.inboxMessages}>Inbox</Button>
            <Button onClick={this.sentMessages}>Sent</Button>
          </div>
          <div className='message-space'>
            {this.showPanel()}
          </div>
        </div>
      </div >
    );
  }
}

export default ChatList;