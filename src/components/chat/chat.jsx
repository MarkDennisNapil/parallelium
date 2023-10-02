/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import React from "react";
import axios from "axios";
import api from "../../api";
import { Button } from "react-bootstrap";
import MessageItem from "./ChatComponents/ConversationItem";
import MessageBubble from "./ChatComponents/MessageBubble";
import Navigation from "../navigation/navigationbar";
import search from '../../assets/svgs/solid/magnifying-glass.svg';
import plus from '../../assets/svgs/solid/plus.svg';
import paperplane from '../../assets/svgs/solid/paper-plane.svg';
import angleleft from '../../assets/svgs/solid/angle-left.svg';
import '../../styles/chat/chat.css';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inbox: [].reverse(),
      sent: [].reverse(),
      contacts: [].reverse(),
      conversation: [],
      userdata: [],
      last_contact: localStorage.getItem('last_contact'),
      last_contactData: [],
      message: '',
      viewtype: '',
      keyword: '',
      showConversation: '',
      commentPosition: '',
      commentZIndex: 0
    }
    this.onHandleChange = this.onHandleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getContactID = this.getContactID.bind(this);
    this.exitConversation = this.exitConversation.bind(this);
    this.renderCoversation = this.renderCoversation.bind(this);
  }
  onHandleChange = (e) => this.setState({ [e.target.name]: e.target.value });
  componentDidMount() {
    this.getInboxMessages()
    this.getContacts()
    this.fetchConversation()
    this.UserData()
    this.fetchContactData()
  }
  getInboxMessages = () => {
    axios.get(`${api}messages/user/${this.props.user_id}/inbox`)
      .then(res => {
        this.setState({ inbox: res.data.data, viewtype: 'inbox' });
      })
      .catch(err => {
        console.log(err);
      });
  }
  getSentMessages = () => {
    axios.get(`${api}messages/user/${this.props.user_id}/sent`)
      .then(res => {
        this.setState({ sent: res.data.data, viewtype: 'sent' });
      })
      .catch(err => {
        console.log(err);
      });
  }
  getContacts = () => {
    axios.get(`${api}collection/users`)
      .then(res => {
        this.setState({ contacts: res.data.data, viewtype: 'contacts' });
      })
      .catch(err => {
        console.log(err);
      });
  }
  fetchConversation = () => {
    axios.get(`${api}messages/user/${this.props.user_id}/and/${this.state.last_contact}`)
      .then(res => {
        this.setState({ conversation: res.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  fetchContactData = () => {
    axios.get(`${api}users/${this.state.last_contact}`)
      .then(res => {
        this.setState({ last_contactData: res.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  UserData = () => {
    axios.get(`${api}users/${this.props.user_id}`)
      .then(res => {
        this.setState({ userdata: res.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  sendMessage = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('message', this.state.message);
    axios.post(`${api}message/from/${this.props.user_id}/to/${this.state.last_contactData._id}`, formdata, {})
      .then(res => {
        alert(res.data.message);
      })
      .catch(err => {
        console.log(err);
      });
  }
  exitConversation = () => {
    this.setState({ showConversation: 'none', commentPosition: '', commentIndex: 0 });
  }
  renderInbox() {
    if (this.state.inbox == null) {
      return <p>0 Inbox</p>;
    } else {
      return this.state.inbox.map((item, i) => {
        return <MessageItem item={item} key={i} getContactID={this.getContact} />;
      });
    }
  }
  renderSentMessages() {
    if (this.state.sent === null) {
      return <p>0 Sent Messages</p>;
    } else {
      return this.state.sent.map((item, i) => {
        return <MessageItem item={item} key={i} />;
      });
    }
  }
  renderContacts() {
    if (this.state.contacts === null) {
      return <p>0 Contacts</p>;
    } else {
      return this.state.contacts.map((contact, i) => {
        return <div className="message-contact-card" onClick={this.getContactID.bind(this, i)} onClickCapture={this.getContactID.bind(this, i)}>
          <img src={`${api}resources/${this.state.contacts[i].photo}`} />
          <span>{this.state.contacts[i].first_name + " " + this.state.contacts[i].last_name}</span>
        </div>;
      });
    }
  }
  getContactID = (i) => {
    localStorage.setItem('last_contact', this.state.contacts[i]._id);
    if(screen.width < 688){
      this.setState({ last_contact: this.state.contacts[i]._id, showConversation: 'block', commentPosition: 'absolute', commentIndex: 2 });
    } else{
      this.setState({ last_contact: this.state.contacts[i]._id, showConversation: 'block' });
    }
    this.fetchConversation()
    this.fetchContactData()
  }
  renderCoversation = () => {
    return this.state.conversation.map((message, i) => {
      return <MessageBubble item={message} key={i} />;
    });
  }
  DataList() {
    if (this.state.viewtype === 'sent') {
      return this.renderSentMessages();
    }
    else if (this.state.viewtype === 'contacts') {
      return this.renderContacts();
    } else {
      return this.renderInbox();
    }
  }
  render() {
    return (
      <div className="ch1-container">
        <Navigation />
        <div className="ch1-chatroom">
          <div className="ch1-main">
            <div className="ch1-userpanel">
              <img src={`${api}resources/${this.state.userdata.photo}`} />
              <span>{this.state.userdata.first_name + " " + this.state.userdata.last_name}</span>
            </div>
            <div className="ch1-searchbar">
              <input type="text" name="keyword" className="txtsearchbar" value={this.state.keyword} onChange={this.onHandleChange} placeholder="Search Contacts or Text..." />
              <Button><img src={search} /></Button>
            </div>
            <div className="ch1-chatmenu">
              <Button onClick={this.getInboxMessages}>Inbox</Button>
              <Button onClick={this.getContacts}>Contacts</Button>
              <Button onClick={this.getSentMessages}>Sent</Button>
            </div>
            {this.DataList()}
          </div>
          <div className="ch1-conversation" style={{display: `${this.state.showConversation}`, position: `${this.state.commentPosition}`, zIndex: `${this.state.commentZIndex}`}}>
            <div className="ch1-topbar">
              <Button className="btnReturn" onClick={this.exitConversation}><img src={angleleft} /></Button>
              <img src={`${api}resources/${this.state.last_contactData}`} />
              <label>{this.state.last_contactData.first_name + " " + this.state.last_contactData.last_name}</label>
            </div>
            <div className="ch1-middle">{this.renderCoversation()}</div>
            <div className="ch1-bottombar">
              <Button className="btnAttach"><img src={plus} /></Button>
              <input type="text" name="message" className="txtmessage" value={this.state.message} onChange={this.onHandleChange} placeholder=">..." required />
              <Button className="btnSend" onClick={this.sendMessage}><img src={paperplane} /></Button>
            </div>
          </div>
          <div className="ch1-rightsidebar"></div>
        </div>
      </div>
    );
  }
}

export default Chat;