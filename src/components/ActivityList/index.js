/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, connect, useDispatch } from 'react-redux'
import {
  Container,
  Card,
  Button,
  Modal,
  Row,
  Col,
} from 'react-bootstrap'
import Avatar from 'react-avatar';

// Local
import { delayedExec, clearExec } from '../../util/interval';
import sortActivities from './sortActivities';
import { inProgressSelector, currentScreenIndexSelector } from '../../state/responses/responses.selectors';
import { finishedEventsSelector } from '../../state/app/app.selectors';
import { appletsSelector } from '../../state/applet/applet.selectors';
import { setCurrentActivity } from '../../state/app/app.reducer';
import { setCurrentScreen } from '../../state/responses/responses.reducer';
import { createResponseInProgress } from '../../state/responses/responses.reducer';
import { parseAppletEvents } from '../../services/json-ld';
import * as R from 'ramda';

import AboutModal from '../AboutModal';
import ActivityItem from './ActivityItem';

import './style.css'

export const ActivityList = ({ inProgress, finishedEvents }) => {
  const { appletId } = useParams();
  const applets = useSelector(appletsSelector);
  const history = useHistory();
  const dispatch = useDispatch();
  const [aboutPage, showAboutPage] = useState(false);
  const [startActivity, setStartActivity] = useState(false);
  const [activities, setActivities] = useState([]);
  const [currentAct, setCurrentAct] = useState({});
  const [prizeActivity, setPrizeActivity] = useState(null);
  const [markdown, setMarkDown] = useState("");
  const [currentApplet] = useState(applets.find(({ id }) => id.includes(appletId)));
  const screenIndex = useSelector(currentScreenIndexSelector);
  const user = useSelector(state => R.path(['user', 'info'])(state));
  const updateStatusDelay = 60 * 1000;

  useEffect(() => {
    const fetchMarkDown = async () => {
      const { about, aboutContent } = currentApplet;

      if (about && about.en) {
        const response = await fetch(about.en);
        setMarkDown(await response.text());
      } else if (aboutContent && aboutContent.en) {
        setMarkDown(aboutContent.en);
      } else {
        setMarkDown("The authors of this applet have not provided any information!");
      }
    }

    fetchMarkDown();
    updateActivites();
  }, []);

  useEffect(() => {
    updateActivites();

    let updateId;
    const leftTime = (60 - new Date().getSeconds()) * 1000;
    const leftOutId = delayedExec(
      () => {
        updateActivites();
        updateId = delayedExec(updateActivites, { every: updateStatusDelay });
      },
      { after: leftTime },
    );

    return () => {
      clearExec(leftOutId);
      if (updateId) {
        clearExec(updateId);
      }
    }
  }, [Object.keys(inProgress).length]) //responseSchedule

  const updateActivites = () => {
    const appletData = parseAppletEvents(currentApplet);
    const appletActivities = appletData.activities.filter(act => {
      const supportedItems = act.items.filter(item => {
        return item.inputType === "radio"
        || item.inputType === "checkox"
          || item.inputType === "slider"
          || item.inputType === "text";
        });
        
        
      return supportedItems.length && !act.isPrize;
    });
    const prizeActs = appletData.activities.filter(act => act.isPrize);

    if (prizeActs.length === 1) {
      setPrizeActivity(prizeActs[0]);
    }

    const temp = sortActivities(appletActivities, inProgress, finishedEvents, currentApplet.schedule?.data);
    setActivities(temp);
  }

  const onPressActivity = (activity) => {
    if (activity.status === "in-progress") {
      setCurrentAct(activity);
      setStartActivity(true);
    } else {
      dispatch(setCurrentActivity(activity.id));
      dispatch(createResponseInProgress({
        activity: activity,
        event: null,
        subjectId: user?._id,
        publicId: currentApplet.publicId || null,
        timeStarted: new Date().getTime()
      }));

      if (currentApplet.publicId) {
        history.push(`/applet/public/${appletId}/${activity.id}`);
      } else {
        history.push(`/applet/${appletId}/${activity.id}`);
      }
    }
  }
  const handleResumeActivity = () => {
    const activity = currentAct;

    dispatch(setCurrentActivity(activity.id));
    dispatch(
      setCurrentScreen({
        activityId: activity.id,
        screenIndex: screenIndex || 0,
      })
    )

    if (currentApplet.publicId) {
      history.push(`/applet/public/${appletId}/${activity.id}`);
    } else {
      history.push(`/applet/${appletId}/${activity.id}`);
    }
    setStartActivity(false);
  }
  const handleRestartActivity = () => {
    const activity = currentAct;

    dispatch(setCurrentActivity(activity.id));
    dispatch(createResponseInProgress({
      activity: activity,
      event: null,
      subjectId: user ?._id,
      publicId: currentApplet.publicId || null,
      timeStarted: new Date().getTime()
    }));

    if (currentApplet.publicId) {
      history.push(`/applet/public/${appletId}/${activity.id}`);
    } else {
      history.push(`/applet/${appletId}/${activity.id}`);
    }
    setStartActivity(false);
  }

  const closeAboutPage = () => showAboutPage(false);
  const openAboutPage = () => showAboutPage(true);
  const handleClose = () => setStartActivity(false);

  return (
    <Container fluid>
      <Row className="ds-applet-layout">
        <Col sm={3}>
          <Card className="ds-card">
            {currentApplet.image &&
              <Card.Img
                className="ds-shadow"
                variant="top"
                src={currentApplet.image}
              />
            }
            {!currentApplet.image &&
              <Avatar
                name={currentApplet.name.en}
                maxInitials={2}
                color="#777"
                size="238"
                round="3px"
              />
            }
            <Card.Body className="ds-card-title">
              <Card.Title className="text-center">
                {currentApplet.name.en}
              </Card.Title>
              <Button
                className="ds-shadow ds-about-button"
                onClick={openAboutPage}
                variant="link"
              >
                {`About Page`}
              </Button>
            </Card.Body>
          </Card>
          <AboutModal
            aboutPage={aboutPage}
            markdown={markdown}
            closeAboutPage={closeAboutPage}
          />
        </Col>
        <Col sm={1} />
        <Col sm={8}>
          {activities.map(activity => (
            <ActivityItem
              activity={activity}
              onPress={() => onPressActivity(activity)}
              disabled={activity.status === 'scheduled' && !activity.event.data.timeout.access}
              key={activity.id ? activity.id : activity.text}
            />
          ))}

        </Col>
      </Row>
      <Modal show={startActivity} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Resume Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>Would you like to resume this activity in progress or restart?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRestartActivity}>
            Restart
          </Button>
          <Button variant="primary" onClick={handleResumeActivity}>
            Resume
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    inProgress: inProgressSelector(state),
    finishedEvents: finishedEventsSelector(state),
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityList);
