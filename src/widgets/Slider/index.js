import React from 'react';
import _ from "lodash";

import Navigator from '../Navigator';
import {
  Card,
  Row,
  Col,
  Form
} from 'react-bootstrap'

import "./style.css"

const SliderWidget = ({ item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown }) => {
  const {
    continuousSlider,
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
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
      <Row className="row no-gutters">
        <Col sm={3} className="p-3">
          <Card.Img
            src={'../../../../logo192.png'}
            className="rounded w-h"
            alt="applet-image"
          />
        </Col>

        <Col sm={9}>
          <Card.Body className="card-body">
            <Card.Title className="question">{item.question.en}</Card.Title>
            <Form.Group as={Row} className="no-gutters px-4 py-4">
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
            </Form.Group>
          </Card.Body>
        </Col>
      </Row>

      <Navigator isBackShown={isBackShown} isNextShown={isNextShown} handleBack={handleBack} isSubmitShown={isSubmitShown}/>
    </Card>
  );
}

export default SliderWidget;
