import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import base_url from '../base_url';

let Purchase = () => {
    let history = useHistory();
    let { id } = useParams();
    const [clientId, setClientId] = useState(0);
    const [token, setToken] = useState('');
    const [payment, setPayment] = useState({});
    useEffect(() => {
        if(!localStorage.getItem('logged_in')) {
            history.push('/login');
        } else {
            let datauser = JSON.parse(localStorage.getItem('client'));
            setClientId(datauser.id);
            let params = {'client_id' : datauser.id};
            axios.post(base_url + 'api/payment/' + id, params, {headers: {'Accept': 'application/json'}})
                .then(response => {
                    if(response.data.code !== 200) 
                        alert(response.data.message);
                    else {
                        setPayment(response.data.payment);
                    }
                })
                .catch((error) => {
                    alert('Error en el servidor');
                })
        }
    }, [])
    const handleChange = (event) => {
        setToken(event.target.value);
    }
    const handleForm = (event) => {
        event.preventDefault();
        let params = {'token': token};
        axios.post(base_url + 'api/confirm_payment/' + id, params, {headers: {'Accept': 'application/json'}})
            .then(response => {
                alert(response.data.message);
                axios.get(base_url + 'api/clients/' + clientId)
                    .then(response => {
                        console.log(response.data);
                        localStorage.setItem('client', JSON.stringify(response.data.client));
                        history.push('/home');
                    })
            })
            .catch((error) => {
                alert('Error en el servidor');
            })
        console.log(token);
    }
    return (
        <div className="container">
            <h5>Purchase confirm</h5>
            <form action="" onSubmit={handleForm}>
                <br /><br />
                <div className="row">
                    <div className="col-md-6">
                        <div className="card" style={{'padding': '10px'}}>
                            <h3>{payment.description}</h3>
                            <p>Precio: <b>{payment.amount}</b> $</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <input type="text" placeholder="Token" value={token} onChange={handleChange}/>
                        <button>Confirm</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Purchase;