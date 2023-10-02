/* eslint-disable react/prop-types */
import React from "react";
import '../../../styles/chat/chat.css';

class MessageBubble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("user_id"),
      message: '',
      datecreated: '',
      align: '',
      alignDate: 'left',
      background: ''
    }
  }
  componentDidMount() {
    if (this.props.item.sender_id == this.state.user_id) {
      this.setState({ message: this.props.item.message, align: 'right',   background: `linear-gradient(135deg, #06BEB6, #48B1BF)`, alignDate: 'right' });
    }
    else {
      this.setState({ align: 'left' });
    }
  }
  showDate = () => {
    this.setState({ dateVisible: 'block' });
  }
  render() {
    return (
      <div className='ch1-mb1-container'>
        <div className='ch1-mb1-message'><p onClick={this.showDate} style={{ float: `${this.state.align}`, background: `${this.state.background}` }}>{this.props.item.message}</p>
        </div>
        <label className='ch1-mb1-date' style={{ float: `${this.state.align}`, textAlign: `${this.state.alignDate}` }}>{this.props.item.dateModified}</label>
      </div>
    );
  }
}

export default MessageBubble;