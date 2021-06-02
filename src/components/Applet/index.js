import React from 'react';
import { Link } from 'react-router-dom';

const Applet = () => (



  <Link to="/applet/43yy4">
    <div className="card hover" style={{ width: "15rem" }}>
      <div className="pr-4 pl-4 pt-4">
        <img src="logo192.png" className="card-img-top rounded border" alt="applet-image" />
      </div>
      <div className="card-body">
        <p className="card-text">        Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
  </Link>
)

export default Applet;
