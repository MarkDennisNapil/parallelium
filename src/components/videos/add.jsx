/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import api from '../../api';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../../styles/videos/add.css';
import upload from '../../assets/svgs/solid/upload.svg';
import Navigation from '../navigation/navigationbar';
import PostTypeBar from '../navigation/PostMenu';

export default class PostVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: '',
      title: '',
      file: '',
      thumbnail: '',
      description: '',
      tags: [],
      uploadStatus: ''
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.handleAddPost = this.handleAddPost.bind(this);
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }
  onImageChange(e) {
    this.setState({ thumbnail: e.target.files[0] });
  }
  handleAddPost = (e) => {
    e.preventDefault();
    this.setState({uploadStatus: 'Video is uploading... Please wait a few minutes...'});
    const formdata = new FormData();
    formdata.append('owner', this.props.user_id);
    formdata.append('title', this.state.title);
    formdata.append('image', this.state.thumbnail);
    formdata.append('file', this.state.file);
    formdata.append('description', this.state.description);
    for (const key of Object.keys(this.state.tags)) {
      formdata.append('tags', this.state.tags[key])
    }
    axios.post(`${api}video`, formdata, {})
      .then((result) => {
        this.setState({uploadStatus: result.data.message});
        window.location.assign('/profile');
      })
      .catch((err) => {
        console.log(err);
        this.setState({uploadStatus: 'Upload error! Please check your internet connection.'});
      });
  }
  render() {
    return (
      <div className='vda1-container'>
        <Navigation />
        <div className='vda1-content'>
        <PostTypeBar />
          <div className='va1-add-post-form'>
            <form>
              <Button className='vda1-btn-addpost' onClick={(e) => this.handleAddPost(e)} ><img src={upload} /></Button>
              <span>{this.state.uploadStatus}</span>
              <label>Attach Video:</label>
              <input type='file' accept='video/mp4' name='file' className='vda1-inputfile' onChange={this.onFileChange} />
              <label>Attach Thumbnail (optional):</label>
              <input type='file' accept='image/png, image/gif, image/jpeg' name='image' className='vda1-inputfile' onChange={this.onImageChange} />
              <input type='text' id='title' name='title' className='vda1-txttitle' value={this.state.title} onChange={this.onChange} placeholder='Title...' />
              <input type='text' name='tags' className='vda1-txttitle' value={this.state.tags} onChange={this.onChange} placeholder='Add tags...' />
              <textarea name='description' className='vda1-txtdetails' value={this.state.description} onChange={this.onChange} placeholder='>...' />
              <Link to='/profile'><Button className='vda1-btn-cancel'>Cancel</Button></Link>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

