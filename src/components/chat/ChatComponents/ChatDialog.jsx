/* eslint-disable react/prop-types */
import axios from "axios";
import React from "react";
import api from "../../../api";
import { Button } from "react-bootstrap";
import paperplane from '../../../assets/svgs/solid/paper-plane.svg';
import '../../../styles/chat/ChatDialog.css';

class ChatDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sender_id: localStorage.getItem('user_id'),
      receiver_id: this.props.tomsg_userid,
      text: '',
      files: [],
      date: ''
    }
    this.onChange = this.onChange.bind(this);
  }
  onChange = (e) => this.setState({ text: e.target.value });
  sendMsg = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('message', this.state.text);
    axios.post(`${api}message/from/${this.state.sender_id}/to/${this.state.receiver_id}`, formdata, {})
      .then((result) => {
        alert(result.data.message + JSON.stringify(result.data.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <div className="cd1-container">
        <input type="text" name="text" className="cd1-txtmessage" value={this.state.text} onChange={this.onChange} placeholder="Message Me..." required />
        <Button onClick={this.sendMsg}><img src={paperplane} /></Button>
      </div>
    );
  }
}

export default ChatDialog;