/* eslint-disable react/prop-types */
import React from "react";
import api from "../../api";
import '../../styles/search/UserResult.css';

class UserCard extends React.Component {
    viewProfile = () => {
        localStorage.setItem("view_profile", this.props.item._id);
        window.location.assign('/view/profile');
      }
    render() {
        return(
            <div className="s1-usercard" onClick={this.viewProfile}>
                <div className="s1-usercard-photo">
                <img src={`${api}resources/${this.props.item.photo}`} />
                </div>
                <div className="s1-username">
                    <label>{this.props.item.first_name + ' ' + this.props.item.last_name}</label>
                    <span>{this.props.item.followers.length + ' followers\n' + this.props.item.following.length + ' following'}</span>
                </div>
            </div>
        );
    }
}

export default UserCard;