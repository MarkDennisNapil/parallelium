/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import api from "../../api";
import { Button } from "react-bootstrap";

class EditMusicPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      title: '',
      tags: [],
      cover_photo: '',
      lyrics: '',
      publisher: localStorage.getItem('user_id'),
      type: 'keep',
      formvisibility: '',
      uploadStatus: 'Upload',
      btntxtcolor: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onCoverPhotoChange = this.onCoverPhotoChange.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onCoverPhotoChange = (e) => this.setState({ cover_photo: e.target.files[0] });
  onCheck = () => this.setState({type: 'replace'});
  componentDidMount() {
    axios.get(`${api}${this.props.postType}/${this.props.postid}`)
      .then(res => {
        this.setState({
          data: res.data.data,
          publisher: res.data.data.publisher,
          title: res.data.data.title,
          tags: res.data.data.tags,
          cover_photo: res.data.data.cover_photo,
          lyrics: res.data.data.lyrics
        });
      })
      .catch(err => {
        console.log(err.stack);
      });
  }
  onUpdateMusic = (e) => {
    e.preventDefault();
    this.setState({uploadStatus: 'Updating post...'});
    const formdata = new FormData();
    formdata.append('coverphotostock', this.state.type);
    formdata.append('publisher', this.state.publisher);
    formdata.append('title', this.state.title);
    formdata.append('tags', this.state.tags);
    formdata.append('cover_photo', this.state.cover_photo);
    formdata.append('lyrics', this.state.lyrics);
    axios.put(`${api}${this.props.postType}/${this.props.postid}`, formdata, {})
      .then(res => {
        this.setState({uploadStatus: res.data.message, btntxtcolor: 'green'});
      })
      .catch(err => {
        console.log(err);
        this.setState({uploadStatus: 'Update failed! Retry.', btntxtcolor: 'red'});
      });
  }
  render(){
    return (
      <div className="edit-post-form" style={{display: `${this.state.formvisibility}`}}>
        <input type="checkbox" name="type" value={this.state.type} onChange={this.onCheck} />
        <input type="file" accept="image/png, image/jpeg, image/gif" name="cover_photo" className="ep-coverphoto" onChange={this.onCoverPhotoChange} />
        <input type="text" name="title" className="epv-title" value={this.state.title} onChange={this.onChange} required />
        <input type="text" name="tags" className="epv-tags" value={this.state.tags} onChange={this.onChange} />
        <textarea name="lyrics" className="epv-lyrics" value={this.state.lyrics} onChange={this.onChange} />
        <Button onClick={this.onUpdateMusic} style={{color: `${this.state.btntxtcolor}`}}>{this.state.uploadStatus}</Button>
        <Button onClick={() => this.setState({formvisibility: 'none'})}>Close</Button>
      </div>
    );
  }
}

export default EditMusicPost;