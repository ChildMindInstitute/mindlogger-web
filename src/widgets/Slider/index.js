import React from 'react';
import _ from "lodash";
import "./style.css"
import Navigator from '../Navigator';

export const SliderWidget = () => {

  return (
    <div className="card mb-3" style={{ maxWidth: "auto" }}>
      <div className="row no-gutters">
        <div className="col-md-3 p-3">
          <img src="../logo192.png" className="rounded w-h" alt="applet-image" />
        </div>
        <div className="col-md-9">
          <div className="card-body">
            <h5 className="card-title">Donec euismod eros non rutrum ornare. Nunc vulputate purus eget ante tristique, in mollis tortor placerat.</h5>
            <div className="row no-gutters px-4 py-4">
              <div className="slider">
                <input type="range" />
                <div className="ticks">
                  <span className="tick">1</span>
                  <span className="tick">2</span>
                  <span className="tick">3</span>
                  <span className="tick">4</span>
                  <span className="tick">5</span>
                  <span className="tick">6</span>
                </div>

                <div className="slider-image">
                  <div className="first" style={{ width: Math.floor(90/6) + '%' }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Thumbs-up-icon.png" width="100%"></img>
                  </div>
                  <div className="last" style={{ width: Math.floor(90/6) + '%' }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Thumbs-up-icon.png" width="100%"></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigator />
    </div>
  );
}

export default SliderWidget;
