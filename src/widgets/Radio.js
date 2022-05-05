import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import _ from "lodash";
import {
  Form,
  Row,
  Card,
  Col,
  Image,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

import Navigator from './Navigator';
import Markdown from '../components/Markdown';
import { handleReplaceBehaviourResponse, parseMarkdown } from '../services/helper';
import { activityLastResponseTimeSelector } from '../state/responses/responses.selectors';
import { profileSelector } from '../state/applet/applet.selectors';

import questionMark from '../assets/question-mark.svg';

const Radio = (props) => {
  const {
    item,
    watermark,
    values,
    answer,
    isBackShown,
    isNextShown,
    handleChange,
    handleBack,
    isSubmitShown,
    invalid,
    activity,
    answers,
  } = props;

  const [checked, setChecked] = useState();
  const isNextDisable = !answer && answer !== 0;
  const valueType = item.valueConstraints.valueType;
  const token = valueType && valueType.includes('token');

  const lastResponseTime = useSelector(activityLastResponseTimeSelector);
  const profile = useSelector(profileSelector);
  const markdown = useRef(parseMarkdown(item.question.en, lastResponseTime, profile, activity, answers)).current;

  useEffect(() => {
    setChecked(values[item.variableName])
  }, [values[item.variableName]]);

  const invertColor = (hex) => {
    if (!hex.includes('#')) {
      return '#333333';
    }
    let hexcolor = hex.replace("#", "");
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#333333' : 'white';
  }

  const renderItem = (obj, index) => (
    <div className="response-option" style={{ background: obj.color ? obj.color : 'none' }}>
      {
        !obj.image && <div className="option-image"></div>
      }
      {
        obj.description &&
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 200 }}
          overlay={
            <Tooltip id="button-tooltip">
              <Markdown
                markdown={obj.description || ''}
              />
            </Tooltip>
          }
        >
          <Image src={questionMark} className="tooltip-icon" />
        </OverlayTrigger> ||
        <div className="option-tooltip"></div>
      }

      {
        obj.image && <Image className="option-image" src={obj.image} roundedCircle />
      }
      <Form.Check
        label={handleReplaceBehaviourResponse(obj.name.en, activity, answers)}
        name={item.variableName}
        className="form-check-width"
        style={{ color: obj.color ? invertColor(obj.color) : "#333333" }}
        type="radio"
        checked={(answer || answer === 0) && answer.value == (token ? obj.name.en : obj.value)}
        onChange={
          () => {
            handleChange({ value: token ? obj.name.en : obj.value });
            setChecked(token ? obj.name.en : obj.value);
          }
        }
        value={obj.value}
        disabled={!isNextShown}
        id={`${item.variableName}${index}`}
      />
    </div>
  );

  const itemCount = item.valueConstraints.itemList.length;
  console.log('item------->', item);
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
            <div className="no-gutters">
              <Form.Group as={Row}>
                <Col md={6}>
                  {item.valueConstraints.itemList.filter(obj => !obj.isVis).map((obj, i) => (
                    i < Math.ceil(itemCount / 2) ? renderItem(obj, i) : <></>
                  ))}
                </Col>

                <Col md={6}>
                  {item.valueConstraints.itemList.filter(obj => !obj.isVis).map((obj, i) => (
                    i >= Math.ceil(itemCount / 2) ? renderItem(obj, i) : <></>
                  ))}
                </Col>
              </Form.Group>
            </div>
          </Card.Body>
        </Col>
      </Row>
      <Navigator
        isBackShown={isBackShown}
        isNextShown={isNextShown}
        isNextDisable={isNextDisable}
        handleBack={handleBack}
        answer={answer}
        isSubmitShown={isSubmitShown}
        skippable={item.skippable}
        {...props}
      />
    </Card>
  );
}

export default Radio;
