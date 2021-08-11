import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Modal, Button } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useTranslation } from 'react-i18next';

import Item from '../Item';
import ActivitySummary from '../../widgets/ActivitySummary';

// Constants
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

const Screens = (props) => {
  const items = []
  const { appletId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation()
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryScreen, setIsSummaryScreen] = useState(false);

  const applet = useSelector(currentAppletSelector);
  const answer = useSelector(currentScreenResponseSelector);
  const user = useSelector(userInfoSelector);
  const screenIndex = useSelector(currentScreenIndexSelector);
  const activityAccess = useSelector(currentActivitySelector);
  const inProgress = useSelector(currentResponsesSelector);

  useEffect(() => {
    if (screenIndex === 0) {
      dispatch(createResponseInProgress({
        activity: activityAccess,
        event: null,
        subjectId: user && user._id,
        timeStarted: new Date().getTime()
      }));
    }
  }, [])

  useEffect(() => {
    if (inProgress && Object.keys(inProgress).length > 0) {
      const { activity, responses } = inProgress;
      let obj = data;
      responses.forEach((val, i) => {
        const { variableName } = activity.items[i];
        obj = { ...obj, [variableName]: val && val.value };
      })
      setData(obj);
    }
  }, [])

  const finishResponse = async () => {
    setIsLoading(true);
    await dispatch(completeResponse(false));
    setIsLoading(false);

    if (activityAccess.compute && !isSummaryScreen) {
      setIsSummaryScreen(true);
      setShow(false);

    } else {
      if (isSummaryScreen) setIsSummaryScreen(false);

      // history.push(`/applet/${appletId}/dashboard`);
      history.push(`/applet/${appletId}/activity_thanks`);
    }
  };

  const getVisibility = (responses) => {
    const visibility = activityAccess.items.map((item) =>
      testVisibility(
        item.visibility,
        activityAccess.items,
        responses
      )
    );

    const next = getNextPos(screenIndex, visibility);
    const prev = getLastPos(screenIndex, visibility);

    return [next, prev];
  }

  const [next, prev] = getVisibility(inProgress?.responses);

  const handleNext = (e) => {
    let currentNext = next;
    if (e.value || e.value === 0) {
      let responses = [...inProgress?.responses];
      responses[screenIndex] = e.value;

      [currentNext] = getVisibility(responses);
    }

    if (currentNext === -1) {
      setShow(true);
    } else {
      // Go to next item:
      dispatch(
        setCurrentScreen({
          activityId: activityAccess.id,
          screenIndex: currentNext
        })
      )
    }
  }

  const handleChange = (answer) => {
    let responses = [...inProgress?.responses];
    responses[screenIndex] = answer;

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

  let availableItems = 0;

  activityAccess.items.forEach((item, i) => {
    const isVisible = testVisibility(
      item.visibility,
      activityAccess.items,
      inProgress ?.responses
    );


    if (isVisible) {
      if (screenIndex >= i) {
        availableItems += 1;
      }
      items.push(
        <Item
          data={data}
          type={item.valueConstraints.multipleChoice ? "checkbox" : item.inputType}
          watermark={screenIndex === i ? applet.watermark : ''}
          key={item.id}
          item={item}
          handleSubmit={handleNext}
          handleChange={handleChange}
          handleBack={handleBack}
          isSubmitShown={next === -1}
          answer={inProgress?.responses[i]}
          isBackShown={screenIndex === i && i}
          isNextShown={screenIndex === i}
        />
      );
    }
  });

  return (
    <div className="container">
      <Row className="mt-5 activity">
        <Col xl={3}>
          <Card className="hover text-center">
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
        <Col xl={9}>
          {isSummaryScreen ?
            <ActivitySummary {...props} />
            :
            _.map(items.slice(0, availableItems).reverse())
          }
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
          <Button variant="secondary" disabled={isLoading} onClick={() => setShow(false)}>{t('additional.no')}</Button>
          <Button variant="primary" disabled={isLoading} onClick={() => finishResponse()}>{t('additional.yes')}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Screens;
