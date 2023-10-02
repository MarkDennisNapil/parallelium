import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import videoplus from '../../assets/svgs/solid/video-add-svgrepo-com.svg';
import addimage from '../../assets/svgs/solid/add-image-svgrepo-com.svg';
import addmusic from '../../assets/svgs/solid/add-music-multimedia-svgrepo-com.svg';
import addtext from '../../assets/svgs/solid/edit-add-svgrepo-com.svg';
import '../../styles/navigation/PostMenu.css';

function PostTypeBar() {
  return (
    <div className='post-menu'>
      <div className='post-menu-items'>
        <Link to='/post/add'><Button><img src={addimage} /></Button></Link>
        <Link to='/post/vibe/add'><Button><img src={addmusic} /></Button></Link>
        <Link to='/post/video/add'><Button><img src={videoplus} /></Button></Link>
        <Link to='/post/text/add'><Button><img src={addtext} /></Button></Link>
      </div>
    </div>
  );
}

export default PostTypeBar;
