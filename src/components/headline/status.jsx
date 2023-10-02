import React from 'react';
import api from '../../api';
import styles from '../../styles/headline/status.module.css';
import axios from 'axios';

export default class HomeStatus extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userTotal: 0,
            gallerylaneTotal: 0,
            paperTotal: 0,
            vibeTotal: 0,
            videoTotal: 0
        }
    }
    componentDidMount(){
        axios.get(`${api}stats`)
        .then(response => {
            this.setState({
                userTotal: response.data.userCount, 
                gallerylaneTotal: response.data.gallerylaneCount,
                paperTotal: response.data.paperCount,
                vibeTotal: response.data.vibeCount,
                videoTotal: response.data.videoCount
            });
        })
        .catch(error => {
            console.log(error.message);
        });
    }
    render(){
        return(
            <div className={styles.container}>
                <div className={styles.userstats}>
                    <label>Registered Users</label>
                    <p>{this.state.userTotal}</p>
                </div>
                <div className={styles.poststats}>
                    <label>Total Post</label>
                    <span>{this.state.gallerylaneTotal} gallery post</span>
                    <span>{this.state.paperTotal} text posts</span>
                    <span>{this.state.vibeTotal} music posts</span>
                    <span>{this.state.videoTotal} video posts</span>
                </div>
            </div>
        );
    }
}