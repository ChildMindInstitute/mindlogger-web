import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { PDFExport } from '@progress/kendo-react-pdf';
import styled from 'styled-components';
import cn from 'classnames';
import _ from 'lodash';

// Component
import MyButton from '../components/Button';
import Markdown from '../components/Markdown';

// State
import { inProgressSelector } from '../state/responses/responses.selectors';
import { setCumulativeActivities, setHiddenCumulativeActivities } from '../state/applet/applet.reducer';
import { appletCumulativeActivities, appletHiddenCumulativeActivities } from '../state/applet/applet.selectors';

// services
import { evaluateCumulatives } from '../services/scoring';

const MARKDOWN_REGEX = /(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g;
const termsText =
  'I understand that the information provided by this questionnaire is not intended to replace the advice, diagnosis, or treatment offered by a medical or mental health professional, and that my anonymous responses may be used and shared for general research on children’s mental health.';
const footerText =
  'CHILD MIND INSTITUTE, INC. AND CHILD MIND MEDICAL PRACTICE, PLLC (TOGETHER, “CMI”) DOES NOT DIRECTLY OR INDIRECTLY PRACTICE MEDICINE OR DISPENSE MEDICAL ADVICE AS PART OF THIS QUESTIONNAIRE. CMI ASSUMES NO LIABILITY FOR ANY DIAGNOSIS, TREATMENT, DECISION MADE, OR ACTION TAKEN IN RELIANCE UPON INFORMATION PROVIDED BY THIS QUESTIONNAIRE, AND ASSUMES NO RESPONSIBILITY FOR YOUR USE OF THIS QUESTIONNAIRE.';

const Summary = styled(({ className, ...props }) => {
  const { appletId, activityId } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [activity, setActivity] = useState({});

  const dispatch = useDispatch();

  const response = useSelector(inProgressSelector);
  const cumulativeActivities = useSelector(appletCumulativeActivities);
  const hiddenCumulativeActivities = useSelector(appletHiddenCumulativeActivities);

  const pdfRef = useRef(null);

  useEffect(() => {
    if (response[`activity/${activityId}`]) {
      const { responses, activity } = response[`activity/${activityId}`];
      setActivity(activity);

      if (responses && responses.length > 0) {
        let { cumActivities, reportMessages } = evaluateCumulatives(responses, activity);

        if (cumulativeActivities && cumulativeActivities[`${activity.id}/nextActivity`]) {
          cumActivities = _.difference(cumActivities, cumulativeActivities[`${activity.id}/nextActivity`]);
          if (cumActivities.length > 0) {
            cumActivities = [...cumulativeActivities[`${activity.id}/nextActivity`], ...cumActivities];
            dispatch(setCumulativeActivities({ [`${activity.id}/nextActivity`]: cumActivities }));
          }
          if (!hiddenCumulativeActivities?.includes(activity.id)) dispatch(setHiddenCumulativeActivities(activity.id));
        } else {
          dispatch(setCumulativeActivities({ [`${activity.id}/nextActivity`]: cumActivities }));
          if (cumActivities.length > 0 && !hiddenCumulativeActivities?.includes(activity.id))
            dispatch(setHiddenCumulativeActivities(activity.id));
        }

        setMessages(reportMessages);
      }
    }
  }, [response && Object.keys(response).length > 1]);

  return (
    <Card className={cn('mb-3', className)}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            <div className="mb-4">
              <Markdown markdown={_.get(activity, 'scoreOverview', '').replace(MARKDOWN_REGEX, '$1$2')} />
            </div>
            {messages &&
              messages.map((item, i) => (
                <div key={i}>
                  <h1>{item.category.replace(/_/g, ' ')}</h1>
                  <div className="mb-4">
                    <Markdown markdown={_.get(item, 'compute.description', '').replace(MARKDOWN_REGEX, '$1$2')} />
                  </div>
                  <h3>{item.score}</h3>
                  <Markdown markdown={item.message.replace(MARKDOWN_REGEX, '$1$2')} />
                  {messages.length > 1 && <div className="hr" />}
                </div>
              ))}
          </Card.Body>
        </Col>
      </Row>
      <div>
        <div className="pdf-container">
          <PDFExport paperSize="A4" margin="2cm" ref={pdfRef}>
            <p className="mb-4">
              <b>
                <u>{_.get(activity, 'name.en')} Report</u>
              </b>
            </p>
            <div className="mb-4">
              <Markdown useCORS={true} markdown={_.get(activity, 'scoreOverview', '').replace(MARKDOWN_REGEX, '$1$2')} />
            </div>
            {messages &&
              messages.map((item, i) => (
                <div key={i}>
                  <p className="text-primary mb-1">
                    <b>{item.category.replace(/_/g, ' ')}</b>
                  </p>
                  <div className="mb-4">
                    <Markdown
                      markdown={_.get(item, 'compute.description', '').replace(MARKDOWN_REGEX, '$1$2')}
                      useCORS={true}
                    />
                  </div>
                  <div className="score-area">
                    <p
                      className="score-title text-nowrap"
                      style={{
                        left: `max(75px, ${(item.scoreValue / item.maxScoreValue) * 100}%)`,
                      }}>
                      <b>Your/Your Child’s Score</b>
                    </p>
                    <div
                      className={cn('score-bar score-below', {
                        'score-positive': item.compute.direction,
                        'score-negative': !item.compute.direction,
                      })}
                      style={{ width: `${(item.exprValue / item.maxScoreValue) * 100}%` }}
                    />
                    <div
                      className={cn('score-bar score-above', {
                        'score-positive': !item.compute.direction,
                        'score-negative': item.compute.direction,
                      })}
                    />
                    <div
                      className="score-spliter"
                      style={{ left: `${(item.scoreValue / item.maxScoreValue) * 100}%` }}
                    />
                    <p className="score-max-value">
                      <b>{item.maxScoreValue}</b>
                    </p>
                  </div>
                  <p className="text-uppercase mb-1">
                    <b>
                      <i>
                        If score
                        <span className="ml-2">{item.jsExpression}</span>
                      </i>
                    </b>
                  </p>

                  <div className="mb-4">
                    Your/Your child's score on the {item.category.replace(/_/g, ' ')} subscale was{' '}
                    <span className="text-danger">{item.scoreValue}</span>.
                    <Markdown
                      markdown={item.message.replace(MARKDOWN_REGEX, '$1$2')}
                      useCORS={true}
                    />
                  </div>
                </div>
              ))}
            <p className="mb-5">{termsText}</p>
            <p>{footerText}</p>
          </PDFExport>
        </div>
        <MyButton
          type="submit"
          label={t('Consent.next')}
          classes="mr-5 mb-2 float-right"
          handleClick={(e) => history.push(`/applet/${appletId}/activity_thanks`)}
        />
        <MyButton
          type="button"
          label={t('additional.share_report')}
          classes="mr-5 mb-2 float-right"
          handleClick={(e) => pdfRef.current && pdfRef.current.save()}
        />
      </div>
    </Card>
  );
})`
  .pdf-container {
    max-width: 1000px;
    position: absolute;
    left: -2000px;
    top: 0;
    font-size: 10pt;
    font-family: Arial, Helvetica, sans-serif;
  }
  .score-area {
    position: relative;
    display: flex;
    width: 300px;
    padding: 50px 0 30px;

    .score-bar {
      height: 40px;
    }
    .score-positive {
      background-color: #a1cd63;
    }
    .score-negative {
      background-color: #b02318;
    }
    .score-above {
      flex: 1;
    }
    .score-spliter {
      position: absolute;
      top: 30px;
      width: 3px;
      height: 80px;
      background-color: #000;
    }
    .score-title {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
    }
    .score-max-value {
      position: absolute;
      margin: 0;
      right: 0;
      bottom: 0;
    }
  }
  img {
    max-width: 100%;
  }
`;

export default Summary;
