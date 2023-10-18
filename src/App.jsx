import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import UserProfile from './components/profile/user';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import Chat from './components/chat/chat';
import AddPost from './components/gallerylane/add';
import Vibe from './page/Vibe';
import Paper from './page/Paper';
import Video from './page/Videos';
import AddTextPost from './components/paper/add';
import ViewOtherProfile from './components/profile/OtherUser';
import AddVibeMusic from './components/vibe/add';
import PostVideo from './components/videos/add';
import EditUserProfile from './components/profile/edit';
import Search from './page/Search';
import AccountVerification from './components/verification/accountVerification';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      user_id: localStorage.getItem('user_id')
    }
  }
  render() {
    return (
      <div className='wrapper'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home user_id={this.state.user_id} />} />
            <Route path='/chat' element={<Chat user_id={this.state.user_id} />} />
            <Route path='/text' element={<Paper user_id={this.state.user_id} />} />
            <Route path='/video' element={<Video user_id={this.state.user_id} />} />
            <Route path='/vibe' element={<Vibe />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/profile' element={<UserProfile user_id={this.state.user_id} />} />
            <Route path='/user/info/update' element={<EditUserProfile />} />
            <Route path='/view/profile' element={<ViewOtherProfile user_id={this.state.user_id} />} />
            <Route path='/post/add' element={<AddPost user_id={this.state.user_id} />} />
            <Route path='/post/text/add' element={<AddTextPost user_id={this.state.user_id} />} />
            <Route path='/post/vibe/add' element={<AddVibeMusic user_id={this.state.user_id} />} />
            <Route path='/post/video/add' element={<PostVideo user_id={this.state.user_id} />} />
            <Route path='/search' element={<Search />} />
            <Route path='/:id/:email/:confirm' element={<AccountVerification />}/>
          </Routes>
          </BrowserRouter>
      </div>
    );
  }
}