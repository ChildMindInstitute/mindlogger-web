/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, connect, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Card,
  Button,
  Modal,
  Row,
  Col,
} from 'react-bootstrap'
import _ from 'lodash';
import * as R from 'ramda';
import Avatar from 'react-avatar';

// Local
import sortActivities from './sortActivities';
import { delayedExec, clearExec } from '../../util/interval';
import { inProgressSelector, currentScreenIndexSelector } from '../../state/responses/responses.selectors';
import { finishedEventsSelector, startedTimesSelector } from '../../state/app/app.selectors';
import { appletCumulativeActivities, appletsSelector } from '../../state/applet/applet.selectors';
import { setActivityStartTime, setCurrentActivity, } from '../../state/app/app.reducer';
import { setCurrentEvent } from '../../state/responses/responses.reducer';
import { createResponseInProgress, setAnswer } from '../../state/responses/responses.reducer';
import { parseAppletEvents } from '../../services/json-ld';

import AboutModal from '../AboutModal';
import ActivityItem from './ActivityItem';

import './style.css'

export const ActivityList = ({ inProgress, finishedEvents }) => {
  const { appletId, publicId } = useParams();
  const applets = useSelector(appletsSelector);
  const cumulativeActivities = useSelector(appletCumulativeActivities);
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [aboutPage, showAboutPage] = useState(false);
  const [startActivity, setStartActivity] = useState(false);
  const [activities, setActivities] = useState([]);
  const [currentAct, setCurrentAct] = useState({});
  const [prizeActivity, setPrizeActivity] = useState(null);
  const [markdown, setMarkDown] = useState("");
  const [currentApplet] = useState(applets.find((applet) =>
    appletId && applet.id.includes(appletId) ||
    publicId && applet.publicId && applet.publicId.includes(publicId)
  ));
  const screenIndex = useSelector(currentScreenIndexSelector);
  const startedTimes = useSelector(startedTimesSelector);

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
        setMarkDown(t('no_markdown'));
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

  const findActivityFromName = (activities, name) => {
    return activities.findIndex(activity => activity.name.en == name)
  }

  const getActivityAvailabilityFromDependency = (g, availableActivities = [], archievedActivities = []) => {
    const marked = [], activities = [];
    let markedCount = 0;

    for (let i = 0; i < g.length; i++) {
      marked.push(false)
    }

    for (let index of availableActivities) {
      markedCount++;
      marked[index] = true;
      activities.push(index);
    }

    for (let index of archievedActivities) {
      if (!marked[index]) {
        marked[index] = true;
        markedCount++;
      }
    }

    for (let i = 0; i < g.length; i++) {
      if (!g[i].length && !marked[i]) {
        activities.push(i);
        markedCount++;
        marked[i] = true;
      }
    }

    while ( markedCount < g.length ) {
      let updated = false;

      for (let i = 0; i < g.length; i++) {
        if (!marked[i] && g[i].some(dependency => marked[dependency])) {
          marked[i] = true;
          markedCount++;
          updated = true;
        }
      }

      if (!updated) {
        // in case of a circular dependency exists
        for (let i = 0; i < g.length; i++) {
          if (!marked[i]) {
            marked[i] = true;
            markedCount++;
            activities.push(i);
            break;
          }
        }
      }
    }

    return activities;
  }


  const updateActivites = () => {
    const appletData = parseAppletEvents(currentApplet);
    const prizeActs = appletData.activities.filter(act => act.isPrize);

    if (prizeActs.length === 1) {
      setPrizeActivity(prizeActs[0]);
    }

    const dependency = []

    for (let i = 0; i < appletData.activities.length; i++) {
      dependency.push([])
    }

    for (let i = 0; i < appletData.activities.length; i++) {
      const activity = appletData.activities[i];

      if (activity.messages) {
        for (const message of activity.messages) {
          if (message.nextActivity) {
            const index = findActivityFromName(appletData.activities, message.nextActivity)
            if (index >= 0) {
              dependency[index].push(i);
            }
          }
        }
      }
    }

    const convertToIndexes = (activities) => activities
      ?.map(id => {
        const index = appletData.activities.findIndex(activity => activity.id.split('/').pop() == id)
        return index;
      })
      ?.filter(index => index >= 0)

    let appletActivities = getActivityAvailabilityFromDependency(
      dependency,
      convertToIndexes(cumulativeActivities[appletData.id]?.available),
      convertToIndexes(cumulativeActivities[appletData.id]?.archieved)
    )

    appletActivities = appletActivities
      .map(index => appletData.activities[index])
      .filter(
        activity =>
          activity.isPrize != true &&
          !activity.isVis && activity.isReviewerActivity != true
      )
      .filter(activity => {
        const supportedItems = activity.items.filter(item => {
          return item.inputType === "radio"
            || item.inputType === "checkox"
            || item.inputType === "slider"
            || item.inputType === "ageSelector"
            || item.inputType === "text";
        });

        return supportedItems.length > 0;
      })

    setActivities(sortActivities(appletActivities, inProgress, finishedEvents, currentApplet.schedule?.data));
  }

  const checkActivityIsShown = (name, messages) => {
    if (!name || !messages) return true;
    return _.findIndex(messages, { nextActivity: name }) === -1;
  }

  const onPressActivity = (activity) => {
    if (activity.status === "in-progress") {
      setCurrentAct(activity);
      setStartActivity(true);
    } else {
      if (activity.event
        && activity.event.data.timedActivity.allow
        && startedTimes
        && !startedTimes[activity.id + activity.event.id]
      ) {
        dispatch(setActivityStartTime(activity.id + activity.event.id));
      }
      dispatch(createResponseInProgress({
        activity: activity,
        event: activity.event,
        subjectId: user && user._id,
        publicId: currentApplet.publicId || null,
        timeStarted: new Date().getTime()
      }));

      dispatch(setCurrentActivity(activity));

      if (currentApplet.publicId) {
        history.push(`/applet/public/${currentApplet.id.split('/').pop()}/${activity.id}`);
      } else {
        history.push(`/applet/${appletId}/${activity.id}`);
      }
    }
  }

  const handleResumeActivity = () => {
    const activity = currentAct;

    dispatch(setCurrentActivity(activity));
    dispatch(setCurrentEvent(activity.event ? activity.event.id : ''));

    if (activity.event
      && activity.event.data.timedActivity.allow
      && startedTimes
      && !startedTimes[activity.id + activity.event.id]
    ) {
      dispatch(setActivityStartTime(activity.id + activity.event.id));
    }

    if (currentApplet.publicId) {
      history.push(`/applet/public/${currentApplet.id.split('/').pop()}/${activity.id}`);
    } else {
      history.push(`/applet/${appletId}/${activity.id}`);
    }
    setStartActivity(false);
  }

  const handleRestartActivity = () => {
    const activity = currentAct;

    dispatch(setCurrentActivity(activity));
    dispatch(createResponseInProgress({
      activity: activity,
      event: activity.event,
      subjectId: user?._id,
      publicId: currentApplet.publicId || null,
      timeStarted: new Date().getTime()
    }));

    if (activity.event
      && activity.event.data.timedActivity.allow
      && startedTimes
      && !startedTimes[activity.id + activity.event.id]
    ) {
      dispatch(setActivityStartTime(activity.id + activity.event.id));
    }

    if (currentApplet.publicId) {
      history.push(`/applet/public/${currentApplet.id.split('/').pop()}/${activity.id}`);
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
        <Col lg={1} />
        <Col lg={3}>
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
                {t('About.about')}
              </Button>
            </Card.Body>
          </Card>
          <AboutModal
            aboutPage={aboutPage}
            aboutType={currentApplet.aboutType}
            markdown={markdown}
            closeAboutPage={closeAboutPage}
          />
        </Col>
        <Col lg={7}>
          {activities.filter(activity => !activity.isReviewerActivity).map(activity => (
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
          <Modal.Title>{t('additional.resume_activity')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('additional.activity_resume_restart')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRestartActivity}>
            {t('additional.restart')}
          </Button>
          <Button variant="primary" onClick={handleResumeActivity}>
            {t('additional.resume')}
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
