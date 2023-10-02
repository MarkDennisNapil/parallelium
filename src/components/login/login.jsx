import axios from 'axios';
import React from 'react';
import api from '../../api';
import { Button } from 'react-bootstrap';
import '../../styles/login/login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      status: 'Login',
      txtStatusColor: ''
    }
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  handleSubmit = (e) => {
    e.preventDefault();
    let accountObj = {
      email: this.state.email,
      password: this.state.password
    }
    this.setState({status: 'Logging In...'});
    axios.post(`${api}auth`, accountObj)
      .then((result) => {
        sessionStorage.setItem('token', result.data.token);
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user_id', result.data.id);
        this.setState({status: 'Login Success', txtStatusColor: 'cyan'})
        window.location.assign('/');
      })
      .catch((err) => {
        console.log(err);
        this.setState({status: 'Invalid Credentials!', txtStatusColor: 'red'});
      });
  }
  Signup = () => {
    window.location.assign('/signup');
  }
  render() {
    return (
      <div className='login-container'>
        <div className='login-form'>
          <h1>Login to Parallelium</h1>
          <form>
            <label>Email</label>
            <input type='email' className='txtemail' name='email' value={this.state.email} onChange={this.onChange} placeholder='Enter email...' />
            <label>Password</label>
            <input type='password' className='txtpassword' name='password' value={this.state.password} onChange={this.onChange} placeholder='Enter password...' />
            <input type='submit' className='btn-login' onClick={(e) => this.handleSubmit(e)} value={this.state.status} style={{color: `${this.state.txtStatusColor}`}} />
          </form>
        </div>
        <Button onClick={this.Signup} className='toggle-signup'>Signup</Button>
      </div>
    );
  }
}

export default Login;