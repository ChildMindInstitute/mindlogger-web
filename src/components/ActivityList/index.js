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
import { inProgressSelector } from '../../state/responses/responses.selectors';
import { finishedEventsSelector, startedTimesSelector } from '../../state/app/app.selectors';
import { appletCumulativeActivities, appletsSelector } from '../../state/applet/applet.selectors';
import { setActivityStartTime, setCurrentActivity, } from '../../state/app/app.reducer';
import { setCurrentEvent } from '../../state/responses/responses.reducer';
import { createResponseInProgress } from '../../state/responses/responses.reducer';
import { parseAppletEvents } from '../../services/json-ld';
import { getActivityAvailabilityFromDependency } from '../../services/helper';

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
  const [recommendedActivities, setRecommendedActivities] = useState([]);
  const [currentAct, setCurrentAct] = useState({});
  const [markdown, setMarkDown] = useState("");
  const [currentApplet] = useState(applets.find((applet) =>
    appletId && applet.id.includes(appletId) ||
    publicId && applet.publicId && applet.publicId.includes(publicId)
  ));
  const startedTimes = useSelector(startedTimesSelector);

  const user = useSelector(state => R.path(['user', 'info'])(state));
  const updateStatusDelay = 60 * 1000;
  const appletData = parseAppletEvents(currentApplet);

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

    if (currentApplet) {
      fetchMarkDown();
      updateActivites();
    }
  }, []);

  useEffect(() => {
    if (currentApplet) {
      updateActivites();
    }

    let updateId;
    const leftTime = (60 - new Date().getSeconds()) * 1000;
    const leftOutId = delayedExec(
      () => {
        if (currentApplet) {
          updateActivites();
        }
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
    const convertToIndexes = (activities) => activities
      ?.map(id => {
        const index = appletData.activities.findIndex(activity => activity.id.split('/').pop() == id)
        return index;
      })
      ?.filter(index => index >= 0)
  
    let { appletActivities, recommendedActivities } = getActivityAvailabilityFromDependency(
      appletData.activities,
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
            || item.inputType === "duration"
            || item.inputType === "text"
            || item.inputType === "dropdownList";
        });

        return supportedItems.length > 0;
      })
    setRecommendedActivities(recommendedActivities);
    setActivities(_.uniq(sortActivities(appletActivities, inProgress, finishedEvents, currentApplet.schedule?.data), "id"));
  }
  const onPressActivity = (activity) => {
    if (activity.status === "in-progress") {
      setCurrentAct(activity);
      setStartActivity(true);
    } else {
      if (activity.event
        && activity.event.data.timedActivity
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
      && activity.event.data.timedActivity
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

  const getRecomendedActivity = (activityId) => {
    const availableCumulativeActivities = cumulativeActivities[appletData.id]?.available;
    return availableCumulativeActivities?.length &&
      availableCumulativeActivities[availableCumulativeActivities?.length - 1] === activityId?.split('/').pop()
  }

  return (
    <Container fluid>
      {
        currentApplet && !currentApplet.isIgnore && (
          <Row className="ds-applet-layout">
            <Col lg={1} />
            <Col lg={3}>
              <Card className="ds-card">
                <div className="applet-header">
                  <div className="applet-image">
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
                        size="240"
                        round="3px"
                      />
                    }
                  </div>
                </div>

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
                  isRecommended={recommendedActivities?.includes(activity.id)}
                  disabled={activity.status === 'scheduled' && !activity.event.data.timeout.access}
                  key={activity.id ? activity.id : activity.text}
                />
              ))}

            </Col>
          </Row>
        ) || (
          <div className="applet-error">You have reached this URL in error. Please reach out to the organizer of this applet for further assistance.</div>
        )
      }
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
