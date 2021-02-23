import React from 'react';
import logo from '../../assets/logo-white.svg';
import styles from './Login.module.scss';
import {useHistory} from "react-router-dom";

const axios = require('axios');

const Login = () => {

  const history = useHistory();
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loginForm, setLoginForm] = React.useState({
    email: '',
    password: ''
  });

  function send(event){
    event.preventDefault();
    setSending(true);
    setError(null);
    
    axios.post('/auth/sign-in', loginForm)
    .then((response) => {
      sessionStorage.setItem('user', JSON.stringify(response.data) );
      sessionStorage.setItem('authorization', "Bearer "+response.headers['authorization']);
      sessionStorage.setItem('refresh-token', response.headers['refresh-token']);
      axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('authorization');
      history.push("/");
    })
    .catch((error) => {
      setError(error.response.data.errors.message);
      setSending(false);
    });
    
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let tempValue = {...loginForm};
    tempValue[name] = value;
    
    setLoginForm(tempValue);
  }
  
  return (
  <div className={styles.Login}>
    <div className="bg bg-login">
      <div className="container">
        <div className="row middle-xs h-100vh">
          <div className="col-xs-12 col-sm-6 col-md-4">

            <div className={['logo',styles.logo].join(' ')}>
              <img src={logo} alt="ioasys"/>Books
            </div>

            <form onSubmit={send}>
              <div className="input">
                <label htmlFor="email">E-mail</label>
                <input value={loginForm.email} onChange={handleInputChange} required id="email" name="email" type="email" placeholder="Digite aqui seu e-mail"/>
              </div>
              <div className="input">
                <label htmlFor="password">Senha</label>
                <input value={loginForm.password} onChange={handleInputChange} required id="password" name="password" type="password" placeholder="Digite aqui sua senha"/>
                <button type="submit" className="btn">{ !sending ? "Entrar" : <i className="fas fa-sync fa-spin"></i>}</button>
              </div>
              { error ? <div className={styles.loginError}>
                {error}
              </div> : null }
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
)};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
