/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import api from "../../api";
import resources from '../../resources';
import { Button } from "react-bootstrap";
import '../../styles/paper/edit.css';

class EditTextPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      title: '',
      header: '',
      content: '',
      background: '',
      tags: [], 
      type: 'textonly',
      uploadStatus: 'Upload',
      btntxtcolor: '',
      formvisibility: '' 
    }
    this.onChange = this.onChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  handleImageChange = (e) => this.setState({background: e.target.files[0]});
  onCheck = () => this.setState({type: 'textwithfile'});
  componentDidMount() {
    axios.get(`${api}${this.props.postType}/${this.props.postid}`)
      .then(res => {
        this.setState({ 
          data: res.data.data,
          title: res.data.data.title,
          header: res.data.data.header,
          content: res.data.data.content,
          tags: res.data.data.tags,
          background: res.data.data.backgroundCover
         });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onUpdateText = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('title', this.state.title);
    formdata.append('header', this.state.header);
    formdata.append('content', this.state.content);
    formdata.append('tags', this.state.tags);
    formdata.append('file', this.state.background);
    formdata.append('type', this.state.type);
    axios.put(`${api}${this.props.postType}/${this.props.postid}`, formdata, {})
      .then(res => {
        alert(res.data.message);
        this.setState({uploadStatus: res.data.message, btntxtcolor: 'green'});
      })
      .catch(err => {
        console.log(err);
        this.setState({uploadStatus: 'Update failed! Retry.', btntxtcolor: 'red'});
      });
  }
  render() {
    return (
      <div className="edit-post-form" style={{display: `${this.state.formvisibility}`}}>
        <input type="checkbox" name="type" value={this.state.type} onChange={this.onCheck} />
        <input type="file" name="background" className="ep-bg" onChange={this.handleImageChange} />
        <input type="text" name="title" className="ep-title" value={this.state.title} onChange={this.onChange} placeholder="Title..." required />
        <input type="text" name="tags" className="ep-tags" value={this.state.tags} onChange={this.onChange} placeholder="Add tags..." />
        <input type="text" name="header" className="ep-header" value={this.state.header} onChange={this.onChange} placeholder="Header..." required />
        <textarea name="content" className="ep-content" value={this.state.content} onChange={this.onChange} placeholder="Content..." required />
        <Button onClick={this.onUpdateText} style={{color: `${this.state.btntxtcolor}`}}>{this.state.uploadStatus}</Button>
        <Button onClick={() => this.setState({formvisibility: 'none'})}>Close</Button>
      </div>
    );
  }
}

export default EditTextPost;