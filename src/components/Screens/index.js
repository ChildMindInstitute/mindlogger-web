import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Modal, Button } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import Avatar from 'react-avatar';

import Item from '../Item';
import { testVisibility } from '../../services/visibility';
import { getNextPos, getLastPos } from '../../services/navigation';
import { userInfoSelector } from '../../state/user/user.selectors';
import { currentActivitySelector, currentAppletSelector } from '../../state/app/app.selectors';
import { completeResponse } from '../../state/responses/responses.actions';
import {
  setAnswer,
  setCurrentScreen,
  createResponseInProgress,
} from '../../state/responses/responses.reducer';
import {
  // responsesSelector,
  currentScreenResponseSelector,
  currentResponsesSelector,
  currentScreenIndexSelector,
} from '../../state/responses/responses.selectors';
import config from '../../util/config';

import "./style.css";

const Screens = () => {
  const items = []
  const dispatch = useDispatch()
  const [data] = useState({});
  const [show, setShow] = useState(false);

  const history = useHistory();
  const { appletId, activityId } = useParams();

  const applet = useSelector(currentAppletSelector);
  const answer = useSelector(currentScreenResponseSelector);
  const user = useSelector(userInfoSelector);
  const screenIndex = useSelector(currentScreenIndexSelector);
  const activityAccess = useSelector(currentActivitySelector);
  const inProgress = useSelector(currentResponsesSelector);
  const visibility = activityAccess.items.map((item) => 
    testVisibility(
      item.visibility,
      activityAccess.items,
      inProgress ?.responses
    )
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

  const finishResponse = async () => {
    await dispatch(completeResponse(false));

    if (applet.publicId) {
      history.push(`/applet/public/${appletId.split('/').pop()}/dashboard`);
    } else {
      history.push(`/applet/${appletId}/dashboard`);
    }
  };

  const handleNext = () => {
    if (next === -1) {
      setShow(true);
    } else {
      // Go to next item:
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
        type={item.valueConstraints.multipleChoice ? "checkbox" : item.inputType}
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
          {applet.watermark &&
            <img className="watermark" src={applet.watermark} alt="watermark" />
          }
          {_.map(items.slice(0, screenIndex + 1).reverse())}
        </Col>
      </Row>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{'Response Submit'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {'Would you like to submit response?'}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>No</Button>
          <Button variant="primary" onClick={() => finishResponse()}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Screens;
