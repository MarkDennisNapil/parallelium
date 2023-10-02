import axios from 'axios';
import React from 'react';
import api from '../api';
import Navigation from '../components/navigation/navigationbar';
import PaperItem from '../components/paper/item';
import EditTextPost from '../components/paper/edit';
import Header from '../components/headline/head';
import '../styles/page/Paper.css';

export default class Paper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user_id: '',
      items: [],
      postID: '',
      postType: ''
    }
  }
  handleEditPostCallback = (postid, posttype) => {
    this.setState({postID: postid, postType: posttype});
  }
  componentDidMount() {
    axios.get(`${api}collection/text`)
      .then(res => {
        this.setState({ items: res.data.data.reverse() });
      })
      .catch(err => {
        console.log(err);
      });
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    if (token === null || !token) {
      alert("Not log in");
      window.location.assign('/login');
    }
    else {
      this.setState({ token: token, user_id: user_id });
    }
  }
  cardData() {
    if (this.state.items !== null) {
      return this.state.items.map((res, i) => {
        return <PaperItem obj={res} key={i} EditPostCallback={this.handleEditPostCallback} />;
      });
    }
    else {
      return <h1>No post</h1>
    }
  }
  EditPostWindow(){
    if(this.state.postType === 'text'){
      return <EditTextPost postid={this.state.postID} postType={'text'} />;
    }
  }
  render() {
    return (
      <div className='t1-container'>
        <Navigation />
        <div className='edit-window'>{this.EditPostWindow()}</div>
        <div className='t1-left-aside'></div>
        <div className='t1-content' >
          <Header />
          {this.cardData()}
        </div>
        <div className='t1-right-aside'>
          <Header />
        </div>
      </div >
    )
  }
}
