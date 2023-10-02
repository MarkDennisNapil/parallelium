/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import api from "../../api";
import { Button } from "react-bootstrap";
import '../../styles/videos/edit.css';

class UpdateVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      video: '',
      thumbnail: '',
      title: '',
      tags: '',
      description: '',
      modifyVideoToggle: 'keep',
      modifyThumbnailToggle: 'keep',
      uploadStatus: 'Upload',
      btntxtcolor: '',
      formvisibility: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onThumbnailChange = this.onThumbnailChange.bind(this);
    this.onVideoChange = this.onVideoChange.bind(this);
    this.videoUpdateCheck = this.videoUpdateCheck.bind(this);
    this.editVideoThumbnailCheck = this.editVideoThumbnailCheck.bind(this);
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  onVideoChange = (e) => this.setState({ video: e.target.files[0] });
  onThumbnailChange = (e) => this.setState({ thumbnail: e.target.files[0] });
  videoUpdateCheck = () => this.setState({modifyVideoToggle: 'replace'});
  editVideoThumbnailCheck = () => this.setState({modifyThumbnailToggle: 'replace'});
  componentDidMount() {
    axios.get(`${api}${this.props.postType}/${this.props.postid}`)
      .then(res => {
        this.setState({
          data: res.data.data,
          title: res.data.data.title,
          video: res.data.data.file,
          thumbnail: res.data.data.thumbnail,
          tags: res.data.data.tags,
          description: res.data.data.description
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onUpdateVideo = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('videostock', this.state.modifyVideoToggle);
    formdata.append('thumbnailstock', this.state.modifyThumbnailToggle);
    formdata.append('title', this.state.title);
    formdata.append('file', this.state.video);
    formdata.append('image', this.state.thumbnail);
    formdata.append('tags', this.state.tags);
    formdata.append('description', this.state.description);
    axios.put(`${api}${this.props.postType}/${this.props.postid}`, formdata, {})
      .then(res => {
        this.setState({uploadStatus: res.data.message, btntxtcolor: 'green'});
      })
      .catch(err => {
        console.log(err);
        this.setState({uploadStatus: 'Upload failed! Retry.', btntxtcolor: 'red'});
      });
  }
  render() {
    return (
      <div className="edit-post-form" style={{display: `${this.state.formvisibility}`}}>
        <input type="text" name="title" className="ep-title" value={this.state.title} onChange={this.onChange} required />
        <input type="text" name="tags" className="ep-tags" value={this.state.tags} onChange={this.onChange} />
        <div className="ep-filetoggle">
        <input type="checkbox" value={this.state.modifyVideoToggle} onChange={this.videoUpdateCheck} />
        <label>Update video:<br></br></label>
        <input type="file" name="video" id="video" className="ep-videoInput" onChange={this.onVideoChange} />
        </div>
        <div className="ep-filetoggle">
        <input type="checkbox" value={this.state.modifyThumbnailToggle} onChange={this.editVideoThumbnailCheck} />
        <label>Change thumbnail:<br></br></label>
        <input type="file" name="thumbnail" id="thumbnail" className="ep-imageInput" onChange={this.onThumbnailChange} />
        </div>
        <textarea name="description" className="ep-description" value={this.state.description} onChange={this.onChange} />
        <Button onClick={this.onUpdateVideo} style={{color: `${this.state.btntxtcolor}`}}>{this.state.uploadStatus}</Button>
        <Button onClick={() => this.setState({formvisibility: 'none'})}>Close</Button>
      </div>
    )
  }
}
export default UpdateVideo;