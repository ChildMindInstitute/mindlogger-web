import React, { useState, useEffect } from 'react';
import _ from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import Avatar from 'react-avatar';

// Component
import Item from '../Item';

// Constants
import { currentActivitySelector, currentAppletSelector } from '../../state/app/app.selectors';
import {
  createResponseInProgress,
  setCurrentScreen,
  setAnswer as setCurrentResponse
} from '../../state/responses/responses.reducer';

import * as R from 'ramda';

const Screens = () => {
  const items = []
  const dispatch = useDispatch()
  const { activityId } = useParams();
  const [data, setData] = useState({});
  const [screenIndex, setScreenIndex] = useState(0);
  const [answer, setAnswer] = useState({});

  const user = useSelector(state => R.path(['user', 'info'])(state));
  const activityAccess = useSelector(currentActivitySelector);
  const applet = useSelector(currentAppletSelector);

  const { inProgress = {} } = useSelector(state => state.responses);

  console.log('applet', applet);
  console.log('activity access', activityAccess);

  useEffect(() => {
    dispatch(createResponseInProgress({
      activity: activityAccess,
      event: null,
      subjectId: user._id,
      timeStarted: new Date().getTime()
    }));
  }, [])

  useEffect(() => {
    if (inProgress && inProgress[activityAccess.id]) {
      const { screenIndex, responses } = inProgress[activityAccess.id];
      if (responses[screenIndex]) {
        setScreenIndex(screenIndex)
        setAnswer(answer)
      }
    }
  }, [inProgress])

  const handleNext = (values) => {
    if (screenIndex == activityAccess.items.length - 1) {

    } else {
      setScreenIndex(screenIndex + 1)
      dispatch(
        setCurrentScreen({
          activityId: activityAccess.id,
          screenIndex: screenIndex + 1
        })
      )
    }
  }

  const handleChange = (answer) => {
    // setAnswer(answer)

    // dispatch(
    //   setCurrentResponse({
    //     activityId: activityAccess.id,
    //     screenIndex: screenIndex,
    //     answer
    //   })
    // )
  }

  const handleBack = () => {
    if (screenIndex >= 0) {
      dispatch(
        setCurrentScreen({
          activityId: activityAccess.id,
          screenIndex: screenIndex - 1
        })
      );

      setScreenIndex(screenIndex - 1);
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
        isSubmitShown={i == activityAccess.items.length - 1}
        answer={answer}
        isBackShown={screenIndex == i && i}
        isNextShown={screenIndex == i}
      />
    );
  });

  return (
    <div className="container">
      <Row className="mt-5 activity">
        <Col sm={24} xs={24} md={3}>
          <Card className="hover">
            <div className="pr-4 pl-4 pt-4">
              {applet.image ?
                <Card.Img variant="top" src={applet.image} className="rounded border w-h" />
                :
                <Avatar name={applet.name.en} maxInitials={2} size="254" round="3px" />
              }
            </div>
            <Card.Body>
              <Card.Text>{applet.name.en}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={24} xs={24} md={9}>
          {_.map(items.slice(0, screenIndex + 1))}
        </Col>
      </Row>
    </div>
  )
}

export default Screens;
