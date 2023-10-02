/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import api from '../../api';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Navigation from '../navigation/navigationbar';
import GalleryItem from '../gallerylane/item';
import PaperItem from '../paper/item';
import MusicItem from '../vibe/item';
import VideoItem from '../videos/video';
import ChatDialog from '../chat/ChatComponents/ChatDialog';
import envelope from '../../assets/svgs/solid/envelope.svg';
import phone from '../../assets/svgs/solid/phone.svg';
import plus from '../../assets/svgs/solid/plus.svg';
import scroll from '../../assets/svgs/solid/scroll.svg';
import music from '../../assets/svgs/solid/music.svg'
import clapperboard from '../../assets/svgs/solid/clapperboard.svg'
import poweroff from '../../assets/svgs/solid/power-off.svg';
import usergear from '../../assets/svgs/solid/user-gear.svg';
import '../../styles/profile/user.css';

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mydata: [],
      mypost: [],
      history_type: 'post',
      followersnum: 0,
      followingnum: 0
    }
  }
  componentDidMount() {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    if (token === 'null' || !token) {
      alert("Not log in!");
      window.location.assign('/login');
    }
    else {
      this.setState({ token: token, user_id: user_id });
    }
    axios.get(`${api}users/${this.props.user_id}`)
      .then(result => {
        this.setState({ mydata: result.data.data, followersnum: result.data.data.followers.length, followingnum: result.data.data.following.length });
        if(result.data.data.followers.length === ''){
          this.setState({followersNum: 0});
        }
      })
      .catch(err => {
        console.log(err);
      });
      this.PostHistory()
  }
  postData() {
    if(this.state.history_type === 'post'){
      if (this.state.mypost !== null) {
        return this.state.mypost.map((res, i) => {
        return <GalleryItem obj={res} key={i} />;
        });
      }
      else {
        return <h1>No post</h1>
      }
    }
    else if(this.state.history_type === 'text'){
      if (this.state.mypost !== null) {
        return this.state.mypost.map((res, i) => {
        return <PaperItem obj={res} key={i} />;
        });
      }
      else {
        return <h1>No post</h1>
      }
    }
    else if(this.state.history_type === 'vibe'){
      if (this.state.mypost !== null) {
        return this.state.mypost.map((res, i) => {
        return <MusicItem obj={res} key={i} />;
        });
      }
      else {
        return <h1>No post</h1>
      }
    }
    else if(this.state.history_type === 'video'){
      if (this.state.mypost !== null) {
        return this.state.mypost.map((res, i) => {
        return <VideoItem obj={res} key={i} />;
        });
      }
      else {
        return <h1>No post</h1>
      }
    }
    else{
      alert("Error");
    }
  }
  PostHistory = () => {
    axios.get(`${api}post/user/${this.props.user_id}`)
      .then(res => {
        this.setState({ history_type: 'post', mypost: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  TextPostHistory = () => {
    axios.get(`${api}text/user/${this.props.user_id}`)
    .then(res => {
      this.setState({ history_type: 'text', mypost: res.data });
    })
    .catch(err => {
      console.log(err);
    });
  }
  VibePostHistory = () => {
    axios.get(`${api}vibe/user/${this.props.user_id}`)
    .then(res => {
      this.setState({ history_type: 'vibe', mypost: res.data });
    })
    .catch(err => {
      console.log(err);
    });
  }
  VideoPostHistory = () => {
    axios.get(`${api}video/user/${this.props.user_id}`)
    .then(res => {
      this.setState({ history_type: 'video', mypost: res.data });
    })
    .catch(err => {
      console.log(err);
    });
  }
  logOut = () => {
    localStorage.setItem('token', null);
    localStorage.setItem('user_id', null);
  }
  toMessage = () => {
    alert("Chat Dialog");
    return <ChatDialog tomsg_userid={this.state.mydata._id} />;
  }
  EditUser = () => {
    window.location.assign('/user/info/update');
  }
  render() {
    return (
      <div className='pu1-container' >
        <Navigation />
        <div className='pu1-content'>
          <div className='pu1-profile'>
            <div className='pu1-user-details'>
            <div className='pu1-profile-pic'><img src={`${api}resources/${this.state.mydata.photo}`} alt='Failed to load image!' /></div>
            <div className='pu1-username-box'>{this.state.mydata.first_name + " " + this.state.mydata.last_name}</div>
            <div className='pu1-profession-box'>{this.state.mydata.profession}</div>
            <div className='pu1-contact-box'>
              <div className='pu1-phone-box'><img src={phone} /> +{this.state.mydata.phone}</div>
              <div className='pu1-email-box'><img src={envelope} /> {this.state.mydata.email}</div>
            </div>
            <div className='pu1-followers-box'>
              <label>{this.state.followersnum + " followers"}</label><br></br>
              <label>{this.state.followingnum + " following"}</label>
            </div>
            </div>
            <div className='pu1-history'>
              <div className='pu1-profile-menu'>
                <Link to='/post/add'><Button  className='pu1-pm-plus'><img src={plus} /><span>New Post</span></Button></Link>
                <Button className='pu1-pm-idcard' onClick={this.EditUser}><img src={usergear} /><span>Edit Personal Info</span></Button>
                <Button className='pu1-pm-scroll' onClick={this.TextPostHistory}><img src={scroll} /><span>My Text Post</span></Button>
                <Button className='pu1-pm-music' onClick={this.VibePostHistory}><img src={music} /><span>My Music</span></Button>
                <Button className='pu1-pm-video' onClick={this.VideoPostHistory}><img src={clapperboard} /><span>My Videos</span></Button>
                <Link onClick={this.logOut} to={'/login'}><Button className='pu1-pm-poweroff'><img src={poweroff} /><span>Logout</span></Button></Link>
              </div>
              {this.postData()}
            </div>
            </div>
        </div>
      </div>
    );
  }
}
