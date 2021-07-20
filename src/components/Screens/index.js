import React, { useState, useEffect } from 'react';
import _ from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Row, Col, Modal, Button } from 'react-bootstrap';
import Avatar from 'react-avatar';

// Component
import Item from '../Item';

// Constants
import { currentActivitySelector, currentAppletSelector } from '../../state/app/app.selectors';
import {
  setCurrentScreen,
  setAnswer
} from '../../state/responses/responses.reducer';

import { completeResponse } from '../../state/responses/responses.actions';

import {
  currentScreenResponseSelector,
  currentScreenIndexSelector
} from '../../state/responses/responses.selectors';

const Screens = () => {
  const items = []
  const { appletId, activityId } = useParams();
  const dispatch = useDispatch()
  const [data, setData] = useState({});
  const history = useHistory();
  const [show, setShow] = useState(false);

  const answer = useSelector(currentScreenResponseSelector);
  const screenIndex = useSelector(currentScreenIndexSelector);
  const activityAccess = useSelector(currentActivitySelector);
  const applet = useSelector(currentAppletSelector);

  const finishResponse = async () => {
    await dispatch(completeResponse(false));

    if (applet.publicId) {
      history.push(`/applet/public/${appletId.split('/').pop()}/dashboard`);
    } else {
      history.push(`/applet/${appletId}/dashboard`);
    }
  };

  const handleNext = (values) => {
    if (screenIndex == activityAccess.items.length - 1) {
      setShow(true);
    } else {
      dispatch(
        setCurrentScreen({
          activityId: activityAccess.id,
          screenIndex: screenIndex + 1
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
          screenIndex: screenIndex - 1
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
        isSubmitShown={i ===  activityAccess.items.length - 1}
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
          {_.map(items.slice(0, screenIndex + 1))}
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
