import React from 'react';
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
import { isArray } from 'util';

const Checkbox = ({
  item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown, values, ...props
}) => {
  const valueType = item.valueConstraints.valueType;
  const token = valueType && valueType.includes('token');

  const onChangeValue = (value) => {
    const { answer } = props;
    let values = [];

    if (!answer || !answer.value || !isArray(answer.value)) {
      values.push(value);
    } else if (answer.value.includes(value)) {
      values = answer.value.filter(option => option !== value);
    } else {
      values.push(...answer.value, value);
    }

    handleChange({ value: values });
  }

  const invertColor = (hex) => {
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

  const renderItem = (obj, index) => (
    <OverlayTrigger
      placement="left"
      delay={{ show: 250, hide: 200 }}
      overlay={
        <Tooltip id="button-tooltip" style={{ display: obj.description ? 'block' : 'none' }}>
          <Markdown
            markdown={obj.description || ''}
          />
        </Tooltip>
      }
    >
      <div className="response-option" style={{ background: obj.color ? obj.color : 'none' }}>
        {
          obj.image && <Image className="option-image" src={obj.image} roundedCircle /> ||
          <div className="option-image"></div>
        }
        <Form.Check
          type="checkbox"
          name={item.variableName}
          id={`${item.variableName}${index}`}
          style={{ color: obj.color ? invertColor(obj.color) : "#333333" }}
          value={obj.value}
          label={obj.name.en}
          disabled={!isNextShown}
          defaultChecked={props.answer && Array.isArray(props.answer.value) && props.answer.value.includes(obj.value)}
          onChange={(v) => onChangeValue(token ? obj.name.en : obj.value)}
        />
      </div>
    </OverlayTrigger>
  );

  const itemCount = item.valueConstraints.itemList.length;
  return (
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
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
                  markdown={item.question.en.replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2')}
                />
              </div>
            </Card.Title>
            <div className="no-gutters">
              <Form.Group as={Row}>
                <Col md={6}>
                  {_.map(item.valueConstraints.itemList, (obj, i) => (
                    i < Math.ceil(itemCount / 2) ? renderItem(obj, i) : <></>
                  ))}
                </Col>

                <Col md={6}>
                  {_.map(item.valueConstraints.itemList, (obj, i) => (
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
        {...props}
      />
    </Card>
  );
}

export default Checkbox;
