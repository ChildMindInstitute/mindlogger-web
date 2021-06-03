/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useSelector, connect, useDispatch } from 'react-redux'
import {
  Container,
  Card,
  Button,
  Row,
  Col,
} from 'react-bootstrap'
import Avatar from 'react-avatar';

// Local
import { delayedExec, clearExec } from '../../util/interval';
import sortActivities from './sortActivities';
import { inProgressSelector } from '../../state/responses/responses.selectors';
import { finishedEventsSelector } from '../../state/app/app.selectors';
import { appletsSelector } from '../../state/applet/applet.selectors';
import { setCurrentActivity } from '../../state/app/app.reducer';
import { parseAppletEvents } from '../../services/json-ld';

import AboutModal from '../AboutModal';
import ActivityItem from './ActivityItem';

import './style.css'

export const ActivityList = ({ inProgress, finishedEvents }) => {
  const { appletId } = useParams();
  const applets = useSelector(appletsSelector);
  const history = useHistory();
  const dispatch = useDispatch();
  const [aboutPage, showAboutPage] = useState(false);
  const [activities, setActivities] = useState([]);
  const [prizeActivity, setPrizeActivity] = useState(null);
  const [markdown, setMarkDown] = useState("");
  const [currentApplet] = useState(applets.find(({ id }) => id.includes(appletId)));
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
    const appletActivities = appletData.activities.filter(act => !act.isPrize);
    const prizeActs = appletData.activities.filter(act => act.isPrize);

    if (prizeActs.length === 1) {
      setPrizeActivity(prizeActs[0]);
    }

    const temp = sortActivities(appletActivities, inProgress, finishedEvents, currentApplet.schedule.data);
    setActivities(temp);
  }

  const onPressActivity = (activity) => {
    dispatch(setCurrentActivity(activity.id));

    history.push(`/applet/${appletId}/${activity.id}`);
  }
  const closeAboutPage = () => showAboutPage(false);
  const openAboutPage = () => showAboutPage(true);

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
              key={activity.id}
            />
          ))}

        </Col>
      </Row>
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
