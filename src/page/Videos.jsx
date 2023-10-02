import React from "react";
import axios from "axios";
import api from "../api";
import VideoItem from "../components/videos/video";
import Navigation from "../components/navigation/navigationbar";
import UpdateVideo from "../components/videos/edit";
import '../styles/page/Videos.css';

export default class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      postID: '',
      posType: ''
    }
  }
  handleEditPostCallback = (postid, posttype) => {
    this.setState({postID: postid, postType: posttype});
  }
  componentDidMount() {
    axios.get(`${api}collection/video`)
      .then(res => {
        this.setState({ videos: res.data.data.reverse() });
      })
      .catch(error => {
        console.log(error);
      });
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    if (token === 'null' || !token) {
      alert("Not log in!");
      window.location.assign('/login');
    }
    else {
      this.setState({ token: token, user_id: user_id });
    }
  }
  VideoItem() {
    return this.state.videos.map((res, i) => {
      return <VideoItem obj={res} key={i} EditPostCallback={this.handleEditPostCallback} />
    })
  }
  UpdateVideo(){
    if(this.state.postType === 'video'){
      return <UpdateVideo postid={this.state.postID} postType={this.state.postType} />;
    }
  }
  render() {
    return (
      <div className="videopage-container">
        <div className="edit-window">{this.UpdateVideo()}</div>
        <Navigation />
        <div className="videopage-content">
          {this.VideoItem()}
        </div>
      </div>
    )
  }
}

