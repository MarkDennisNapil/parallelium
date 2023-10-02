/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import api from '../../api';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import upload from '../../assets/svgs/solid/upload.svg';
import Navigation from '../navigation/navigationbar';
import PostTypeBar from '../navigation/PostMenu';
import '../../styles/gallerylane/add.css';

class AddPost extends React.Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.handleAddPost = this.handleAddPost.bind(this);
    this.state = {
      owner: '',
      title: '',
      tags: '',
      details: '',
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
    this.setState({uploadStatus: 'Uploading post... Please wait a few miunutes...'});
    const formdata = new FormData();
    formdata.append('owner', this.props.user_id);
    formdata.append('title', this.state.title);
    formdata.append('tags', this.state.tags);
    formdata.append('details', this.state.details);
    for (const key of Object.keys(this.state.files)) {
      formdata.append('file', this.state.files[key])
    }
    axios.post(`${api}post`, formdata, {})
      .then((result) => {
        this.setState({uploadStatus: result.data.message});
        window.location.assign('/profile');
      })
      .catch((err) => {
        console.log(err);
        this.setState({uploadStatus: 'Upload failed!'});
      });
  }
  render() {
    return (
      <div className='pa1-container'>
        <Navigation />
        <div className='pa1-content'>
          <PostTypeBar />
          <div className='pa1-add-post-form'>
              <Button className='pa1-btn-addpost' onClick={(e) => this.handleAddPost(e)} ><img src={upload} /></Button>
              <span>{this.state.uploadStatus}</span>
              <label>Select Images:</label>
              <input type='file' accept='image/png, image/gif, image/jpeg' name='files' className='pa1-inputfile' onChange={this.onFileChange} multiple required />
              <input type='text' name='title' className='pa1-txttitle' value={this.state.title} onChange={this.onChange} placeholder='Title...' />
              <input type='text' name='tags' className='pa1-txttitle' value={this.state.tags} onChange={this.onChange} placeholder='Add tags...' />
              <textarea id='details' name='details' className='pa1-txtdetails' value={this.state.details} onChange={this.onChange} placeholder='>...' />
              <Link to='/profile'><Button className='pa1-btn-cancel'>Cancel</Button></Link>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPost;