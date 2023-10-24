/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import axios from 'axios';
import React from 'react';
import api from '../../api';
import resources from '../../resources';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import heart from '../../assets/svgs/solid/heart.svg';
import emptyheart from '../../assets/svgs/solid/emptyheart.svg';
import comment from '../../assets/svgs/solid/comment-dots.svg';
import share from '../../assets/svgs/solid/share.svg';
import gift from '../../assets/svgs/solid/gift.svg';
import ellipsis from '../../assets/svgs/solid/ellipsis.svg';
import paperplane from '../../assets/svgs/solid/paper-plane.svg';
import eye from '../../assets/svgs/solid/eye.svg';
import Comment from '../comment/comment';
import '../../styles/gallerylane/item.css';

class GalleryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem('user_id'),
      postid: this.props.obj._id,
      owner_info: [],
      filelist: [],
      reactorlist: [],
      commentlist: [],
      itemcomment: [],
      commentID: '',
      comment: '',
      commentType: 'main',
      liked: false,
      likebg: '',
      itemVisibility: '',
      showComments: 'none',
      enableScroll: '',
      postOption: 'none',
      btnSendComment: 'none',
      commentContWidth: '',
      commentContHeight: '',
      commentScroll: '',
      btnSendReply: 'none',
      showOptionButton: 'none',
      imgIndex: 0,
      heart: emptyheart,
      textHeight: '',
      viewed: false,
      viewsCount: ''
    }
    this.onChange = this.onChange.bind(this);
    this.reactPost = this.reactPost.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.viewPost = this.viewPost.bind(this);
    this.viewProfile = this.viewProfile.bind(this);
    this.ExpandPost = this.ExpandPost.bind(this);
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  componentDidMount() {
    axios.get(`${api}users/${this.props.obj.owner}`)
      .then((res) => {
        this.setState({ owner_info: res.data.data });
        if (this.props.obj.owner === this.state.user_id) {
          this.setState({ showOptionButton: 'block' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    axios.get(`${api}post/${this.props.obj._id}`)
      .then((res) => {
        this.setState({ filelist: res.data.data.files, reactorlist: res.data.data.likes, viewsCount: res.data.data.views.length });
        for (let i = 0; i < res.data.data.likes.length; i++) {
          if (res.data.data.likes[i] === this.state.user_id) {
            this.setState({ liked: true, heart: heart });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
      this.getCommentData()
  }
  FileList() {
    return this.state.filelist.map((item, i) => {
      return <img src={`${resources}${this.state.filelist[i]}`} onClick={this.setFileIndex.bind(this, i)} className='file-index-item' loading="lazy" width="15px" height="15px" alt='Failed to load image...' />;
    });
  }
  setFileIndex = (i) => {
    this.setState({ imgIndex: i });
  }
  reactPost = () => {
    if (this.state.liked === true) {
      this.setState({ heart: heart });
    }
    else {
      axios.put(`${api}post/${this.props.obj._id}/like/${this.state.user_id}`)
        .then(() => {
          this.setState({ heart: heart });
          this.state.reactorlist.push(this.state.user_id);
        })
        .catch((e) => {
          console.log("Failed to react to post!\n" + e);
        });
    }
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
  submitComment = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('postid', this.props.obj._id);
    formdata.append('comment', this.state.comment);
    formdata.append('userid', this.state.user_id);
    axios.post(`${api}post/comment/add`, formdata, {})
      .then(res => {
        alert(res.data.message);
        this.setState({user_id: '', comment: ''});
        this.fetchComments()
      })
      .catch(err => {
        console.log(err);
      });
  }
  deletePost = () => {
    axios.delete(`${api}post/${this.props.obj._id}`)
      .then(() => {
        alert("Deleted successfully!");
        this.setState({ itemVisibility: 'none' });
      })
      .catch((err) => {
        alert("Deletion failed!");
        console.log(err);
      });
  }
  editPost = () => {
    this.props.EditPostCallback(this.state.postid, 'post');
  }
  fetchComments = () => {
    axios.get(`${api}post/${this.props.obj._id}/comments`)
      .then(result => {
        this.setState({ commentlist: result.data.data });
        if (this.state.showComments === 'none') {
          this.setState({ showComments: 'flex', commentScroll: 'scroll', commentContWidth: '100%', commentContHeight: 'auto' });
        } else {
          this.setState({ showComments: 'none', commentScroll: '', commentContHeight: '', commentContWidth: '' });
        }
      })
      .catch(err => {
        console.log(err);
      });
      if(!this.state.viewed){
        axios.put(`${api}post/${this.props.obj._id}/view/${this.state.user_id}`)
        .then(() => {
          this.setState({viewed: true});
        })
        .catch(error => {
          console.log(error);
        });
      }
  }
  renderComments() {
    return this.state.commentlist.map((comment, i) => {
      return <Comment item={comment} key={i} posttype={'post'} />
    });
  }
  viewPost = () => {
    localStorage.setItem("view_post", this.props.obj._id);
  }
  viewProfile = () => {
    localStorage.setItem("view_profile", this.state.owner_info._id);
  }
  itemShow = () => {
    this.setState({ itemVisibility: 'none' });
  }
  openPostOption = () => {
    if (this.state.postOption === 'none') {
      this.setState({ postOption: 'block' });
    }
    else {
      this.setState({ postOption: 'none' });
    }
  }
  closePostOption = () => {
    this.setState({ postOption: 'none' });
  }
  resetCommentState = () => {
    this.setState({ btnSendComment: 'block', btnSendReply: 'none' });
  }
  ExpandPost = () => {
    alert("Expand!");
    this.setState({itemWidth: screen.width + 'px', itemHeight: 'auto'});
  }
  viewText = () => {
    this.setState({textHeight: 'auto'});
  }
  TriggerViewed = () => {
    if(!this.state.viewed){
    axios.put(`${api}post/${this.props.obj._id}/view/${this.state.user_id}`)
    .then(() => {
      this.setState({viewed: true});
    })
    .catch(error => {
      console.log(error);
    });
  }
  }
  IncrementIndex = () => {
    const {filelist, imgIndex} = this.state;
    if(imgIndex < filelist.length - 1){
      this.setState({imgIndex: imgIndex + 1});
    } else {
      this.setState({imgIndex: 0});
    }
  }
  DecrementIndex = () => {
    const {imgIndex} = this.state;
    if(imgIndex > 0){
      this.setState({imgIndex: imgIndex - 1});
    } else {
      this.setState({imgIndex: 0});
    }
  }
  SendGift = (e) => {
    e.preventDefault();
    const amount = 1;
    const description = `USER: ${this.state.user_id} sends gift to USER: ${this.props.obj.owner} post, POST_ID: ${this.props.obj._id}`;
    const formdata = new FormData();
    formdata.append('sender', this.state.user_id);
    formdata.append('receiver', this.props.obj.owner);
    formdata.append('amount', amount);
    formdata.append('description', description);
    axios.put(`${api}users/coins/use`, formdata, {})
    .then(() => alert("Gift sent"))
    .catch(error => console.log(error.message))
  }
  render() {
    return (
      <div className='card-container' style={{ display: `${this.state.itemVisibility}`, width: `${this.state.commentContWidth}`}}>
        <div className='card-content' >
          <div className='card-post' style={{width: `${this.state.commentContWidth}`, height: `${this.state.commentContHeight}`}}>
            <div className='card-post-blur'>
              <div className='card-img-container' >
              <div className='image-slide-control' onClick={this.fetchComments}>
                <Button className='previous-slide' onTouchStart={this.DecrementIndex} onDoubleClick={this.DecrementIndex}></Button>
                <Button className='next-slide' onTouchStart={this.IncrementIndex} onDoubleClick={this.IncrementIndex}></Button>
              </div>
                <img src={`${resources}${this.state.filelist[this.state.imgIndex]}`} style={{height: `${this.state.commentContHeight}`}} onClick={this.fetchComments} loading="lazy" alt='Failed to load image!' />
              </div>
              <div className='filelist-items'>
                {this.FileList()}
              </div>
              <div className='card-post-owner' onClick={this.viewProfile}>
                <Link to='/view/profile' onClick={this.viewProfile} >
                  <img src={`${resources}${this.state.owner_info.photo}`} alt='🙂' />
                </Link>
                <span className='card-ownername'>{this.state.owner_info.first_name + " " + this.state.owner_info.last_name}</span>
                <Button className="post-btn-show-option" onClick={this.openPostOption}><img src={ellipsis} /></Button>
                <div className="post-item-option" style={{ display: `${this.state.postOption}` }} onMouseLeave={this.closePostOption}>
                  <Button className='btn-hide' onClick={this.itemShow} style={{display: `${this.state.showOptionButton}`}}>Hide</Button>
                  <Button className='btn-edit' onClick={this.editPost} style={{ display: `${this.state.showOptionButton}` }}>Edit</Button>
                  <Button className='btn-delete' onClick={this.deletePost} style={{ display: `${this.state.showOptionButton}` }}>Delete</Button>
                </div>
              </div>
              <div className='card-caption' onClick={this.viewText} style={{height: `${this.state.textHeight}`}}>
                <label>{this.props.obj.title}</label>
                <br></br><span className='post-details'>{this.props.obj.details}</span>
                <span className='textcard-post-date'>{this.props.obj.dateCreated}</span>
              </div>
              <div className='card-post-actions' >
                <Button onClick={this.reactPost}><img src={this.state.heart} alt="heart" />{this.state.reactorlist.length}</Button>
                <Button><img src={eye} />{this.state.viewsCount}</Button>
                <Button onClick={this.fetchComments}><img src={comment} alt='comment' />{this.state.commentlist.length}</Button>
                <Button onClick={this.SendGift}><img src={gift} alt="gift" /></Button>
                <Button style={{display: 'none'}}><img src={share} /></Button>
              </div>
              <div className='comment-section' style={{display: `${this.state.showComments}`}}>
                    <input type="text" name="comment" className="txtcomment" value={this.state.comment} onChange={this.onChange} placeholder=">..." required />
                    <Button onClick={this.submitComment} className="btnSendComment"><img src={paperplane} /></Button>
                </div>
              <div className="comment-container" onClick={this.resetCommentState} style={{ display: `${this.state.showComments}` }}>
                <div className='comments-space' style={{ display: `${this.state.showComments}`, overflowY: `${this.state.commentScroll}` }}>
                  {this.renderComments()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GalleryItem;