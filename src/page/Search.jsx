/* eslint-disable react/jsx-key */
import React from "react";
import axios from "axios";
import api from "../api";
import { Button } from "react-bootstrap";
import searchicon from '../assets/svgs/solid/magnifying-glass.svg';
import Navigation from "../components/navigation/navigationbar";
import GalleryItem from "../components/gallerylane/item";
import UserCard from "../components/search/UserResult";
import VideoItem from "../components/videos/video";
import MusicItem from "../components/vibe/item";
import PaperItem from "../components/paper/item";
import '../styles/page/Search.css';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            user: [],
            post: [],
            text: [],
            video: [],
            audio: [],
            result: 'all'
        }
        this.onKeywordChange = this.onKeywordChange.bind(this);
    }
    onKeywordChange = (e) => this.setState({keyword: e.target.value});
    componentDidMount(){
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
    Find = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('keyword', this.state.keyword);
        axios.get(`${api}search`, formdata, {})
        .then(response => {
            this.setState({
                user: response.data.user,
                post: response.data.post,
                text: response.data.text,
                video: response.data.video,
                audio: response.data.music
            });
            alert(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }
    DisplayResult(){
        if(this.state.result === 'users'){
            return this.User()
        }
        else if(this.state.result === 'post'){
            return this.Post()
        }
        else if(this.state.result === 'video'){
            return this.Video()
        }
        else if(this.state.result === 'audio'){
            return this.Audio()
        }
        else if(this.state.result === 'text'){
            return this.Text()
        }
        else{
            return [this.User(),
            this.Text(),
            this.Post(),
            this.Video(),
            this.Audio()]
        }
    }
    User(){
        return this.state.user.map((items, i) => {
            return <div className="s1-res-user"> <span className="s1-res-type">User <label>({this.state.user.length + " result"})</label></span>
            <UserCard item={items} key={i}  />
            </div>;
        });
    }
    Post(){
        return this.state.post.map((items, i) => {
            return <div className="s1-res-image"><span className="s1-res-type">Images <label>({this.state.post.length + " result"})</label></span>
                <GalleryItem obj={items} key={i} />
                </div>;
        });
    }
    Video(){
        return this.state.video.map((items, i) => {
            return <div className="s1-res-video"><span className="s1-res-type">Videos <label>({this.state.video.length + " result"})</label></span>
            <VideoItem obj={items} key={i} />
            </div>;
        });
    }
    Audio(){
        return this.state.audio.map((items, i) => {
            return <div className="s1-res-audio"><span className="s1-res-type">Audio <label>({this.state.audio.length + " result"})</label></span>
            <MusicItem obj={items} key={i} />
            </div>;
        });
    }
    Text(){
        return this.state.text.map((items, i) => {
            return <div className="s1-res-text"><span className="s1-res-type">Text <label>({this.state.text.length + " result"})</label></span>
            <PaperItem obj={items} key={i} />
            </div>;
        });
    }
    render() {
        return(
            <div className="s1-container">
                <div className="s1-nav"><Navigation /></div>
                <div className="s1-searchbar">
                    <input type="text" name="keyword" className="s1-inputsearch" value={this.state.keyword} onChange={this.onKeywordChange} placeholder="Search" />
                    <Button onClick={this.Find} className="s1-searchbtn"><img src={searchicon} />Finder</Button>
                </div>
                <div className="s1-menubar">
                    <Button onClick={() => this.setState({result: 'all'})}>All</Button>
                    <Button onClick={() => this.setState({result: 'users'})}>Users</Button>
                    <Button onClick={() => this.setState({result: 'post'})}>Images</Button>
                    <Button onClick={() => this.setState({result: 'video'})}>Videos</Button>
                    <Button onClick={() => this.setState({result: 'audio'})}>Audio</Button>
                    <Button onClick={() => this.setState({result: 'text'})}>Text</Button>
                </div>
                <div className="s1-content">
                    {this.DisplayResult()}
                </div>
            </div>
        )
    }
}

export default Search;
