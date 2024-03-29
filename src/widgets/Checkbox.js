import React, { useRef } from 'react';
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

const Checkbox = ({
  item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown, values, invalid, ...props
}) => {
  const valueType = item.valueConstraints.valueType;
  const token = valueType && valueType.includes('token');

  const lastResponseTime = useSelector(activityLastResponseTimeSelector);
  const profile = useSelector(profileSelector);
  const markdown = useRef(parseMarkdown(item.question.en, lastResponseTime, profile, props.activity, props.answers)).current;

  const onChangeValue = (value) => {
    const { answer } = props;
    let values = [];

    if (!answer || !answer.value || !_.isArray(answer.value)) {
      values.push(value);
    } else if (answer.value.includes(value)) {
      values = answer.value.filter(option => option !== value);
    } else {
      values.push(...answer.value, value);
    }

    handleChange({ value: values });
  }

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

  const isNextDisable = () => {
    const { answer } = props;

    return !answer || !answer.value || !answer.value.length;
  }

  const renderItem = (obj, index) => {
    const tooltip = parseMarkdown(obj.description, lastResponseTime, profile, props.activity, props.answers);
    
    return (
      <div key={index} className="response-option" style={{ background: obj.color ? obj.color : 'none' }}>
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
                  markdown={tooltip || ''}
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
          type="checkbox"
          name={item.variableName}
          id={`${item.variableName}${index}`}
          className="form-check-width"
          style={{ color: obj.color ? invertColor(obj.color) : "#333333" }}
          value={obj.value}
          label={handleReplaceBehaviourResponse(obj.name.en, props.activity, props.answers)}
          disabled={!isNextShown}
          defaultChecked={props.answer && Array.isArray(props.answer.value) && props.answer.value.includes(obj.value)}
          onChange={(v) => onChangeValue(token ? obj.name.en : obj.value)}
        />
      </div>
    )
  };

  const itemCount = item.valueConstraints.itemList.length;
  return (
    <Card className={`${invalid ? 'invalid' : ''} mb-3`} style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            <Card.Title className="question">
              {
                props.watermark &&
                <Image className="watermark" src={props.watermark} alt="watermark" rounded />
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
        isNextDisable={isNextDisable()}
        handleBack={handleBack}
        isSubmitShown={isSubmitShown}
        skippable={item.skippable}
        {...props}
      />
    </Card>
  );
}

export default Checkbox;
