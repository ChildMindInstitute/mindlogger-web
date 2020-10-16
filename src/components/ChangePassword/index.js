import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {signIn, updatePassword} from '../../services/network';
import { signInSuccessful } from '../../state/user/user.thunks';
import './styles.css'
import { getPrivateKey } from '../../services/encryption'
import { history } from '../../store'
import {authTokenSelector, userInfoSelector} from "../../state/user/user.selectors";
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
    }
    return (
        <div className="demo mb-3">
            <div id="login" className="text-center mb-0">
                <h1>Change Password</h1>
                <div id="signupForm" className="container fluid" id="signupForm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <input
                                name="oldPassword"
                                type="oldpassword"
                                placeholder="old password"
                                className="form-control"
                                ref={register({
                                    required: "You must specify a password",
                                    minLength: {
                                        value: 6,
                                        message: "Password must have at least 8 characters"
                                    }
                                })}
                            />
                        </div>
                        {errors.oldpassword && errors.oldpassword.message}
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
                                        message: "Password must have at least 8 characters"
                                    }
                                })}
                            />
                        </div>
                        {errors.password && errors.password.message}
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    <p className="mt-3">Don't have an account? <a href="/signup">Create One</a></p>
                    <p className="mt-3">Forgot Password? <a href="/signup">Reset it</a></p>
                </div>
            </div>
        </div>
    );
}
