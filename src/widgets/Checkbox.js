import React from 'react';
import _ from "lodash";

import Navigator from './Navigator';

export const Checkbox = () => (
  <div className="card mb-3" style={{ maxWidth: "auto" }}>
    <div className="row no-gutters">
      <div className="col-md-3 p-3">
        <img src="../logo192.png" className="rounded w-h" alt="applet-image" />
      </div>
      <div className="col-md-9">
        <div className="card-body">
          <h5 className="card-title">Donec euismod eros non rutrum ornare. Nunc vulputate purus eget ante tristique, in mollis tortor placerat.</h5>
          <div className="row no-gutters pl-4">
            {_.map(_.range(0, 7), (i) => (
              <div className="col-md-6 pr-5">
                <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id={`inlineFormCheck${i}`} value="option1" />
                <label className="form-check-label" for={`inlineFormCheck${i}`}>Fusce ultricies enim id neque tempus in mollis tortor.</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <Navigator />
  </div>
)

export default Checkbox;