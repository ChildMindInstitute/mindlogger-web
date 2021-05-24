import React from 'react';
import _ from "lodash";

import Navigator from './Navigator';
import {
  Card,
  Row,
  Col
} from 'react-bootstrap'

const Checkbox = ({ item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown }) => (
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
          <Card.Title>Donec euismod eros non rutrum ornare. Nunc vulputate purus eget ante tristique, in mollis tortor placerat.</Card.Title>
          <Row className="no-gutters pl-4">
            {_.map(_.range(0, 7), (i) => (
              <Col sm={6} className="pr-5" key={i}>
                <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id={`inlineFormCheck${i}`} value="option1" />
                <label className="form-check-label" htmlFor={`inlineFormCheck${i}`}>Fusce ultricies enim id neque tempus in mollis tortor.</label>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Col>

    </Row>
    <Navigator isBackShown={isBackShown} isNextShown={isNextShown} handleBack={handleBack} isSubmitShown={isSubmitShown}/>
  </Card>
)

export default Checkbox;
