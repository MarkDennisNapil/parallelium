/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import api from "../../api";
import resources from '../../resources';
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import heart from '../../assets/svgs/solid/heart.svg'
import emptyheart from '../../assets/svgs/solid/emptyheart.svg'
import headphones from '../../assets/svgs/solid/headphones-simple.svg';
import share from '../../assets/svgs/solid/share.svg';
import download from '../../assets/svgs/solid/download.svg';
import gift from '../../assets/svgs/solid/gift.svg'
import ellipsis from '../../assets/svgs/solid/ellipsis.svg';
import circleplay from '../../assets/svgs/solid/circle-play.svg';
import circlepause from '../../assets/svgs/solid/circle-pause.svg'
import backwardstep from '../../assets/svgs/solid/backward-step.svg';
import forwardstep from '../../assets/svgs/solid/forward-step.svg';
import '../../styles/vibe/item.css';

class MusicItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem('user_id'),
      postid: this.props.obj._id,
      owner: [],
      reactorlist: [],
      liked: false,
      likebg: '',
      playpauseicon: circleplay,
      postOption: 'none',
      wavevisibility: 'none',
      itemVisibility: '',
      showOptionButton: '',
      progress: 0,
      duration: 0,
      listeners: '',
      played: false,
      heart: emptyheart,
      musicCoverAni: ''
    }
    this.reactPost = this.reactPost.bind(this);
    this.viewPost = this.viewPost.bind(this);
    this.viewProfile = this.viewProfile.bind(this);
    this.editPost = this.editPost.bind(this);
    this.AudioProgress = this.AudioProgress.bind(this);
  }
  AudioProgress = () => { 
    const myMusic = document.getElementById(`${this.props.obj._id}`)
    this.setState({progress: myMusic.currentTime(), duration: myMusic.duration()});
  }
  componentDidMount() {
    axios.get(`${api}users/${this.props.obj.publisher}`)
      .then((res) => {
        this.setState({ owner: res.data.data });
        if (this.props.obj.owner === this.state.user_id) {
          this.setState({ showOptionButton: 'block' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.fetchLikes()
  }
  fetchLikes(){
    axios.get(`${api}vibe/${this.props.obj._id}`)
      .then((result) => {
        this.setState({ reactorlist: result.data.data.likes, listeners: result.data.data.views.length });
        for (let i = 0; i < result.data.data.likes.length; i++) {
          if (result.data.data.likes[i] === this.state.user_id) {
            this.setState({ liked: true, heart: heart });
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
      axios.put(`${api}vibe/${this.props.obj._id}/like/${this.state.user_id}`)
        .then(() => {
          this.setState({ heart: heart });
          this.fetchLikes()
        })
        .catch(() => {
          console.log("Failed to react to post!");
        });
    }
  }
  editPost = () => {
    this.props.EditPostCallback(this.state.postid, 'vibe');
  }
  deletePost() {
    axios.delete(`${api}vibe/${this.props.obj._id}`)
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
    localStorage.setItem("view_profile", this.state.owner._id);
  }
  setVolume = () => {}
  itemShow = () => {
    this.setState({ itemVisibility: 'none' });
  }
  openPostOption = () => {
    if (this.state.postOption === 'none' && this.props.obj.publisher === this.state.user_id) {
      this.setState({ postOption: 'block' });
    }
    else {
      this.setState({ postOption: 'none' });
    }
  }
  closePostOption = () => {
    this.setState({ postOption: 'none' });
  }
  PlayPause = () => {
    const thisMusic = document.getElementById(`${this.props.obj._id}`);
    if(thisMusic.paused){
      thisMusic.play();
      this.setState({playpauseicon: circlepause});
    } else {
      thisMusic.pause();
      this.setState({playpauseicon: circleplay});
    }
  }
  onAudioPlay = () => {
    this.setState({wavevisibility: 'flex', musicCoverAni: 'spinnerAlbum 8s linear infinite'});
    if(!this.state.played){
      axios.put(`${api}vibe/${this.props.obj._id}/view/${this.state.user_id}`)
      .then(() => {
        this.setState({played: true});
      })
      .catch(error => {
        console.log(error);
      });
    }
  }
  SendGift = (e) => {
    e.preventDefault();
    const amount = 1;
    const description = `USER: ${this.state.user_id} sends gift to USER: ${this.props.obj.publisher} post, VIBE/POST_ID: ${this.props.obj._id}`;
    const formdata = new FormData();
    formdata.append('sender', this.state.user_id);
    formdata.append('receiver', this.props.obj.publisher);
    formdata.append('amount', amount);
    formdata.append('description', description);
    axios.put(`${api}users/coins/use`, formdata, {})
    .then(() => alert("Gift sent"))
    .catch(error => console.log(error.message))
  }
  render() {
    return (
      <div className="music-room-container" style={{ display: `${this.state.itemVisibility}` }}>
        <div className="music-item-container" style={{ backgroundImage: `url("${api}resources/${this.props.obj.cover_photo}")` }} >
          <div className="music-item-blur">
            <div className="m1-div-left">
            <div className='music-post-owner' onClick={this.viewProfile}>
              <Link to='/view/profile' onClick={this.viewProfile}>
                <img src={`${resources}${this.state.owner.photo}`} loading="lazy" className="photo" />
                <span>{this.state.owner.first_name + " " + this.state.owner.last_name}</span>
              </Link>
              <Button className="btn-show-option" onClick={this.openPostOption}><img src={ellipsis}/></Button>
              <div className="music-item-option" style={{ display: `${this.state.postOption}` }} onMouseLeave={this.closePostOption}>
                <Button className='btn-hide' onClick={this.itemShow} style={{ display: `${this.state.showOptionButton}` }}>Hide</Button>
                <Button className='btn-edit' onClick={this.editPost} style={{ display: `${this.state.showOptionButton}` }}>Edit</Button>
                <Button className='btn-delete' onClick={this.deletePost} style={{ display: `${this.state.showOptionButton}` }}>Delete</Button>
              </div>
            </div>
            <div className="music-post-file">
              <h1>{this.props.obj.title}</h1>
              <img src={`${resources}${this.props.obj.cover_photo}`} style={{animation: `${this.state.musicCoverAni}`}} loading="lazy" alt="Failed to load image!" />
              <audio id={`${this.props.obj._id}`} onPlay={this.onAudioPlay} onPause={() => this.setState({wavevisibility: 'none', musicCoverAni: ''})} onChange={this.AudioProgress}>
                <source src={`${resources}${this.props.obj.file}`} type="audio/mpeg" />
              </audio>
            </div>
            <div className="music-soundwave" style={{display: `${this.state.wavevisibility}`}}>
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
            </div>
            </div>
            <div className="m1-div-right">
            <div className="music-lyrics-prompt">
              <p>{this.props.obj.lyrics}</p>
            </div>
            <div className="music-time-control">
              <div className="current-time">{this.state.progress}</div>
                <input type="range" min="0" max="100" className="audio-slider" value={this.state.progress} onChange={this.AudioProgress} />
              <div className="duration">00:00</div>
            </div>
            <div className="music-volume-control">
              <i className="fa fa-volume-down">-</i>
                <input type="range" min="0" max="100" className="volume-slider" onChange={this.setVolume} />
              <i className="fa fa-volume-up">+</i>
            </div>
            <div className="music-button-control">
                <Button style={{visibility: 'hidden'}}><img src={backwardstep} /></Button>
                <Button className="btnPlayPause" onClick={this.PlayPause}><img src={this.state.playpauseicon} /></Button>
                <Button style={{visibility: 'hidden'}}><img src={forwardstep} /></Button>
            </div>
            <div className='music-post-actions' >
                <Button onClick={this.reactPost}><img src={this.state.heart} alt="heart" />{this.state.reactorlist.length}</Button>
                <Button><img src={headphones} />{this.state.listeners}</Button>
                <Button onClick={this.SendGift}><img src={gift} /></Button>
                <Button><img src={download} /></Button>
                <Button style={{display: 'none'}}><img src={share} alt="share" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MusicItem;