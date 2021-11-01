import React, {useState} from 'react';
import axios from 'axios';
import base_url from './../base_url';

let Register = () => {
    const [user, setUser] = useState({});
    const handleForm = (event) => {
        event.preventDefault();
        console.log('handleForm', user);
        let emptyData = validateDataUser(user);
        if(emptyData.length > 0) {
            alert('Por favor ingrese todos los datos');
        } else {
            axios.post(base_url + 'api/clients', user, {headers: {'Accept': 'application/json'}})
                .then((response) => {
                    let data = response.data;
                    alert(data.message);
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
        let items = ['document', 'name', 'email', 'phone'];
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
                    <h1>Register</h1>
                    <input type="text" name="document" onChange={handleChange} value={user.document || ''} className="form-control mb-2" placeholder="Document" />
                    <input type="text" name="phone" onChange={handleChange} value={user.phone || ''} className="form-control mb-2" placeholder="Phone" />
                    <input type="text" name="name" onChange={handleChange} value={user.name || ''} className="form-control mb-2" placeholder="Name"/>
                    <input type="text" name="email" onChange={handleChange} value={user.email || ''} className="form-control mb-2" placeholder="Email"/>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-dark" id="bn-save">Guardar</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}

export default Register;