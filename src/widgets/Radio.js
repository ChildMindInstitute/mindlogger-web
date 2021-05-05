import React from 'react';
import _ from "lodash";
import { useTranslation } from 'react-i18next';
import Navigator from './Navigator';

export const Radio = () => {
  const { t } = useTranslation();

  return (
    <div className="card mb-3" style={{ maxWidth: "auto" }}>
      <div className="row no-gutters">
        <div className="col-md-3 p-3">
          <img src="../logo192.png" className="rounded w-h" alt="applet-image" />
        </div>
        <div className="col-md-9">
          <div className="card-body">
            <h5 className="card-title">Donec euismod eros non rutrum ornare. Nunc vulputate purus eget ante tristique, in mollis tortor placerat.</h5>
            <div className="row no-gutters pl-4">
              {_.map(_.range(0, 5), (i) => (
                <div className="col-md-6">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id={`inlineRadio${i}`} value="option1" />
                  <label className="form-check-label" for={`inlineRadio${i}`}>Nunc vulputate purus</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Navigator />
    </div>
  )
}

export default Radio;