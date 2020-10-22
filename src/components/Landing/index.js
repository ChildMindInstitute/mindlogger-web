import React from 'react';
import {Link} from "react-router-dom";


export default function Landing() {
  return (
    <div className="mt-3 mb-3 h-100">
      <div className="mb-3 pt-3">
        <h1>Welcome to MindLogger</h1>
        <p className="lead">
          Participate in scientific research studies online!
        </p>
        <img style={{"maxWidth":"500px", "width":"100%"}} src="/undraw_data_xmfy.svg" />
        <div>
          <p className="mt-3">
            To get started:

          </p>
          <Link to="/login">
            <button type="button" className="btn btn-primary">
              Login!
            </button>
          </Link>
          or
          <Link to="/signup">
            <button type="button" className="btn btn-primary">
              Sign Up!
            </button>
          </Link>
        </div>
        <div className="mt-3">
          <Link to="/profile">
            <button type="button" className="btn btn-primary">
              Get Started!
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
