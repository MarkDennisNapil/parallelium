import axios from 'axios';
import React from 'react';
import api from '../../api';
import { Button } from 'react-bootstrap';
import '../../styles/signup/signup.css';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      passwordconfirm: '',
      pwalert: '',
      photo: '',
      birthdate: '',
      agreeterms: false,
      signupStatus: 'Sign Up'
    };
    this.onChange = this.onChange.bind(this);
    this.AgreeTermsPolicy = this.AgreeTermsPolicy.bind(this);
    this.onValidatePassword = this.onValidatePassword.bind(this);
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  AgreeTermsPolicy = () => this.setState({agreeterms: true});
  onValidatePassword = (e) => {
    this.setState({passwordconfirm: e.target.value});
    if(this.state.password !== this.state.passwordconfirm){
      this.setState({pwalert: 'Password does not match!'});
    } else {
      this.setState({pwalert: 'Matched'});
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({signupStatus: 'Submitting...'});
    const formdata = new FormData();
    formdata.append('first_name', this.state.first_name);
    formdata.append('last_name', this.state.last_name);
    formdata.append('email', this.state.email);
    formdata.append('password', this.state.passwordconfirm);
    formdata.append('birthdate', this.state.birthdate);
    formdata.append('file', this.state.photo);
    axios.post(`${api}signup`, formdata, {})
      .then((result) => {
        this.setState({signupStatus: result.data.message});
      })
      .catch((err) => {
        console.log(err);
        this.setState({signupStatus: 'Registration failed!'});
      });
  }
  Login = () => {
    window.location.assign('/login');
  }
  render() {
    return (
      <div className='signup-container'>
        <div className='signup-form'>
        <h1>Parallelium</h1>
          <form>
            <label>Profile Photo (required):</label>
            <input type="file" accept='image/png, image/jpeg' name="photo" onChange={(e) => this.setState({photo: e.target.files[0]})} style={{display: `${this.state.showFileIn}`}} />
            <label>First Name</label>
            <input type='text' className='text-input' name='first_name' value={this.state.first_name} onChange={this.onChange} placeholder='First name...' />
            <label>Last Name</label>
            <input type='text' className='text-input' name='last_name' value={this.state.last_name} onChange={this.onChange} placeholder='Last name...' />
            <label>Email</label>
            <input type='email' className='text-input' name='email' value={this.state.email} onChange={this.onChange} placeholder='Email..' />
            <label>Password</label>
            <input type='password' className='text-input' name='password' value={this.state.password} onChange={this.onChange} placeholder='Password..' />
            <label>Confirm Password <span>{this.state.pwalert}</span></label>
            <input type='password' className='text-input' name='validatepassword' value={this.state.passwordconfirm} onChange={this.onValidatePassword} placeholder='Confirm Password..' />
            <label>Birthdate</label>
            <input type='date' className='date-input' name='birthdate' value={this.state.birthdate} onChange={this.onChange} max='{curDate}' />
            <input type='checkbox' className='check-input' name='agreeterms' value={this.state.agreeterms} onChange={this.AgreeTermsPolicy} />
            <label className='checkbox-text'>Agree to Terms, Services & Policies</label>
            <input type='submit' className='btn-signup' onClick={(e) => this.handleSubmit(e)} value={this.state.signupStatus} />
          </form>
        </div>
        <Button onClick={this.Login} className='toggle-login'>Login</Button>
      </div>
    );
  }
}
