/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import api from "../../api";
import { Button } from "react-bootstrap";
import btnprev from '../../assets/svgs/solid/circle-left.svg';
import btnnext from '../../assets/svgs/solid/circle-right.svg';
import '../../styles/gallerylane/edit.css';

class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      title: '',
      details: '',
      tags: '',
      files: [],
      fileIndex: 0,
      updateStatus: 'Save'
    }
    this.onChange = this.onChange.bind(this);
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  componentDidMount() {
    axios.get(`${api}${this.props.postType}/${this.props.postid}`)
      .then(res => {
        this.setState({ 
          data: res.data.data,
          title: res.data.data.title,
          details: res.data.data.details,
          tags: res.data.data.tags,
          files: res.data.data.files
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
    IncrementIndex = () => {
      const {files, fileIndex} = this.state;
      if(fileIndex < files.length - 1){
        this.setState({fileIndex: fileIndex + 1});
      }
    }
    DecrementIndex = () => {
      const {fileIndex} = this.state;
      if(fileIndex > 0){
        this.setState({fileIndex: fileIndex - 1});
      }
    }
  onUpdatePost = (e) => {
    e.preventDefault();
    this.setState({updateStatus: 'Saving...'});
    const formdata = new FormData();
    console.log(JSON.stringify(formdata));
    formdata.append('title', this.state.title);
    formdata.append('details', this.state.details);
    formdata.append('tags', this.state.tags);
    axios.put(`${api}${this.props.postType}/${this.props.postid}`, formdata, {})
      .then(res => {
        this.setState({updateStatus: res.data.message});
      })
      .catch(err => {
        console.log(err);
        this.setState({updateStatus: 'Update failed!'});
      });
  }
  render() {
    return (
      <div className="edit-post-form">
        <img src={`${api}resources/${this.state.files[this.state.fileIndex]}`} loading="lazy" alt="failed!" />
        <div className="imageslider">
        <Button className="btnImageDec" onClick={this.DecrementIndex}><img src={btnprev} /></Button>
        <Button className="btnImageInc" onClick={this.IncrementIndex}><img src={btnnext} /></Button>
        </div>
        <label>Title:</label>
        <input type="text" name="title" className="ep-title" value={this.state.title} onChange={this.onChange} required />
        <label>Tags:</label>
        <input type="text" name="tags" className="ep-tags" value={this.state.tags} onChange={this.onChange} />
        <label>Details:</label>
        <textarea name="details" className="ep-details" value={this.state.details} onChange={this.onChange} required />
        <Button onClick={this.onUpdatePost}>{this.state.updateStatus}</Button>
      </div>
    );
  }
}

export default EditPost;