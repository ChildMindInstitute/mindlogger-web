import React from 'react';
import { useForm } from 'react-hook-form';

import { history } from '../../store'

import { forgotPassword } from '../../services/network';

import './styles.css'

/**
 *
 * Component for requesting new password
 * @constructor
 */
export default function ForgotPassword() {
  const { register, handleSubmit, setError, errors } = useForm();

  /**
   * Sends the forgot password email.
   *
   * If the given email address is incorrect, it will display an error message.
   * @param body
   * @returns {Promise} resolves when the email has been sent.
   */
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
        <div className="container fluid" id="signupForm">
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
          <p className="mt-3">Forgot Password? <a href="/forgotpassword">Reset it</a></p>
        </div>
      </div>
    </div>
  );
}
