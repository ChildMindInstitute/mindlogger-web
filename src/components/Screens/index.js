import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card, Row, Col, Modal, Button, ProgressBar } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useTranslation } from 'react-i18next';
import { BsArrowLeft } from "react-icons/bs";
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
  const [alert, setAlert] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [isSplashScreen, setIsSplashScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryScreen, setIsSummaryScreen] = useState(false);

  const applet = useSelector(currentAppletSelector);
  const answer = useSelector(currentScreenResponseSelector);
  const progress = useSelector(inProgressSelector);
  const user = useSelector(userInfoSelector);
  const lastResponseTimes = useSelector(lastResponseTimeSelector) || {};
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

  const [errors, setErrors] = useState([]);

  const validateResponses = (responses) => {
    if (!errors.length) {
      for (let i = 0; i < activityAccess.items.length; i++) {
        errors.push(false);
      }
    }

    for (let i = 0; i < activityAccess.items.length; i++) {
      const item = activityAccess.items[i];
      const response = responses && responses[i];
      if (response) {
        if (item.inputType == 'text') {
          if (item.correctAnswer && item.correctAnswer.en && item.correctAnswer.en !== response) {
            errors[i] = true;
            continue;
          }
        } else if (item.inputType == 'radio' && item.valueConstraints?.multipleChoice) {
          if (!response.value.length && !item.skippable && !activityAccess.skippable) {
            errors[i] = true;
            continue;
          }
        } else if (item.inputType == 'ageSelector') {
          if (!response.value.length) {
            errors[i] = true;
            continue;
          }
        }
      }

      errors[i] = !item.skippable && !activityAccess.skippable && !response;
    }

    setErrors(errors);
  }

  useEffect(() => validateResponses(inProgress?.responses), []);

  useEffect(() => {
    if (activityAccess.splash
      && activityAccess.splash.en
      && currentScreenIndex === 0
      && !activityAccess.isOnePageAssessment
    ) {
      setIsSplashScreen(true);
    }
    if (inProgress && Object.keys(inProgress).length > 0) {
      const { activity, responses } = inProgress;
      const newHeaders = [];
      let obj = data;

      activity.items.forEach((item, index) => {
        if (item.header) {
          newHeaders.push({
            id: index,
            headerName: item.header
          })
        } else if (item.section) {
          newHeaders.push({
            id: index,
            sectionName: item.section
          });
        }
      })

      responses.forEach((val, i) => {
        const { variableName } = activity.items[i];
        obj = { ...obj, [variableName]: val && val.value };
      })
      setHeaders(newHeaders);
      setData(obj);
    }
  }, [])

  const finishResponse = async () => {
    setIsLoading(true);
    await dispatch(completeResponse(false));
    setIsLoading(false);
    const { activity } = inProgress;
    clearActivityStartTime(activity.event ? activity.id + activity.event.id : activity.id)

    if (activityAccess.compute?.length > 0 && !isSummaryScreen) {
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

    if (isSplashScreen) {
      setIsSplashScreen(false);
      return;
    }
    if (e.value || e.value === 0) {
      let responses = [...inProgress?.responses];
      responses[screenIndex] = e.value;

      [currentNext] = getVisibility(responses);
    }

    dispatch(setEndTime({ activityId: activityAccess.id, screenIndex: screenIndex }));

    if (currentNext === -1 || isOnePageAssessment) {
      if (errors.includes(true) && isOnePageAssessment) {
        setShowErrors(true);
        setAlert(true);
      } else {
        setShowErrors(false);
        setShow(true);
      }
    } else if (!isOnePageAssessment) {
      // Go to next item:
      dispatch(
        setCurrentScreen({
          activityId: activityAccess.id,
          screenIndex: currentNext
        })
      )
    }
  }

  const selectHeader = (itemId) => {
    dispatch(
      setCurrentScreen({
        activityId: activityAccess.id,
        screenIndex: itemId
      })
    );
  }

  const handleChange = (answer, index) => {
    let responses = [...inProgress?.responses];
    responses[index] = answer;

    dispatch(
      setAnswer({
        activityId: activityAccess.id,
        screenIndex: index,
        answer
      })
    )

    validateResponses(responses);
  }

  const handleBackScreen = () => {
    history.push(`/applet/${appletId}/dashboard`);
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

  let availableItems = 0, isOnePageAssessment = activityAccess.isOnePageAssessment;
  const activityStatus = getPercentages(applet.activities.filter(({ id }) => id !== activityAccess.id), progress);
  const percentage = screenIndex ?
    screenIndex / activityAccess.items.length * 100
    : 0;

  if (activityAccess.splash && activityAccess.splash.en) {
    availableItems += 1;
    items.push(
      <Item
        type={`splash`}
        watermark={applet.watermark}
        splashScreen={activityAccess.splash.en}
        handleSubmit={handleNext}
        handleChange={handleChange}
        handleBack={handleBack}
        isSubmitShown={next === -1}
        isBackShown={false}
        isNextShown={isSplashScreen}
        isOnePageAssessment={isOnePageAssessment}
        invalid={false}
        activity={activityAccess}
        answers={inProgress?.responses}
      />
    );
  }

  activityAccess.items.forEach((item, i) => {
    const isVisible = item.isVis ? false : testVisibility(
      item.visibility,
      activityAccess.items,
      inProgress?.responses,
      responseTimes
    );

    if (isVisible) {
      if (screenIndex >= i && !isSplashScreen) {
        availableItems += 1;
      }
      items.push(
        <Item
          data={data}
          type={item.inputType === "radio" && item.valueConstraints.multipleChoice ? "checkbox" : item.inputType}
          watermark={screenIndex === i ? applet.watermark : ''}
          key={item.id}
          item={{
            ...item,
            skippable: item.skippable || activityAccess.skippable
          }}
          handleSubmit={handleNext}
          handleChange={(answer, valid) => {
            handleChange(answer, i);
          }}
          handleBack={handleBack}
          isSubmitShown={isOnePageAssessment && activityAccess.items.length == i+1 || next === -1}
          answer={inProgress?.responses[i]}
          activity={activityAccess}
          answers={inProgress?.responses}
          isBackShown={screenIndex === i && i && prev >= 0}
          isNextShown={isOnePageAssessment || screenIndex === i}
          isOnePageAssessment={isOnePageAssessment}
          invalid={showErrors && errors.length && errors[i]}
        />
      );
    }
  });

  return (
    <Container>
      {
        !isOnePageAssessment && (
          <Row className="mt-5">
            <Col className="" xl={3} >
              <Button variant="primary" className="ml-2" onClick={() => handleBackScreen()}>
                <BsArrowLeft className="mr-1" />
                {t('Consent.back')}
              </Button>
            </Col>
            <Col xl={9} >
              <Card className="bg-white p-2" >
                <ProgressBar striped className="mb-2" now={percentage} />
              </Card>
            </Col>
          </Row>
        ) || <></>
      }
      <Row className="mt-2 activity">
        <Col xl={3}>
          <Card className="ds-card hover text-center mb-4">
            <div className="applet-header">
              <div className="applet-image">
                {applet.image ?
                  <Card.Img variant="top" src={applet.image} className="rounded border w-h" />
                  :
                  <Avatar name={applet.name.en} maxInitials={2} color="#777" size="238" round="3px" />
                }
              </div>
            </div>
            <Card.Body>
              <Card.Text>{applet.name.en}</Card.Text>
            </Card.Body>
          </Card>

          {headers.map(itemHeader =>
            <div className="mx-4">
              {itemHeader.headerName &&
                <div onClick={() => selectHeader(itemHeader.id)} className="mt-1 header-text">
                  {itemHeader.headerName}
                </div>
              }
              {itemHeader.sectionName &&
                <div onClick={() => selectHeader(itemHeader.id)} className="ml-4 section-text">
                  {` - ${itemHeader.sectionName}`}
                </div>
              }
            </div>
          )}

          {activityStatus.map(status =>
            <div className="my-2 rounded border w-h p-2 text-center bg-white">
              <div className="mb-2">{status.label}</div>
              <ProgressBar className="mb-2" now={status.percentage} />
            </div>
          )}
        </Col>
        <Col xl={9}>
          {isSummaryScreen ?
            <ActivitySummary {...props} />
            :
            isOnePageAssessment ? items : _.map(items.slice(0, availableItems).reverse())
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

      <Modal show={alert} onHide={() => setAlert(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('additional.response_submit')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {t('additional.fill_out_fields')}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setAlert(false)}
          >{t('additional.okay')}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Screens;
