import React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { registerRequest } from 'actions/authentication';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);    
  }
  handleRegister(email, nickname, password, password_check, alarm) {
    return this.props.registerRequest(email, nickname, password, password_check, alarm).then(() => {
        if(this.props.status === "SUCCESS") {
          // create session data
          let loginData = {
            isLoggedIn: true,
            userName: this.props.nickName
          };
  
          document.cookie = 'key=' + btoa(JSON.stringify(loginData));
          console.log("회원가입 완료");
          window.location.replace('/');
          return {success: true};
        } else {
          return {success: false, error: this.props.errorMessage};
        }
      }
    );
  }
  render(){
    return (
        <div>
          <Authentication mode={false} onRegister={this.handleRegister}/>
        </div>
    );    
  }
}
const mapStateToProps = (state) => {
  return {
      status: state.authentication.register.status,
      errorMessage: state.authentication.register.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      registerRequest:(email, nickname, password, password_check, alarm) => {
          return dispatch(registerRequest(email, nickname, password, password_check, alarm));
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
// ERROR TYPES

// const ERR_ALREADY_USED_EMAIL = 1;
// const ERR_TOO_SHORT_EMAIL = 2;
// const ERR_INVALID_EMAIL = 3;
// const ERR_ALREADY_USED_NICKNAME = 4;
// const ERR_TOO_SHORT_NICKNAME = 5;
// const ERR_INVALID_NICKNAME = 6;
// const ERR_TOO_SHORT_PASSWORD = 7;
// const ERR_INVALID_PASSWORD = 8;
// const ERR_NOT_EQUAL_PASSWORD = 9;
// const DATA_EMAIL = 1;
// const DATA_NICKNAME = 2;
// const DATA_PASSWORD = 3;
// const DATA_PASSWORD_CHECK = 4;
// const AUTH_REGISTER_SUCCESS = "AUTH_REGISTER_SUCCESS";
// const AUTH_REGISTER_FAILURE = "AUTH_REGISTER_FAILURE";
// const AUTH_REGISTER = "AUTH_REGISTER";