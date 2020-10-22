import React  from 'react';
import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { history } from '../../store'
import {authTokenSelector, userInfoSelector} from "../../state/user/user.selectors";
import {updateUserDetailsSuccessful} from "../../state/user/user.thunks";

import {updatePassword} from '../../services/network';

import './styles.css'



export default function ChangePassword() {

  const { register, handleSubmit, setError, errors } = useForm();
  const dispatch = useDispatch();

  let authToken = useSelector(state => authTokenSelector(state));
  let user = useSelector(state => userInfoSelector(state));

  const onSubmit = ({ oldPassword, password }) => {
    return updatePassword(authToken, oldPassword, password)
      .then(() => {
        history.push('/profile');

      }).then( () => dispatch(updateUserDetailsSuccessful(user) ))
      .catch((e) => {
        setError("password", {
          type: "manual",
          message: "The current password you entered was incorrect."
        });
      });
  };

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        <h1>Change Password</h1>
        <div className="container fluid" id="signupForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                name="oldPassword"
                type="password"
                placeholder="Old Password"
                className="form-control"
                ref={register({
                  required: "You must specify a password",
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters"
                  }
                })}
              />
            </div>
            {errors.oldPassword && errors.oldPassword.message}
            <div className="form-group">
              <input
                name="password"
                type="password"
                placeholder="password"
                className="form-control"
                ref={register({
                  required: "You must specify a password",
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters"
                  }
                })}
              />
            </div>
            {errors.password && errors.password.message}
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
