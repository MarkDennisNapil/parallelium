/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import api from '../../api';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import upload from '../../assets/svgs/solid/upload.svg';
import Navigation from '../navigation/navigationbar';
import PostTypeBar from '../navigation/PostMenu';
import '../../styles/paper/add.css';

class AddTextPost extends React.Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.handleAddPost = this.handleAddPost.bind(this);
    this.state = {
      writers: '',
      header: '',
      title: '',
      content: '',
      tags: [],
      files: [],
      uploadStatus: ''
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.handleAddPost = this.handleAddPost.bind(this);
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onFileChange(e) {
    this.setState({ files: e.target.files });
  }
  handleAddPost = (e) => {
    e.preventDefault();
    this.setState({uploadStatus: 'Sending paperplane into the cloud... Please wait...'})
    const formdata = new FormData();
    formdata.append('writers', this.props.user_id);
    formdata.append('header', this.state.header);
    formdata.append('title', this.state.title);
    formdata.append('content', this.state.content);
    formdata.append('tags', this.state.tags);
    for (const key of Object.keys(this.state.files)) {
      formdata.append('file', this.state.files[key])
    }
    axios.post(`${api}text`, formdata, {})
      .then((result) => {
        alert(result.data.message);
        this.setState({uploadStatus: result.data.message + '.'});
        window.location.assign('/profile');
      })
      .catch((err) => {
        this.setState({uploadStatus: err.stack});
        console.log(err);
      });
  }
  render() {
    return (
      <div className='ta1-container'>
        <Navigation />
        <div className='ta1-content'>
        <PostTypeBar />
          <div className='ta1-add-post-form'>
            <form onSubmit={this.handleAddPost}>
              <Button className='pa1-btn-addpost' onClick={(e) => this.handleAddPost(e)} value='Upload' ><img src={upload} /></Button>
              <span>{this.state.uploadStatus}</span>
              <label>Select Cover Photo (optional):</label>
              <input type='file' id='image' accept='image/png, image/gif, image/jpeg' name='files' className='ta1-inputfile' onChange={this.onFileChange} multiple />
              <input type='text' name='header' className='ta1-txttitle' value={this.state.header} onChange={this.onChange} placeholder='Header...' />
              <input type='text' id='title' name='title' className='ta1-txttitle' value={this.state.title} onChange={this.onChange} placeholder='Title...' />
              <input type='text' name='tags' className='ta1-txttitle' value={this.state.tags} onChange={this.onChange} placeholder='Add tags...' />
              <textarea id='content' name='content' className='ta1-txtdetails' value={this.state.content} onChange={this.onChange} placeholder='>...' />
              <Link to='/profile'><Button className='ta1-btn-cancel'>Cancel</Button></Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddTextPost;