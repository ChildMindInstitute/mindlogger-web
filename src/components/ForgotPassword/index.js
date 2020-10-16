import React from 'react';
import { useForm } from 'react-hook-form';
import { forgotPassword } from '../../services/network';
import './styles.css'
import { history } from '../../store'
export default function ForgotPassword() {
    const { register, handleSubmit, setError, errors } = useForm();
    const onSubmit = body => {
        return forgotPassword(body.email)
            .then((response) => {
                history.push('/login');
            })
            .catch((e) => {
                    setError("email", {
                        type: "manual",
                        message: "Email doesn't exist!"
                    });
            });
    };
    return (
        <div className="demo mb-3">
            <div id="login" className="text-center mb-0">
                <h1>Forgot Password</h1>
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
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    <p className="mt-3">Don't have an account? <a href="/signup">Create One</a></p>
                    <p className="mt-3">Forgot Password? <a href="/signup">Reset it</a></p>
                </div>
            </div>
        </div>
    );
}
