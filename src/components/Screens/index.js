import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col } from 'react-bootstrap';
import Avatar from 'react-avatar';

import Item from '../Item';
import { prepareResponseForUpload } from '../../models/response';
import { testVisibility } from '../../services/visibility';
import { getEncryptionKeys } from '../../services/encryption';
import { getNextPos, getLastPos } from '../../services/navigation';
import { userInfoSelector } from '../../state/user/user.selectors';
import { currentActivitySelector, currentAppletSelector } from '../../state/app/app.selectors';
import { startUploadQueue } from '../../state/responses/responses.actions';
import {
  addToUploadQueue,
  setAnswer,
  setCurrentScreen,
  createResponseInProgress,
} from '../../state/responses/responses.reducer';

import {
  currentAppletResponsesSelector,
  currentScreenResponseSelector,
  currentResponsesSelector,
  currentScreenIndexSelector,
} from '../../state/responses/responses.selectors';
import config from '../../util/config';

import * as R from 'ramda';
import _ from 'lodash';

const Screens = () => {
  const items = []
  const dispatch = useDispatch()
  const [data] = useState({});

  const applet = useSelector(currentAppletSelector);
  const answer = useSelector(currentScreenResponseSelector);
  const user = useSelector(userInfoSelector);
  const responseHistory = useSelector(currentAppletResponsesSelector);
  const activityAccess = useSelector(currentActivitySelector);
  const screenIndex = useSelector(currentScreenIndexSelector);
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

  const handleNext = () => {
    if (next === -1) {
      // Submit responses:
      console.log('--- submit ---', inProgress);

      if ((!applet.AESKey || !applet.userPublicKey) && config.encryptResponse) {
        if (!applet.encryption) return;

        const encryptionKeys = getEncryptionKeys(applet, user);

        // const response = prepareResponseForUpload(
        //   inProgress,
        //   applet,
        //   responseHistory
        // );

        // console.log('prepared response ------>', response);
        // dispatch(addToUploadQueue(response));
        // dispatch(startUploadQueue());
        
      }
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
          {_.map(items.slice(0, screenIndex + 1).reverse())}
        </Col>
      </Row>
    </div>
  )
}

export default Screens;
