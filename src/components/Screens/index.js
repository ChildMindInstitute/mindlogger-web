import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col } from 'react-bootstrap';
import Avatar from 'react-avatar';

// Component
import Item from '../Item';

// Constants
import { testVisibility } from '../../services/visibility';
import { getNextPos, getLastPos } from '../../services/navigation';
import { currentActivitySelector, currentAppletSelector } from '../../state/app/app.selectors';
import {
  createResponseInProgress,
  setCurrentScreen,
  setAnswer
} from '../../state/responses/responses.reducer';

import {
  currentScreenResponseSelector,
  currentResponsesSelector,
  currentScreenIndexSelector,
} from '../../state/responses/responses.selectors';

import * as R from 'ramda';

const Screens = () => {
  const items = []
  const dispatch = useDispatch()
  const [data] = useState({});

  const answer = useSelector(currentScreenResponseSelector);
  const screenIndex = useSelector(currentScreenIndexSelector);
  const user = useSelector(state => R.path(['user', 'info'])(state));
  const activityAccess = useSelector(currentActivitySelector);
  const inProgress = useSelector(currentResponsesSelector);
  const applet = useSelector(currentAppletSelector);
  const visibility = activityAccess.items.map((item) => 
    testVisibility(item.visibility, activityAccess.items, inProgress.responses)
  );
  const next = getNextPos(screenIndex, visibility);
  const prev = getLastPos(screenIndex, visibility);

  useEffect(() => {
    dispatch(createResponseInProgress({
      activity: activityAccess,
      event: null,
      subjectId: user._id,
      timeStarted: new Date().getTime()
    }));
  }, [])

  const handleNext = () => {
    if (next === -1) {

    } else {
      dispatch(
        setCurrentScreen({
          activityId: activityAccess.id,
          screenIndex: next
        })
      )
    }
  }

  const handleChange = (answer) => {
    dispatch(
      setAnswer({
        activityId: activityAccess.id,
        screenIndex: screenIndex,
        answer
      })
    )
  }

  const handleBack = () => {
    if (screenIndex >= 0) {
      dispatch(
        setCurrentScreen({
          activityId: activityAccess.id,
          screenIndex: prev
        })
      );
    }
  }

  activityAccess.items.forEach((item, i) => {
    items.push(
      <Item
        data={data}
        type={item.valueConstraints.multipleChoice === true ? "checkbox" : item.inputType}
        key={item.id}
        item={item}
        handleSubmit={handleNext}
        handleChange={handleChange}
        handleBack={handleBack}
        isSubmitShown={next === -1}
        answer={answer}
        isBackShown={screenIndex ===  i && i}
        isNextShown={screenIndex ===  i}
      />
    );
  });

  return (
    <div className="container">
      <Row className="mt-5 activity">
        <Col sm={24} xs={24} md={3}>
          <Card className="hover">
            <div>
              {applet.image ?
                <Card.Img variant="top" src={applet.image} className="rounded border w-h" />
                :
                <Avatar name={applet.name.en} maxInitials={2} color="#777" size="238" round="3px" />
              }
            </div>
            <Card.Body>
              <Card.Text>{applet.name.en}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={24} xs={24} md={9}>
          {_.map(items.slice(0, screenIndex + 1).reverse())}
        </Col>
      </Row>
    </div>
  )
}

export default Screens;
