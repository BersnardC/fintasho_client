import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import base_url from './../base_url';

let Login = () => {
    const [user, setUser] = useState({});
    let history = useHistory();
    const handleForm = (event) => {
        event.preventDefault();
        let emptyData = validateDataUser(user);
        if(emptyData.length > 0) {
            alert('Por favor ingrese todos los datos');
        } else {
            axios.post(base_url + 'api/auth/login', user, {headers: {'Accept': 'application/json'}})
                .then((response) => {
                    let data = response.data;
                    if(data.code != 200) {
                        alert(data.message);
                    } else {
                        localStorage.setItem('logged_in', true);
                        localStorage.setItem('client', JSON.stringify(data.client));
                        history.push('/home');
                    }
                    setUser({});
                })
                .catch((error) => {
                    alert('Datos de cliente no disponibles');
                })
            }
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUser(values => ({...values, [name]: value}))
    }

    const validateDataUser = (dataUser) => {
        let emptyData = [];
        let items = ['document', 'email'];
        for(let item of items) {
            if(!dataUser[item]) {
                emptyData.push(item);
                break;
            }
        }
        return emptyData;
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-4" style={{margin: 'auto'}}>
                <form method="POST" onSubmit={handleForm}>
                    <h1>Login</h1>
                    <input type="text" onChange={handleChange} value={user.email || ''} name="email" className="form-control mb-2" placeholder="Email" />
                    <input type="text" onChange={handleChange} value={user.document || ''} name="document" className="form-control mb-2" placeholder="Document" />
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-dark" id="bn-save">Guardar</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

