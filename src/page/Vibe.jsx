import React from "react";
import axios from "axios";
import api from "../api";
import MusicItem from "../components/vibe/item";
import Navigation from "../components/navigation/navigationbar";
import EditMusicPost from "../components/vibe/edit";
import Header from "../components/headline/head";
import '../styles/page/Vibe.css';

export default class Vibe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      music: [],
      postID: '',
      postType: ''
    }
  }
  handleEditPostCallback = (postid, posttype) => {
    this.setState({postID: postid, postType: posttype});
  }
  componentDidMount() {
    axios.get(`${api}collection/vibe`)
      .then(res => {
        this.setState({ music: res.data.data.reverse() });
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
  MusicCard() {
    return this.state.music.map((res, i) => {
      return <MusicItem obj={res} key={i} EditPostCallback={this.handleEditPostCallback} />
    })
  }
  UpdateMusic(){
    if(this.state.postType === 'vibe'){
    return <EditMusicPost postid={this.state.postID} postType={this.state.postType} />;
    }
  }
  render() {
    return (
      <div className="vibepage-container">
        <div className="edit-window">{this.UpdateMusic()}</div>
        <Navigation />
        <div className="vibepage-content">
          {this.MusicCard()}
        </div>
        <div className="vibepage-aside">
          <Header />
          <Header />
        </div>
      </div>
    )
  }
}
