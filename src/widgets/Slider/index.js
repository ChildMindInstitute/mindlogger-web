import React, { useState } from 'react';
import _ from "lodash";
import { Row, Card, Col } from 'react-bootstrap';

import Navigator from '../Navigator';
import Markdown from '../../components/Screens/Markdown';

import "./style.css";

const SliderWidget = ({
  item,
  isBackShown,
  isNextShown,
  handleChange,
  handleBack,
  isSubmitShown,
  answer
}) => {
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

  const [data, setData] = useState(answer);

  return (
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            <Card.Title className="question">
              <Markdown>{item.question.en}</Markdown>
            </Card.Title>
            <Row className="no-gutters no-gutters px-4 py-4">
              <div className="slider">
                <input
                  type="range"
                  min={minValue}
                  max={maxValue}
                  value={data && data.value}
                  step={continuousSlider ? 0.1 : 1}
                  onChange={(e) => {
                    const answer = {
                      value: e.target.value
                    };

                    setData(answer)
                    handleChange(answer)
                  }}
                />
                {
                  !showTickMarks &&
                  <div className="ticks">
                    {
                      _.map(itemList, (obj, i) => (
                        <span
                          key={obj.name.en}
                          className="tick"
                        >{obj.name.en}</span>
                      ))
                    }
                  </div>
                }

                <div className="slider-description">
                  <div className="first" style={{ width: Math.floor(90 / itemList.length) + '%' }}>
                    <img
                      src={itemList[0].image}
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
                      src={itemList[itemList.length - 1].image}
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
            </Row>
          </Card.Body>
        </Col>
      </Row>

      <Navigator
        isBackShown={isBackShown}
        isNextShown={isNextShown}
        handleBack={handleBack}
        isSubmitShown={isSubmitShown}
      />
    </Card>
  );
}

export default SliderWidget;