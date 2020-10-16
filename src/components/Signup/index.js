import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { signUp } from '../../services/network';
import { signUpSuccessful } from '../../state/user/user.thunks';
import './styles.css'
import { getPrivateKey } from '../../services/encryption'

export default function SignUp() {
    const {register, handleSubmit, setError, errors} = useForm();
    const onSubmit = body => {
        return signUp({...body})
            .then((response) => {
                response.privateKey = getPrivateKey({ userId: response._id, email: body.email, password: body.password });
                response.email = body.email;
                dispatch(signUpSuccessful(response));
            })
            .catch((e) => {
                setError("password", {
                    type: "manual",
                    message: "Sign up failed: username may already be in use."
                });
            });
    };
    const dispatch = useDispatch();
    return (
        <div className="demo mb-3">
            <div id="login" className="text-center mb-0">
                <h1>Register</h1>
                <div id="signupForm" className="container fluid" id="signupForm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <input
                                name="email"
                                placeholder="email"
                                className="form-control"
                                ref={register({
                                    required: "Required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "invalid email address"
                                    }
                                })}
                            />
                            {errors.email && errors.email.message}
                        </div>
                        <div className="form-group">
                            <input
                                name="displayName"
                                placeholder="Display Name"
                                className="form-control"
                                ref={register({
                                    required: "Required",
                                })}
                            />
                            {errors.displayName && errors.displayName.message}
                        </div>
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
