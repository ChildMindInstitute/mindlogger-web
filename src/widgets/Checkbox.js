import React from 'react';
import _ from "lodash";
import { Form, Row, Card, Col, Image } from 'react-bootstrap';

import Navigator from './Navigator';
import Markdown from '../components/Screens/Markdown';
import { isArray } from 'util';

const Checkbox = ({
  item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown, ...props
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

    handleChange({value: values});
  }

  const isNextDisable = () => {
    const { answer } = props;

    return !answer || !answer.value || !answer.value.length;
  }

  const renderItem = function (obj, index) {
    return (<div className="response-option">
      {
        obj.image && <Image className="option-image" src={obj.image} roundedCircle /> ||
        <div className="option-image"></div>
      }

      <Form.Check
        type="checkbox"
        name={item.variableName}
        id={`${item.variableName}${index}`}
        value={obj.value}
        label={obj.name.en}
        disabled={!isNextShown}
        onChange={(v) => onChangeValue(token ? obj.name.en : obj.value)}
      />
    </div>);
  }

  const itemCount = item.valueConstraints.itemList.length;
  return (
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            <Card.Title className="question">
              <Markdown>{item.question.en}</Markdown>
            </Card.Title>
            <Row className="no-gutters pl-5">
              <Form.Group as={Row}>
                <Col md={6} className="pr-5">
                  {_.map(item.valueConstraints.itemList, (obj, i) => (
                    i < Math.ceil(itemCount/2) ? renderItem(obj, i) : <></>
                  ))}
                </Col>

                <Col md={6} className="pr-5">
                  {_.map(item.valueConstraints.itemList, (obj, i) => (
                    i >= Math.ceil(itemCount/2) ? renderItem(obj, i) : <></>
                  ))}
                </Col>

              </Form.Group>
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
        {...props}
      />
    </Card>
  );
}

export default Checkbox;
