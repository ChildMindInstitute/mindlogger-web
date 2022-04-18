import React, { useState, useEffect, useRef } from 'react'
import _ from "lodash";
import { useSelector } from 'react-redux';
import {
  Modal,
  DropdownButton,
  Dropdown,
  Card,
  Row,
  Col,
  Image,
} from 'react-bootstrap';
import { parseMarkdown } from '../services/helper';
import Navigator from './Navigator';
import Markdown from '../components/Markdown';
import { activityLastResponseTimeSelector } from '../state/responses/responses.selectors';
import { profileSelector } from '../state/applet/applet.selectors';

const TimeDuration = ({
  item,
  values,
  isBackShown,
  isNextShown,
  handleChange,
  handleBack,
  watermark,
  isSubmitShown,
  answer,
  ...props
}) => {
  const { timeDuration } = item.valueConstraints;
  const durations = timeDuration ? timeDuration.split(' ') : [];
  let finalAnswer = answer ? answer : {};
  const lastResponseTime = useSelector(activityLastResponseTimeSelector);

  const profile = useSelector(profileSelector);
  const markdown = useRef(parseMarkdown(item.question.en, lastResponseTime, profile, props.activity, props.answers)).current;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const onChangeValue = (type, value) => {
    let answers = {
      ...finalAnswer,
      [type]: value,
    };
    finalAnswer = answers;
    handleChange(answers);
  }

  const renderDuration = (type) => {
    let items;

    if (type === 'hours') {
      items = new Array(23).fill(0).map((val, index) => {
        return { label: index + 1, value: index + 1 }
      });
    } else if (type === 'mins') {
      items = new Array(59).fill(0).map((val, index) => {
        return { label: index + 1, value: index + 1 }
      });
    } else if (type === 'secs') {
      items = new Array(59).fill(0).map((val, index) => {
        return { label: index + 1, value: index + 1 }
      });
    } else {
      items = new Array(99).fill(0).map((val, index) => {
        return { label: index + 1, value: index + 1 }
      });
    }

    return (
      <>
        <p>{capitalizeFirstLetter(type)}</p>
        <DropdownButton
          variant="none"
          title={finalAnswer[type] || 0}
          onSelect={(v) => onChangeValue(type, v)}
          disabled={!isNextShown}
        >
          {items.map(item =>
            <Dropdown.Item eventKey={item.value}>{item.label}</Dropdown.Item>
          )}
        </DropdownButton>
      </>
    )
  }

  return (
    <Card className="mb-3 px-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
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
          <Card.Body>
            <Row>
              {durations.map(duration =>
                <>
                  {duration && <Col>
                      {renderDuration(duration)}
                    </Col>
                  }
                </>
              )}
            </Row>
          </Card.Body>
        </Col>
      </Row>

      <Navigator
        isBackShown={isBackShown}
        isNextShown={isNextShown}
        isNextDisable={!answer}
        handleBack={handleBack}
        isSubmitShown={isSubmitShown}
        answer={answer}
      />
    </Card>
  )
}

export default TimeDuration;
