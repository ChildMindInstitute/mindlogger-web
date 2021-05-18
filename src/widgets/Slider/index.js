import React from 'react';
import _ from "lodash";

import Navigator from '../Navigator';

import "./style.css"

const SliderWidget = ({ item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown }) => {
  const {
    continuousSlider,
    isOptionalTextRequired,
    showTickMarks,
    itemList,
    ['minValue']: minLabel,
    ['maxValue']: maxLabel
  } = item.valueConstraints;

  const minValue = Math.min.apply(
    Math,
    itemList.map(item => item.value)
  );

  const maxValue = Math.max.apply(
    Math,
    itemList.map(item => item.value)
  )

  return (
    <div className="card mb-3" style={{ maxWidth: "auto" }}>
      <div className="row no-gutters">
        <div className="col-md-3 p-3">
          <img src="../logo192.png" className="rounded w-h" alt="applet-image" />
        </div>

        <div className="col-md-9">
          <div className="card-body">
          <h5 className="card-title question">{item.question.en}</h5>
            <div className="row no-gutters px-4 py-4">
              <div className="slider">

                <input type="range"
                  min={minValue}
                  max={maxValue}
                  step={continuousSlider ? 0.1 : 1}
                  onChange={(e) => handleChange(e.target.value)}
                />
                {
                  !showTickMarks && (<div className="ticks">
                    {
                      _.map(itemList, (obj, i) => (
                        <span
                          key={obj.name.en}
                          className="tick"
                        >{obj.name.en}</span>
                      ))
                    }
                  </div>)
                }

                <div className="slider-description">
                  <div className="first" style={{ width: Math.floor(90 / itemList.length) + '%' }}>
                    <img
                      src={ itemList[0].image }
                      width="100%"
                    ></img>

                    <div
                      className="min-label"
                    >
                      {minLabel}
                    </div>
                  </div>
                  <div className="last" style={{ width: Math.floor(90 / itemList.length) + '%' }}>
                    <img
                      src={ itemList[itemList.length-1].image }
                      width="100%"
                    ></img>

                    <div
                      className="min-label"
                    >
                      {maxLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigator isBackShown={isBackShown} isNextShown={isNextShown} handleBack={handleBack} isSubmitShown={isSubmitShown}/>
    </div>
  );
}

export default SliderWidget;
