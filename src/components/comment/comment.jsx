/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import api from "../../api";
import { Button } from "react-bootstrap";
import paperplane from '../../assets/svgs/solid/paper-plane.svg';
import '../../styles/comment/comment.css';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem('user_id'),
      comment: '',
      commentordata: [],
      showReply: 'none',
      btnDelete: 'none',
      commentVisibility: ''
    }
    this.onChange = this.onChange.bind(this);
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  componentDidMount() {
    axios.get(`${api}users/${this.props.item.commentedBy}`)
      .then(res => {
        this.setState({ commentordata: res.data.data });
        if (this.props.item.commentedBy === this.state.user_id) {
          this.setState({ btnDelete: 'block' });
        } else {
          this.setState({ btnDelete: 'none' });
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  }
  toggleReply = () => {
    if (this.state.showReply === 'none') {
      this.setState({ showReply: 'block' });
    } else {
      this.setState({ showReply: 'none' })
    }
  }
  submitReply = (e) => {
    e.preventDefault();
    const replytext = `replied to ${this.state.commentordata.first_name + " " + this.state.commentordata.last_name}\n${this.state.comment}`;
    const formdata = new FormData();
    formdata.append('postid', this.props.item.postID);
    formdata.append('comment', replytext);
    formdata.append('userid', this.state.user_id);
    formdata.append('commentID', this.props.item._id);
    axios.post(`${api}${this.props.posttype}/comment/reply`, formdata, {})
      .then(res => {
        alert(res.data.message);
      })
      .catch(err => {
        console.log(err);
      });
  }
  deleteComment = () => {
    axios.delete(`${api}${this.props.posttype}/comment/${this.props.item._id}`)
      .then(res => {
        alert(res.data.message);
        this.setState({commentVisibility: 'none'});
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className="post-comment-container" style={{display: `${this.state.commentVisibility}`}}>
        <div className="post-comment-section">
          <span className="commentor"><img src={`${api}resources/${this.state.commentordata.photo}`} />{this.state.commentordata.first_name + " " + this.state.commentordata.last_name}</span><br></br>
          <span className="comment">{this.props.item.comment}</span><br></br>
          <div className="comment-option">
            <br></br><Button onClick={this.toggleReply} className="btnReply">Reply</Button>
            <Button onClick={this.deleteComment} className="btnDeleteComment" style={{ display: `${this.state.btnDelete}` }}>Delete</Button>
          </div>
        </div>
        <div className="comment-reply-section" style={{ display: `${this.state.showReply}` }}>
          <form>
            <input type="text" name="comment" className="txtcomment" value={this.state.comment} onChange={this.onChange} placeholder="Reply..." />
            <Button onClick={this.submitReply} className="btnSendReply"><img src={paperplane} /></Button>
          </form>
        </div>
      </div>
    );
  }
}

export default Comment;