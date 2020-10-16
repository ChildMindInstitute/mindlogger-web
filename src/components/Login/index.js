import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { signIn } from '../../services/network';
import { signInSuccessful } from '../../state/user/user.thunks';
import './styles.css'
import { getPrivateKey } from '../../services/encryption'

export default function Login() {
    const { register, handleSubmit, setError, errors } = useForm();
    const dispatch = useDispatch();
    const onSubmit = body => {
        return signIn({ ...body })
            .then((response) => {
                if (typeof response.exception !== 'undefined') {
                    throw response.exception;
                } else {
                    response.user.privateKey = getPrivateKey({ userId: response.user._id, email: body.user, password: body.password });
                    response.user.email = body.user;
                    dispatch(signInSuccessful(response));
                }
            })
            .catch((e) => {
                if (typeof e.status !== 'undefined') {
                    setError("password", {
                        type: "manual",
                        message: "Login failed!"
                    });
                } else {
                    setError("password", {
                        type: "manual",
                        message: "Login failed!"
                    });
                }
            });
    };
    return (
        <div className="demo mb-3">
            <div id="login" className="text-center mb-0">
                <h1>Log In</h1>
                <div id="signupForm" className="container fluid" id="signupForm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <input
                                name="user"
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
