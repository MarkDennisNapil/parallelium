/* eslint-disable react/prop-types */
import axios from 'axios';
import React from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Comment from '../comment/comment';
import heart from '../../assets/svgs/solid/heart.svg';
import emptyheart from '../../assets/svgs/solid/emptyheart.svg';
import comment from '../../assets/svgs/solid/comment-dots.svg';
import gift from '../../assets/svgs/solid/gift.svg';
import share from '../../assets/svgs/solid/share.svg';
import ellipsis from '../../assets/svgs/solid/ellipsis.svg';
import paperplane from '../../assets/svgs/solid/paper-plane.svg';
import bookopen from '../../assets/svgs/solid/book-open-reader.svg';
import '../../styles/paper/item.css';

export default class PaperItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem('user_id'),
      postid: this.props.obj._id,
      datePosted: this.props.obj.dateModified.split(" "),
      posttype: 'text',
      owner_info: [],
      post_id: '',
      comment: '',
      reactorlist: [],
      commentlist: [],
      liked: false,
      likebg: '',
      itemVisibility: '',
      showComments: 'none',
      btnSendComment: 'none',
      commentContWidth: '',
      commentContHeight: '',
      commentScroll: '',
      btnSendReply: '',
      showOptionButton: '',
      postOption: 'none',
      heart: emptyheart,
      viewed: false,
      expandtext: '',
      viewsCount: '',
      btnExpandText: ''
    }
    this.onChange = this.onChange.bind(this);
    this.reactPost = this.reactPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.viewPost = this.viewPost.bind(this);
    this.viewProfile = this.viewProfile.bind(this);
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  componentDidMount() {
    axios.get(`${api}users/${this.props.obj.writers}`)
      .then((res) => {
        this.setState({ owner_info: res.data.data });
        if (this.props.obj.owner === this.state.user_id) {
          this.setState({ showOptionButton: 'block' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    axios.get(`${api}text/${this.props.obj._id}`)
      .then((result) => {
        this.setState({ reactorlist: result.data.data.likes, viewsCount: result.data.data.views.length });
        for (let i = 0; i < result.data.data.likes.length; i++) {
          if (result.data.data.likes[i] === this.state.user_id) {
            this.setState({ liked: true, heart: heart });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
      this.getCommentData()
  }
  reactPost = () => {
    if (this.state.liked === true) {
      this.setState({ heart: heart });
    }
    else {
      axios.put(`${api}text/${this.props.obj._id}/like/${this.state.user_id}`)
        .then(() => {
          this.setState({ heart: heart });
          this.state.reactorlist.push(this.state.user_id);
        })
        .catch(() => {
          console.log("Failed to react to post!");
        });
    }
  }
  editTextPost = () => {
    this.props.EditPostCallback(this.state.postid, 'text');
  }
  fetchComments = () => {
    axios.get(`${api}text/${this.props.obj._id}/comments`)
      .then(res => {
        this.setState({ commentlist: res.data.data });
        if (this.state.showComments === 'none') {
          this.setState({ showComments: 'block', commentScroll: 'scroll' });
        }
        else {
          this.setState({ showComments: 'none', commentScroll: '' });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  getCommentData(){
    axios.get(`${api}post/${this.props.obj._id}/comments`)
    .then(response => {
      this.setState({commentlist: response.data.data});
    })
    .catch(error => {
      console.log(error);
    });
   }
  renderComments() {
    return this.state.commentlist.map((comment, i) => {
      return <Comment item={comment} key={i} posttype={this.state.posttype} />
    });
  }
  submitComment = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('postid', this.props.obj._id);
    formdata.append('comment', this.state.comment);
    formdata.append('userid', this.state.user_id);
    axios.post(`${api}text/comment/add`, formdata, {})
      .then(res => {
        alert(res.data.message);
        this.setState({user_id: '', comment: ''});
        this.fetchComments()
      })
      .catch(err => {
        console.log(err);
      });
  }

  deletePost() {
    axios.delete(`${api}text/${this.props.obj._id}`)
      .then((result) => {
        alert(result.data.message);
        this.setState({ itemVisibility: 'none' });
      })
      .catch((err) => {
        alert("Deletion failed!");
        console.log(err);
      });
  }
  viewPost = () => {
    localStorage.setItem("view_post", this.props.obj._id);
  }
  viewProfile = () => {
    localStorage.setItem("view_profile", this.state.owner_info._id);
  }
  resetCommentState = () => {
    this.setState({ btnSendComment: 'block', btnSendReply: 'none' });
  }
  itemShow = () => {
    this.setState({ itemVisibility: 'none' });
  }
  openPostOption = () => {
    if (this.state.postOption === 'none' && this.props.obj.writers === this.state.user_id) {
      this.setState({ postOption: 'block' });
    }
    else {
      this.setState({ postOption: 'none' });
    }
  }
  closePostOption = () => {
    this.setState({ postOption: 'none' });
  }
  ReadText = () => {
    this.setState({expandtext: 'auto', btnExpandText: 'none'});
    if(!this.state.viewed){
    axios.put(`${api}text/${this.props.obj._id}/view/${this.state.user_id}`)
    .then(() => {
      this.setState({viewed: true});
    })
    .catch(error => {
      console.log(error);
    });
  }
  }
  SendGift = (e) => {
    e.preventDefault();
    const amount = 1;
    const description = `USER: ${this.state.user_id} sends gift to USER: ${this.props.obj.writers} post, PAPER/POST_ID: ${this.props.obj._id}`;
    const formdata = new FormData();
    formdata.append('sender', this.state.user_id);
    formdata.append('receiver', this.props.obj.writers);
    formdata.append('amount', amount);
    formdata.append('description', description);
    axios.put(`${api}users/coins/use`, formdata, {})
    .then(() => alert("Gift sent"))
    .catch(error => console.log(error.message))
  }
  render() {
    return (
      <div className='textcard-container' style={{ display: `${this.state.itemVisibility}` }}>
        <div className='textcard-content' >
          <div className='textcard-post' style={{ width: `${this.state.commentContWidth}`, height: `${this.state.commentContHeight}` }}>
            <div className='textcard-post-blur'>
              <div className='textcard-post-owner' onClick={this.viewProfile}>
                <Link to='/view/profile' onClick={this.viewProfile}>
                  <img src={`${api}resources/${this.state.owner_info.photo}`} style={{ height: `${this.state.commentContHeight}` }} alt='🙂' />
                </Link>
                <span className='textcard-ownername'>{this.state.owner_info.first_name + " " + this.state.owner_info.last_name}</span>
                <Button className="btn-show-option" onClick={this.openPostOption}><img src={ellipsis} /></Button>
                <div className="textcard-item-option" style={{ display: `${this.state.postOption}` }} onMouseLeave={this.closePostOption}>
                  <Button className='btn-hide' onClick={this.itemShow} style={{ display: `${this.state.showOptionButton}` }}>Hide</Button>
                  <Button className='btn-edit' onClick={this.editTextPost} style={{ display: `${this.state.showOptionButton}` }}>Edit</Button>
                  <Button className='btn-delete' onClick={this.deletePost} style={{ display: `${this.state.showOptionButton}` }}>Delete</Button>
                </div>
              </div>
              <div className='textcard-caption' style={{height: `${this.state.expandtext}`}}>
                <h1>{this.props.obj.title}</h1>
                <span>{this.state.datePosted[0] + " " + this.state.datePosted[1] + " " + this.state.datePosted[2] + " " + this.state.datePosted[3]}</span>
                <p style={{height: `${this.state.expandtext}`}}>{this.props.obj.content}</p>
                <Button onClick={this.ReadText} style={{display: `${this.state.btnExpandText}`}}>Read More...</Button>
              </div>
              <div className='textcard-post-actions' >
                <Button onClick={this.reactPost}><img src={this.state.heart} alt="heart" />{this.state.reactorlist.length}</Button>
                <Button><img src={bookopen} />{this.state.viewsCount}</Button>
                <Button onClick={this.fetchComments}><img src={comment} alt='comment' />{this.state.commentlist.length}</Button>
                <Button onClick={this.SendGift}><img src={gift} /></Button>
                <Button><img src={share} alt="share" /></Button>
              </div>
              <div className="comment-container" onClick={this.resetCommentState} style={{ display: `${this.state.showComments}` }}>
                <div className='comments-space' style={{ display: `${this.state.showComments}`, overflowY: `${this.state.commentScroll}` }}>
                  {this.renderComments()}
                </div>
                <div className='comment-section'>
                    <input type="text" name="comment" className="txtcomment" value={this.state.comment} onChange={this.onChange} placeholder=">..." required />
                    <Button onClick={this.submitComment} className="btnSendComment"><img src={paperplane} /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
