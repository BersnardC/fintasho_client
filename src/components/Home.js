import React, {useEffect, useState} from 'react';
import axios from 'axios';
import base_url from '../base_url';
import { useHistory } from "react-router-dom";

let Home = () => {
    const products = [
        {'description': 'Audifonos', 'price': 10},
        {'description': 'Cámara', 'price': 30},
        {'description': 'Redmi 9', 'price': 90},
        {'description': 'Laptop Hp', 'price': 120},
        {'description': 'Mouse', 'price': 10},
        {'description': 'Teclado', 'price': 15},
        {'description': 'Pendrive 1TB', 'price': 50}
    ]
    let history = useHistory();
    const [user, setUser] = useState({});
    const [balance, setBalance] = useState(0);
    const [rechargeBalance, setRB] = useState(0);
    const [historial, setHistorial] = useState([]);
    useEffect(() => {
        if(!localStorage.getItem('logged_in')) {
            history.push('/login');
        } else {
            let dataLogin = JSON.parse(localStorage.getItem('client'));
            setUser(dataLogin);
            setBalance(dataLogin.wallets[0].balance);
            axios.get(base_url + `api/clients/${dataLogin.id}/historial`)
                .then(response => {
                    if(response.data.code !== 200) {
                        alert(response.data.message);
                    } else {
                        setHistorial(response.data.history);
                    }
                })
                .catch((error) => {
                    alert('Error en el servidor');
                })

        }
    }, [])
    const logout = () => {
        localStorage.clear();
        history.push('/login');
    }
    const changeBalance = (event) => {
        setRB(event.target.value);
    }
    const recharge_balance = () => {
        if(rechargeBalance == 0) {
            alert('Ingrese un monto válido para recarga')
        } else {
            let params = {document: user.document, phone: user.phone, amount: rechargeBalance};
            axios.post(base_url + 'api/wallet/balance', params, {headers: {'Accept': 'application/json'}})
                .then((response) => {
                    console.log(response.data);
                    if(response.data.code !== 201)
                        alert(response.data.message)
                    else {
                        setBalance(response.data.balance);
                        setRB(0);
                        let dataUser = user;
                        console.log(dataUser);
                        dataUser.wallets[0].balance = response.data.balance;
                        localStorage.setItem('client',JSON.stringify(dataUser));
                        setUser(dataUser);
                        alert(response.data.message);
                    }
                })
                .catch((error) => {
                    alert('Error en el servidor');
                })
        }
    }

    const make_pruchase = (item) => {
        //console.log(`A comprar el item: ${products[item].description}`);
        let _conf = window.confirm('Seguro de hacer la compra?');
        if(_conf) {
            let params = {'order_amount': products[item].price, 'order_description': products[item].description, 'client_id' : user.id};
            axios.post(base_url + 'api/payment', params, {headers: {'Accept': 'application/json'}})
                .then((response) => {
                    let data = response.data;
                    if(data.code !== 200) {
                        alert(data.message);
                    } else {
                        alert(data.message);
                        history.push('/confirm/' + data.number);
                    }
                })
                .catch((error) => {
                    alert('Error en el servidor');
                })
        }
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-10">
                    <p style={{'textAlign':'left'}}>Welcome <b>{user.name}</b></p>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-dark btn-sm" onClick={() => {logout()}}>Logout</button>
                </div>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-balance-tab" data-bs-toggle="tab" data-bs-target="#nav-balance" type="button" role="tab" aria-controls="nav-balance" aria-selected="true">Balance</button>
                        <button className="nav-link" id="nav-purchases-tab" data-bs-toggle="tab" data-bs-target="#nav-purchases" type="button" role="tab" aria-controls="nav-purchases" aria-selected="false">Shop</button>
                        <button className="nav-link" id="nav-historial-tab" data-bs-toggle="tab" data-bs-target="#nav-historial" type="button" role="tab" aria-controls="nav-historial" aria-selected="false">Historial</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-balance" role="tabpanel" aria-labelledby="nav-balance-tab">
                        <div className="row">
                            <div className="col-md-8">
                                <h3 style={{'textAlign': 'left'}}>Recharge</h3>
                                <input type="number" className="form-control" value={rechargeBalance} onChange={changeBalance} />
                                <button className='btn btn-dark' onClick={recharge_balance}>Recharge</button>
                            </div>
                            <div className="col-md-4">
                                <h3>Balance: {balance} $</h3>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="nav-purchases" role="tabpanel" aria-labelledby="nav-purchases-tab">
                        <div className="row">
                            <h1>Shop</h1>
                            <div className="row">
                                {
                                    products.map((item, index) => 
                                        <div key={index} className="col-md-2">
                                            <div className="card" style={{'marginBottom': '10px', 'padding': '15px'}}>
                                                <h5>{item.description}</h5>
                                                <p>Precio: {item.price}$</p>
                                                <button className="btn btn-info" onClick={() => make_pruchase(index)}>Comprar</button>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="nav-historial" role="tabpanel" aria-labelledby="nav-historial-tab">
                        <div className="row">
                            <h1>historial</h1>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Accion</th>
                                        <th>Monto</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        historial.map((item, index) => 
                                            <tr key={'tr_' + item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.action === 1 ? 'Recarga' : 'Retiro'}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.created_at}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

