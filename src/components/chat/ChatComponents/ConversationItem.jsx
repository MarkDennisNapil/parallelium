/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import api from "../../../api";
import '../../../styles/chat/ActivityPanel.css';

class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem('user_id'),
      sender_info: [],
      receiver_info: [],
      receiver_id: '',
      showSender: ''
    }
    this.onGetID = this.onGetID.bind(this);
  }
  componentDidMount() {
    axios.get(`${api}users/${this.props.item.sender_id}`)
      .then(res => {
        this.setState({ receiver_info: res.data.data });
        if (this.props.item.sender_id === this.state.user_id) {
          this.setState({ showSender: 'block' });
        }
      })
      .catch(err => {
        console.log(err);
      });
    axios.get(`${api}users/${this.props.item.receiver_id}`)
      .then(res => {
        this.setState({ receiver_info: res.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onGetID = () => {
    this.props.getContactID(this.props.item._id);
  }
  render() {
    return (
      <div className='message-contact-card' onClick={this.onGetID}>
        <div className="ch1-item-avatar">
        <img src={`${api}resources/${this.state.sender_info.photo}`} style={{ display: `${this.state.showSender}` }} />
        <img src={`${api}resources/${this.state.receiver_info.photo}`} />
        </div>
        <span>{this.state.receiver_info.first_name + " " + this.state.receiver_info.last_name} <br></br>{this.props.item.message}</span>
      </div>
    );
  }
}

export default MessageItem;