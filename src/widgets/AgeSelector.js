import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import _ from "lodash";
import { Form, Row, Card, Col, Image } from 'react-bootstrap';

import Navigator from './Navigator';
import Markdown from '../components/Markdown';
import { parseMarkdown } from '../services/helper';
import { activityLastResponseTimeSelector } from '../state/responses/responses.selectors';

import { isArray } from 'util';

const AgeSelector = ({
  item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown, ...props
}) => {
  const { answer } = props;
  let itemList = [];

  const lastResponseTime = useSelector(activityLastResponseTimeSelector);
  const markdown = useRef(parseMarkdown(item.question.en, lastResponseTime)).current;

  for (let i = item.valueConstraints.minAge; i <= item.valueConstraints.maxAge; i += 1) {
    itemList.push(i);
  }

  const isNextDisable = () => {
    const { answer } = props;

    return !answer || !answer.value || !answer.value.length;
  }

  return (
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            <Card.Title className="question">
              <Markdown
                markdown={markdown}
              />
            </Card.Title>
            <Row className="no-gutters pl-5">
              <Form.Group controlId="SelectToBucket" as={Row}>
                <Form.Control
                  as="select"
                  value={answer?.value}
                  onChange={e => handleChange({ value: e.currentTarget.value })}
                  required
                >
                  <option value="">select</option>
                  {itemList.map(item =>
                    <option value={item} key={item} onClick={(v) => console.log('v: ', item)}>{item}</option>
                  )}
                </Form.Control>
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

export default AgeSelector;
