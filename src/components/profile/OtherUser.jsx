/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import api from '../../api';
import resources from '../../resources';
import Navigation from '../navigation/navigationbar';
import GalleryItem from '../gallerylane/item';
import PaperItem from '../paper/item';
import MusicItem from '../vibe/item';
import VideoItem from '../videos/video';
import ChatDialog from '../chat/ChatComponents/ChatDialog';
import envelope from '../../assets/svgs/solid/envelope.svg';
import phone from '../../assets/svgs/solid/phone.svg';
import '../../styles/profile/user.css';

export default class ViewOtherProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: localStorage.getItem('view_profile'),
      user: [],
      user_posts: [],
      followersnum: 0,
      followingnum: 0,
      followerstext: 'followers',
      history_visible: '',
      pagetype: 'post',
      isFollow: 'follow'
    }
  }
  componentDidMount() {
    axios.get(`${api}users/${this.state.uid}`)
      .then(result => {
        this.setState({ user: result.data.data, followersnum: result.data.data.followers.length, followingnum: result.data.data.following.length});
        if (this.state.user._id === this.props.user_id) {
          this.setState({ msgdialog: 'none' });
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.fetchUsersPost()
      if(this.state.followersnum < 2){
        this.setState({followerstext: 'follower'});
      }
  }
  cardData() {
    if (this.state.pagetype === 'post' && this.state.user_posts !== null) {
      return this.state.user_posts.map((res, i) => {
        return <GalleryItem obj={res} key={i} />
      });
    }
    else if (this.state.pagetype === 'text' && this.state.user_posts !== null) {
      return this.state.user_posts.map((res, i) => {
        return <PaperItem obj={res} key={i} />
      });
    }
    else if (this.state.pagetype === 'vibe' && this.state.user_posts !== null) {
      return this.state.user_posts.map((res, i) => {
        return <MusicItem obj={res} key={i} />
      });
    }
    else if (this.state.pagetype === 'video' && this.state.user_posts !== null) {
      return this.state.user_posts.map((res, i) => {
        return <VideoItem obj={res} key={i} />
      });
    }
    else {
      this.setState({ history_visible: 'none' });
      return <h1>No post</h1>;
    }
  }
  fetchUsersPost = () => {
    axios.get(`${api}post/user/${this.state.uid}`)
      .then(res => {
        this.setState({ pagetype: 'post', user_posts: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  fetchUsersPaperPost = () => {
    axios.get(`${api}text/user/${this.state.uid}`)
    .then(res => {
      this.setState({ pagetype: 'text', user_posts: res.data });
    })
    .catch(err => {
      console.log(err);
    });
  }
  fetchUsersMusicPost = () => {
    axios.get(`${api}vibe/user/${this.state.uid}`)
    .then(res => {
      this.setState({ pagetype: 'vibe', user_posts: res.data });
    })
    .catch(err => {
      console.log(err);
    });
  }
  fetchUsersVideoPost = () => {
    axios.get(`${api}video/user/${this.state.uid}`)
    .then(res => {
      this.setState({ pagetype: 'video', user_posts: res.data });
    })
    .catch(err => {
      console.log(err);
    });
  }
  logOut = () => {
    localStorage.setItem('token', null);
    localStorage.setItem('user_id', null);
  }
  Follow = (e) => {
    e.preventDefault();
    axios.put(`${api}user/${this.state.uid}/follow/${this.props.user_id}`)
    .then(() => {
      this.setState({isFollow: 'followed'});
    })
    .catch(error => {
      console.log(error);
    });
  }
  toMessage = () => {
    return <ChatDialog tomsg_userid={this.state.uid} />
  }
  render() {
    return (
      <div className='pu1-container' >
        <Navigation />
        <div className='pu1-content'>
          <div className='pu1-profile'>
          <div className='pu1-user-details'>
            <div className='pu1-profile-pic'><img src={`${resources}${this.state.user.photo}`} loading="lazy" alt='Failed to load image!' /></div>
            <div className='pu1-username-box'>{this.state.user.first_name + " " + this.state.user.last_name}</div>
            <div className='pu1-profession-box'>{this.state.user.profession + " "}</div>
            <div className='pu1-contact-box'>
              <div className='pu1-phone-box'><img src={phone} /> +{this.state.user.phone}</div>
              <div className='pu1-email-box'><img src={envelope} /> {this.state.user.email}</div>
            </div>
            <div className='pu1-followers-box'>
              <label>{this.state.followersnum + " followers"}</label><br></br>
              <label>{this.state.followingnum + " following"}</label>
            </div>
            <div className='pu1-user-action-box'>
              <button className='pu1-follow-btn' onClick={this.Follow}>{this.state.isFollow}</button>
              <button className='pu1-message-btn' onClick={this.toMessage}>Message</button>
            </div>
            <div className='pu1-chat-dialog'>{this.toMessage()}</div>
            <button onClick={this.fetchUsersPost}>Post</button>
            <button onClick={this.fetchUsersPaperPost}>Paper</button>
            <button onClick={this.fetchUsersMusicPost}>Vibe</button>
            <button onClick={this.fetchUsersVideoPost}>Videos</button>
            </div>
            <div className='pu1-history' style={{ display: `${this.state.history_visible}` }}>
              {this.cardData()}
            </div>
            </div>
        </div>
      </div>
    );
  }
}

