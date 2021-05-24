import React from 'react';
import _ from "lodash";
import {
  Form,
  Card,
  Row,
  Col
} from 'react-bootstrap';

import Navigator from './Navigator';

const Radio = ({ item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown }) => (
  <Card className="mb-3" style={{ maxWidth: "auto" }}>
    <Row className="no-gutters">
      <Col sm={3} className="p-3">
        <Card.Img
          src={'../../../logo192.png'}
          className="rounded w-h"
          alt="applet-image"
        />
      </Col>

      <Col sm={9}>
        <Card.Body>
          <Card.Title className="question">{item.question.en}</Card.Title>
          <Row className="no-gutters pl-4">
            <Form.Group as={Row}>
              {_.map(item.valueConstraints.itemList, (obj, i) => (
                <div className="col-md-6" key={i}>
                  <Form.Check label={obj.name.en} name={item.variableName} type="radio" onChange={handleChange} value={obj.value} id={`${item.variableName}${i}`} />
                </div>
              ))}
            </Form.Group>
          </Row>
        </Card.Body>
      </Col>

    </Row>
    <Navigator isBackShown={isBackShown} isNextShown={isNextShown} handleBack={handleBack} isSubmitShown={isSubmitShown}/>
  </Card>
)

export default Radio;
