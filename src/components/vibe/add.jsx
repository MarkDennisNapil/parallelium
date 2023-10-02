import React from 'react';
import axios from 'axios';
import api from '../../api';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../../styles/vibe/add.css';
import upload from '../../assets/svgs/solid/upload.svg';
import Navigation from '../navigation/navigationbar';
import PostTypeBar from '../navigation/PostMenu';

export default class AddVibeMusic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      publisher: localStorage.getItem('user_id'),
      title: '',
      file: '',
      lyrics: '',
      cover_photo: '',
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
    this.setState({ cover_photo: e.target.files[0] });
  }
  handleAddPost = (e) => {
    e.preventDefault();
    this.setState({uploadStatus: 'Uploading post... Please wait...'});
    const formdata = new FormData();
    formdata.append('publisher', this.state.publisher);
    formdata.append('title', this.state.title);
    formdata.append('image', this.state.cover_photo);
    formdata.append('audio', this.state.file);
    formdata.append('lyrics', this.state.lyrics);
    for (const key of Object.keys(this.state.tags)) {
      formdata.append('tags', this.state.tags[key])
    }
    axios.post(`${api}vibe`, formdata, {})
      .then((result) => {
        this.setState({uploadStatus: result.data.message});
        window.location.assign('/profile');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className='va1-container'>
        <Navigation />
        <div className='va1-content'>
        <PostTypeBar />
          <div className='va1-add-post-form'>
              <Button className='va1-btn-addpost' onClick={(e) => this.handleAddPost(e)} ><img src={upload} /></Button>
              <span>{this.state.uploadStatus}</span>
              <label>Attach Audio:</label>
              <input type='file' accept='audio/mpeg' name='audio' className='va1-inputfile' onChange={this.onFileChange} required />
              <label>Attach Cover Photo:</label>
              <input type='file' accept='image/png, image/gif, image/jpeg' name='cover_photo' className='va1-inputfile' onChange={this.onImageChange} required />
              <input type='text' id='title' name='title' className='va1-txttitle' value={this.state.title} onChange={this.onChange} placeholder='Title...' />
              <input type='text' name='tags' className='va1-txttitle' value={this.state.tags} onChange={this.onChange} placeholder='Add tags...' />
              <textarea name='lyrics' className='va1-txtdetails' value={this.state.lyrics} onChange={this.onChange} placeholder='>...' />
              <Link to='/profile'><Button className='va1-btn-cancel'>Cancel</Button></Link>
          </div>
        </div>
      </div>
    )
  }
}

