import React from "react";
import me from './avatar.png'
import '../../styles/headline/head.css';

class Header extends React.Component {
    render(){
        return(
            <div className="hp1-card">
                <div className="hp1-item">
                <div className="hp1-img-container">
                <img src={me} alt="Parallelium" />
                </div>
                <div className="hp1-text">
                    <marquee><h1>Welcome to Parallelium</h1></marquee>
                    <p>
                        A media content sharing app 
                    </p>
                </div>
                </div>
            </div>
        );
    }
}

export default Header;