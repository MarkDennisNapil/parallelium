import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import api from "../../api";
import floppydisk from '../../assets/svgs/solid/floppy-disk.svg';
import Navigation from "../navigation/navigationbar";
import '../../styles/profile/edit.css';

class EditUserProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            uid: localStorage.getItem('user_id'),
            first_name: '',
            last_name: '',
            profession: [],
            phone: '',
            email: '',
            photo: '',
            type: 'detailsonly',
            showFileIn: 'none',
            submitStatus: ''
        }
        this.onTextChange = this.onTextChange.bind(this);
        this.onCheck = this.onCheck.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
    }
    onTextChange = (e) => this.setState({[e.target.name]: e.target.value});
    onCheck = () => this.setState({type: 'detailswithfile', showFileIn: 'flex'});
    componentDidMount() {
        axios.get(`${api}users/${this.state.uid}`)
        .then(response => {
            this.setState({
                first_name: response.data.data.first_name,
                last_name: response.data.data.last_name,
                profession: response.data.data.profession,
                phone: response.data.data.phone,
                email: response.data.data.email
            });
        })
        .catch(error => {
            console.log(error);
        });
    }
    submitUpdate = (e) => {
        e.preventDefault();
        this.setState({submitStatus: 'Saving...'});
        const formdata = new FormData();
        formdata.append('first_name', this.state.first_name);
        formdata.append('last_name', this.state.last_name);
        formdata.append('profession', this.state.profession);
        formdata.append('phone', this.state.phone);
        formdata.append('email', this.state.email);
        formdata.append('file', this.state.photo);
        formdata.append('type', this.state.type);
        axios.put(`${api}users/${this.state.uid}`, formdata, {})
        .then(response => {
            this.setState({submitStatus: response.data.message});
            window.location.assign('/');
        })
        .catch(error => {
            console.log(error);
            this.setState({submitStatus: 'Update failed!'});
        });
    }
    render() {
        return(
            <div className="eup-container">
                <Navigation />
            <div className="eup-content">
            <div className="eup-form">
            <Button onClick={this.submitUpdate}><img src={floppydisk} />{this.state.submitStatus}</Button>
            <div className="eup-photo-container">
                <span><input type="checkbox" value={this.state.type} onChange={this.onCheck} />Change Photo:</span>
                <input type="file" accept='image/png, image/jpeg' name="photo" onChange={(e) => this.setState({photo: e.target.files[0]})} style={{display: `${this.state.showFileIn}`}} />
                </div>
                <label>First Name:</label><input type="text" name="first_name" value={this.state.first_name} className="eup-fname" onChange={this.onTextChange} placeholder="First Name" required />
                <label>Last Name:</label><input type="text" name="last_name" value={this.state.last_name} className="eup-lname" onChange={this.onTextChange} placeholder="Last Name" required />
                <label>Profession:</label><input type="text" name="profession" value={this.state.profession} onChange={this.onTextChange} placeholder="Profession" required />
                <label>Phone Number:</label><input type="number" name="phone" value={this.state.phone} onChange={this.onTextChange} placeholder="Phone" required />
                <label>Email:</label><input type="email" name="email" value={this.state.email} onChange={this.onTextChange} placeholder="Email" required />
            </div>
            </div>
            </div>
        );
    }
}

export default EditUserProfile;