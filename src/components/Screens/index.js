import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card, Row, Col, Modal, Button, ProgressBar } from 'react-bootstrap';
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
import { clearActivityStartTime } from '../../state/app/app.reducer';
import {
  setAnswer,
  setEndTime,
  setCurrentScreen,
  createResponseInProgress,
} from '../../state/responses/responses.reducer';
import {
  // responsesSelector,
  currentScreenResponseSelector,
  currentResponsesSelector,
  currentScreenIndexSelector,
  inProgressSelector,
  lastResponseTimeSelector
} from '../../state/responses/responses.selectors';

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
  const progress = useSelector(inProgressSelector);
  const user = useSelector(userInfoSelector);
  const lastResponseTimes = useSelector(lastResponseTimeSelector);
  const currentScreenIndex = useSelector(currentScreenIndexSelector);
  const activityAccess = useSelector(currentActivitySelector);
  const inProgress = useSelector(currentResponsesSelector);
  const responseTimes = {};

  for (const activity of applet.activities) {
    responseTimes[activity.name.en.replace(/\s/g, '_')] = (lastResponseTimes[applet.id] || {})[activity.id];
  }

  const visibility = activityAccess.items.map((item) =>
    item.isVis ? false : testVisibility(
      item.visibility,
      activityAccess.items,
      inProgress?.responses,
      responseTimes
    )
  );
  const screenIndex = getNextPos(currentScreenIndex - 1, visibility)

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
    const { activity } = inProgress;
    clearActivityStartTime(activity.event ? activity.id + activity.event.id : activity.id)

    if (activityAccess.compute && !isSummaryScreen && !activityAccess.disableSummary) {
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
      item.isVis ? false : testVisibility(
        item.visibility,
        activityAccess.items,
        responses,
        responseTimes
      )
    );

    const next = getNextPos(screenIndex, visibility);
    const prev = getLastPos(screenIndex, visibility);

    return [next, prev];
  }

  const getPercentages = (activities, progress) => {
    return activities.map(activity => {
      const currentId = progress[activity.id] ? progress[activity.id].screenIndex : 0;

      return {
        label: activity.name.en,
        percentage: currentId / activity.items.length * 100
      }
    })
  }

  const [next, prev] = getVisibility(inProgress?.responses);

  const handleNext = (e) => {
    let currentNext = next;
    if (e.value || e.value === 0) {
      let responses = [...inProgress?.responses];
      responses[screenIndex] = e.value;

      [currentNext] = getVisibility(responses);
    }

    dispatch(setEndTime({ activityId: activityAccess.id, screenIndex: screenIndex }));

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
    if (screenIndex >= 0 && prev >= 0) {
      dispatch(
        setCurrentScreen({
          activityId: activityAccess.id,
          screenIndex: prev
        })
      );
    }
  }

  let availableItems = 0;
  const activityStatus = getPercentages(applet.activities.filter(({ id }) => id !== activityAccess.id), progress);
  const percentage = screenIndex ?
    screenIndex / activityAccess.items.length * 100
    : 0;

  activityAccess.items.forEach((item, i) => {
    const isVisible = item.isVis ? false : testVisibility(
      item.visibility,
      activityAccess.items,
      inProgress?.responses,
      responseTimes
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
          isBackShown={screenIndex === i && i && prev >= 0}
          isNextShown={screenIndex === i}
        />
      );
    }
  });

  return (
    <Container>
      <Row className="mt-5">
        <Col xl={3} />
        <Col xl={9} >
          <ProgressBar striped className="mb-2" now={percentage} />
        </Col>
      </Row>
      <Row className="mt-2 activity">
        <Col xl={3}>
          <Card className="hover text-center mb-4">
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

          {activityStatus.map(status =>
            <div className="mt-2 rounded border w-h p-2 text-center">
              <div className="mb-2">{status.label}</div>
              <ProgressBar className="mb-2" now={status.percentage} />
            </div>
          )}
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
          <Modal.Title>{t('additional.response_submit')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('additional.response_submit_text')}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" disabled={isLoading} onClick={() => setShow(false)}>{t('additional.no')}</Button>
          <Button variant="primary" disabled={isLoading} onClick={() => finishResponse()}>{t('additional.yes')}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Screens;
