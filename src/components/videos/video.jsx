/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import api from "../../api";
import resources from '../../resources';
import { Button, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../styles/videos/video.css';
import ellipsis from '../../assets/svgs/solid/ellipsis.svg';
import heart from '../../assets/svgs/solid/heart.svg'
import emptyheart from '../../assets/svgs/solid/emptyheart.svg'
import gift from '../../assets/svgs/solid/gift.svg'
import share from '../../assets/svgs/solid/share.svg'
import eye from '../../assets/svgs/solid/eye.svg'

export default class VideoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem('user_id'),
      owner: [],
      postid: this.props.obj._id,
      reactorlist: [],
      liked: false,
      heart: emptyheart,
      isPlaying: false,
      progress: 0,
      videoWidth: '',
      videoHeight: '',
      videoPosition: '',
      videoMarginTop: '',
      videoTop: '',
      zIndex: '',
      borderRadius: '',
      border: '',
      showOptionButton: '',
      postOption: 'none',
      datePosted: this.props.obj.dateModified.split(" "),
      viewed: false,
      viewsCount: '',
      actionbarBorder: '',
      actionbarBorderRadius: '',
      actionbarBackground: '',
      actionbarWidth: ''
    }
    this.reactPost = this.reactPost.bind(this);
    this.viewPost = this.viewPost.bind(this);
    this.viewProfile = this.viewProfile.bind(this);
  }
  componentDidMount() {
    axios.get(`${api}users/${this.props.obj.owner}`)
      .then((res) => {
        this.setState({ owner: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(`${api}video/${this.props.obj._id}`)
      .then((result) => {
        this.setState({ reactorlist: result.data.data.likes, viewsCount: result.data.data.views.length });
        for (let i = 0; i < result.data.data.likes.length; i++) {
          if (result.data.data.likes[i] === this.state.user_id) {
            this.setState({ liked: true, heart: heart });
            this.state.reactorlist.push(this.state.user_id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  reactPost = () => {
    if (this.state.liked === true) {
      this.setState({ heart: heart });
    }
    else {
      axios.put(`${api}video/${this.props.obj._id}/like/${this.state.user_id}`)
        .then(() => {
          this.setState({ heart: heart });
          this.state.reactorlist.push(this.state.user_id);
        })
        .catch(() => {
          console.log("Failed to react to post!");
        });
    }
  }
  updateVideo() {
    this.props.EditPostCallback(this.state.postid, 'video');
  }
  deleteVideo() {
    axios.delete(`${api}video/${this.props.obj._id}`)
      .then((result) => {
        alert(result.data.message);
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
    localStorage.setItem("view_profile", this.state.owner._id);
  }
  itemShow = () => {
    this.setState({ itemVisibility: 'none' });
  }
  openPostOption = () => {
    if (this.state.postOption === 'none' && this.props.obj.owner === this.state.user_id) {
      this.setState({ postOption: 'block' });
    }
    else {
      this.setState({ postOption: 'none' });
    }
  }
  VideoPlaying = () => {
    this.setState({
      videoWidth: '100%', 
      videoHeight: '100%', 
      videoPosition: 'absolute',
      videoTop: '0',
      zIndex: '3',
      borderRadius: '0', 
      border: '0',
      videoMarginTop: '55px',
      actionbarBorder: '1px solid rgba(0, 0, 0, 0.2)',
      actionbarBorderRadius: '22px',
      actionbarBackground: 'rgba(0, 0, 0, 0)',
      actionbarWidth: 'auto'});
    if(!this.state.viewed){
      axios.put(`${api}video/${this.props.obj._id}/view/${this.state.user_id}`)
      .then(() => {
        this.setState({viewed: true});
      })
      .catch(error => {
        console.log(error);
      });
    }
  }
  Minimize = () => {
    this.setState({videoWidth: '', 
    videoHeight: '', 
    borderRadius: '12px', 
    border: '',
    videoPosition: '',
    videoTop: '',
    zIndex: '',
    videoMarginTop: '',
    actionbarBorder: '',
    actionbarBorderRadius: '',
    actionbarBackground: '',
    actionbarWidth: ''});
  }
  SendGift = (e) => {
    e.preventDefault();
    const amount = 1;
    const description = `USER: ${this.state.user_id} sends gift to USER: ${this.props.obj.owner} post, VIDEO/POST_ID: ${this.props.obj._id}`;
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
    const videoRoomContainer = {
      display: `${this.state.itemVisibility}`,
      width: `${this.state.videoWidth}`,
      height: `${this.state.videoHeight}`,
      position: `${this.state.videoPosition}`,
      top: `${this.state.videoTop}`,
      zIndex: `${this.state.zIndex}`,
      borderRadius: `${this.state.borderRadius}`,
      border: `${this.state.border}`,
      marginTop: `${this.state.videoMarginTop}`
    }
    const videoFrame = {
      width: `${this.state.videoWidth}`, 
      height: `${this.state.videoHeight}`
    }
    const actionbar = {
      width: `${this.state.actionbarWidth}`,
      border: `${this.state.actionbarBorder}`,
      borderRadius: `${this.state.actionbarBorderRadius}`,
      background: `${this.state.actionbarBackground}`,
      backdropFilter: 'blur(5px)'
    }
    return (
      <div className="video-room-container" style={videoRoomContainer}>
        <div className="video-item-container">
          <div className="video-item-blur">
            <div className="video-post-file">
              <video controls onPlay={this.VideoPlaying} onPause={this.Minimize} style={videoFrame} poster={`${resources}${this.props.obj.thumbnail}`}>
                <source src={`${resources}${this.props.obj.file}`} type="video/mp4" />
              </video>
              <Button onClick={this.togglePlay} className="btn-minimize-video">{this.state.isPlaying ? "Pause" : "Play"}</Button>
              <ProgressBar value={this.state.progress} max="100" />
            </div>
            <div className='video-post-owner' onClick={this.viewProfile}>
              <Link to='/view/profile' onClick={this.viewProfile}>
                <img src={`${resources}${this.state.owner.photo}`} className="owner-photo" />
                <label>{this.state.owner.first_name + " " + this.state.owner.last_name}</label>
                <span>{this.state.datePosted[0] + " " + this.state.datePosted[1] + " " + this.state.datePosted[2] + " " + this.state.datePosted[3]}</span>
              </Link>
              <Button className="btn-show-option" onClick={this.openPostOption}><img src={ellipsis} alt="☰"/></Button>
              <div className="post-item-option" style={{ display: `${this.state.postOption}` }} onMouseLeave={this.openPostOption}>
                <Button className='btn-hide' style={{ display: `${this.state.showOptionButton}` }}>Hide</Button>
                <Button className='btn-edit' onClick={this.updateVideo} style={{ display: `${this.state.showOptionButton}` }}>Edit</Button>
                <Button className='btn-delete' onClick={this.deleteVideo} style={{ display: `${this.state.showOptionButton}` }}>Delete</Button>
              </div>
            </div>
            <div className='video-card-caption' style={{height: `${this.state.videoHeight}`}}>
              <label>{this.props.obj.title}</label>
              <p>{this.props.obj.description}</p>
            </div>
            <div className='videocard-post-actions'>
              <div className="actionButtonContainer" style={actionbar}>
                <Button onClick={this.reactPost}><img src={this.state.heart} alt="heart" />{this.state.reactorlist.length}</Button>
                <Button><img src={eye} />{this.state.viewsCount}</Button>
                <Button onClick={this.SendGift}><img src={gift} /></Button>
                <Button style={{display: 'none'}}><img src={share} alt="share" /></Button>
              </div>
              </div>
          </div>
        </div>
      </div>
    )
  }
}