import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import _ from "lodash";
import { Row, Card, Col, Image } from 'react-bootstrap';

import Navigator from '../Navigator';
import Markdown from '../../components/Markdown';

import "./style.css";
import ReactBootstrapSlider from 'react-bootstrap-slider';
import "bootstrap-slider/dist/css/bootstrap-slider.css"

import { parseMarkdown } from '../../services/helper';
import { activityLastResponseTimeSelector } from '../../state/responses/responses.selectors';
import { profileSelector } from '../../state/applet/applet.selectors';

const SliderWidget = ({
  item,
  values,
  isBackShown,
  isNextShown,
  handleChange,
  handleBack,
  isSubmitShown,
  watermark,
  answer,
  invalid,
  activity,
  answers,
  ...props
}) => {
  const [data, setData] = useState({
    [item.variableName]: answer && answer.value || null
  });
  const lastResponseTime = useSelector(activityLastResponseTimeSelector);
  const profile = useSelector(profileSelector);
  const markdown = useRef(parseMarkdown(item.question.en, lastResponseTime, profile, activity, answers)).current;

  const {
    continuousSlider,
    showTickMarks,
    showTickLabel,
    showTextAnchors,
    itemList,
    minValueImg,
    maxValueImg,
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

  const isNextDisable = () => {
    return !answer || (!answer.value && answer.value !== 0);
  }

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
    <Card className={`${invalid ? 'invalid' : ''} mb-3`} style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            <Card.Title className="question">
              {
                watermark &&
                <Image className="watermark" src={watermark} alt="watermark" rounded />
              }
              <div className="markdown">
                <Markdown
                  markdown={markdown}
                />
              </div>
            </Card.Title>
            <Row className="no-gutters no-gutters px-4 py-4">
              <div className={`slider-widget ${!data || data[item.variableName] === null ? 'no-value' : ''}`}>
                <ReactBootstrapSlider
                  min={minValue}
                  max={maxValue}
                  value={data && data[item.variableName] || 0}
                  slideStop={(e) => {
                    changeValue(e.target.value * 1)
                  }}
                  tooltip={'hide'}
                  step={continuousSlider ? 0.1 : 1}
                  disabled={!isNextShown ? 'disabled' : 'enabled'}
                />

                {
                  (showTickLabel !== false || showTickMarks !== false) &&
                  <div className="ticks">
                    {
                      _.map(itemList, (obj, i) => (
                        <span
                          key={obj.name.en}
                          className="tick"
                          style={{ background: showTickMarks !== false ? 'black' : 'white' }}
                        >{showTickLabel !== false && obj.name.en || ''}</span>
                      ))
                    }
                  </div>
                }

                <div className="slider-description">
                  <div className="first" style={{ width: `max(${minLabelWidth}%, 100px)` }}>
                    <img
                      src={minValueImg}
                      width="100%"
                    ></img>

                    {
                      showTextAnchors !== false &&
                        <div
                          className="min-label"
                        >
                          {minLabel}
                        </div>
                    }
                  </div>
                  <div className="last" style={{ width: `max(${minLabelWidth}%, 100px)` }}>
                    <img
                      src={maxValueImg}
                      width="100%"
                    ></img>

                    {
                      showTextAnchors !== false &&
                        <div
                          className="min-label"
                        >
                          {maxLabel}
                        </div>
                    }
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
        skippable={item.skippable}
        {...props}
      />
    </Card>
  );
}

export default SliderWidget;
