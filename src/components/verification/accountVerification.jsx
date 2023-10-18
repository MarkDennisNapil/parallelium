import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from "../../api";

export default function AccountVerification(){
    const [status, setStatus] = useState("Verifying...");
    const params = useParams();
    useEffect(() => {
    axios.put(`${api}verify/accountID/${params.id}`)
    .then(() => {
        setStatus("Verified");
        setTimeout(() => {
            window.location.assign('/');
        }, 3000)
    })
    .catch(error => {
        setStatus("Verification failed!");
        console.log(error.message);
    });
    }, [params.id])
    return(
        <div>
            <h1>{status}</h1>
        </div>
    )
}