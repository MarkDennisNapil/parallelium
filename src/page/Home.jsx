import axios from 'axios';
import React from 'react';
import api from '../api';
import Navigation from '../components/navigation/navigationbar';
import GalleryItem from '../components/gallerylane/item';
import Paper from './Paper';
import LoadingScreen from '../components/effects/LoadingScreen';
import EditPost from '../components/gallerylane/edit';
import HomeStatus from '../components/headline/status';
import Header from '../components/headline/head';
import '../styles/page/Home.css';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user_id: '',
      items: [],
      showRightSide: 'none',
      Loading: true,
      postID: '',
      postType: '',
      editVisibility: 'none'
    }
  }
  handleEditPostCallback = (postid, posttype, visibility) => {
    this.setState({postID: postid, postType: posttype, editVisibility: visibility});
  }
  componentDidMount() {
    axios.get(`${api}collection/post`)
      .then(res => {
        this.setState({ items: res.data.data.reverse(), Loading: false });
      })
      .catch(err => {
        console.log(err.message);
        this.setState({ Loading: false });
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
  cardData() {
    if (this.state.items !== null) {
      return this.state.items.map((res, i) => {
        return <GalleryItem obj={res} key={i} EditPostCallback={this.handleEditPostCallback} />;
      });
    }
    else {
      return <h1>No post</h1>
    }
  }
  setLoadingScreen() {
    if (this.state.Loading === true) {
      return <LoadingScreen />;
    }
  }
  TextPostData() {
    return <Paper />;
  }
  showRightSideBar = () => {
    this.setState({ showRightSide: 'block' });
  }
  EditPost(){
    if(this.state.postType === 'post'){
      return <EditPost postid={this.state.postID} postType={'post'} />;
    }
  }
  render() {
    return (
      <div className='container'>
        {this.setLoadingScreen()}
        <div className='edit-window'>{this.EditPost()}</div>
        <Navigation />
        <div className='content' >
          <Header/>
          <HomeStatus />
          {this.cardData()}
        </div>
        <div className='right-sidebar'>
          {this.TextPostData()}
        </div>
      </div >
    );
  }
}
