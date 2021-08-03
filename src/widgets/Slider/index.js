import React, { useState, useEffect } from 'react';
import _ from "lodash";
import { Row, Card, Col } from 'react-bootstrap';

import Navigator from '../Navigator';
import Markdown from '../../components/Screens/Markdown';

import "./style.css";

const SliderWidget = ({
  item,
  values,
  isBackShown,
  isNextShown,
  handleChange,
  handleBack,
  isSubmitShown,
  answer
}) => {
  const [data, setData] = useState(answer);

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

  useEffect(() => {
    setData({ [item.variableName]: values[item.variableName] });
  }, [values[item.variableName]])

  const isNextDisable = () => {
    return !answer || (!answer.value && answer.value !== 0);
  }

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const minLabelWidth = Math.floor(90 / itemList.length);

  const changeValue = (value) => {
    const answer = { value };
    if (!continuousSlider) {
      answer.value = Math.round(answer.value);
    }

    if (!data || answer.value != data.value) {
      setData({ [item.variableName]: answer.value })
      handleChange(answer)
    }
  }

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
                  className={!data && !isSafari ? "no-value" : ""}
                  min={minValue}
                  max={maxValue}
                  value={data && data[item.variableName] || 0}
                  step={0.1}
                  onChange={(e) => changeValue(e.target.value * 1)}
                  disabled={!isNextShown}
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
                  <div className="first" style={{ width: `max(${minLabelWidth}%, 70px)` }}>
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
                  <div className="last" style={{ width: `max(${minLabelWidth}%, 70px)` }}>
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
        isNextDisable={isNextDisable()}
        handleBack={handleBack}
        isSubmitShown={isSubmitShown}
      />
    </Card>
  );
}

export default SliderWidget;
