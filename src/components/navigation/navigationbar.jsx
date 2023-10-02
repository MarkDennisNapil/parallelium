import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import compass from '../../assets/svgs/solid/compass.svg';
import scroll from '../../assets/svgs/solid/scroll.svg';
import music from '../../assets/svgs/solid/music.svg';
import clapperboard from '../../assets/svgs/solid/clapperboard.svg';
import message from '../../assets/svgs/solid/message.svg';
import search from '../../assets/svgs/solid/magnifying-glass.svg';
import user from '../../assets/svgs/solid/user.svg';
import '../../styles/navigation/navigationbar.css';

export default class Navigation extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      topbarvisibility: 'flex'
    }
  }
  toggleTopbarVisibility = () => {
    if(this.state.topbarvisibility === 'flex'){
      this.setState({topbarvisibility: 'none'});
    } else {
      this.setState({topbarvisibility: 'flex'});
    }
  }
  render() {
    return (
      <div className='nav' onTouchMoveCapture={this.toggleTopbarVisibility}>
        <div className='nav-items' style={{display: `${this.state.topbarvisibility}`}}>
          <Link to='/' className='nav-items-main' ><Button><img src={compass} /><span className='btn1'>Explore</span></Button></Link>
          <Link to='/text' className='nav-items-text'><Button><img src={scroll} /><span className='btn2'>Paper</span></Button></Link>
          <Link to='/vibe' className='nav-items-vibe'><Button><img src={music} /><span className='btn3'>Vibe</span></Button></Link>
          <Link to='/video' className='nav-items-video'><Button><img src={clapperboard} /><span className='btn4'>Videos</span></Button></Link>
          <Link to='/chat' className='nav-items-messenger'><Button><img src={message} /><span className='btn5'>Messages</span></Button></Link>
          <Link to='/search' className='nav-items-search'><Button><img src={search} /><span className='btn7'>Search</span></Button></Link>
          <Link to='/profile' className='nav-items-profile'><Button><img src={user} /><span className='btn8'>Profile</span></Button></Link>
        </div>
      </div>
    );
  }
}
