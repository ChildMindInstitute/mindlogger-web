import React, { useState, useEffect } from 'react';
import _ from "lodash";
import { Form, Row, Card, Col, Image } from 'react-bootstrap';

import Navigator from './Navigator';
import Markdown from '../components/Markdown';

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
  } = props;

  const [checked, setChecked] = useState();
  const isNextDisable = !answer && answer !== 0;
  const valueType = item.valueConstraints.valueType;
  const token = valueType && valueType.includes('token');

  useEffect(() => {
    setChecked(values[item.variableName])
  }, [values[item.variableName]]);

  const invertColor = (hex) => {
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
        obj.image && <Image className="option-image" src={obj.image} roundedCircle /> ||
        <div className="option-image"></div>
      }
      <Form.Check
        label={obj.name.en}
        name={item.variableName}
        style={{ color: obj.color ? invertColor(obj.color) : "#333333" }}
        type="radio"
        checked={ answer && answer.value == (token ? obj.name.en : obj.value) }
        onChange={
          () => {
            handleChange({ value: token ? obj.name.en : obj.value });
            setChecked(token ? obj.name.en : obj.value);
          }
        }
        value={obj.value}
        disabled={!isNextShown}
        checked={checked == obj.value}
        id={`${item.variableName}${index}`}
      />
    </div>
  );

  const itemCount = item.valueConstraints.itemList.length;
  return (
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
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
        isNextDisable={isNextDisable}
        handleBack={handleBack}
        answer={answer}
        isSubmitShown={isSubmitShown}
      />
    </Card>
  );
}

export default Radio;
