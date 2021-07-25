import React from 'react';
import _ from "lodash";
import { Form, Row, Card, Col } from 'react-bootstrap';

import Navigator from './Navigator';
import Markdown from '../components/Screens/Markdown';

const Radio = (props) => {
  const {
    item,
    answer,
    isBackShown,
    isNextShown,
    handleChange,
    handleBack,
    isSubmitShown
  } = props;

  const isNextDisable = !answer && answer !== 0;
  const valueType = item.valueConstraints.valueType;
  const token = valueType && valueType.includes('token');

  const getOrderedItems = function (itemList) {
    const items = [];
    const half = Math.ceil(itemList.length / 2);

    for (let i = 0; i < half; i++) {
      items.push(itemList[i]);

      if (i + half < itemList.length) {
        items.push(itemList[i+half]);
      }
    }

    return items;
  }

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
                {_.map(getOrderedItems(item.valueConstraints.itemList), (obj, i) => (
                  <Col md={6} className="pr-5 my-2" key={i}>
                    <Form.Check
                      label={obj.name.en}
                      name={item.variableName}
                      type="radio"
                      onChange={
                        () => {
                          handleChange({
                            value: token ? obj.name.en : obj.value
                          })
                        }
                      }
                      value={obj.value}
                      id={`${item.variableName}${i}`}
                      disabled={!isNextShown}
                    />
                  </Col>
                ))}
              </Form.Group>
            </Row>
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
