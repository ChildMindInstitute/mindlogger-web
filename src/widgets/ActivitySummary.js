import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { PDFExport } from '@progress/kendo-react-pdf';
import styled from 'styled-components';
import cn from 'classnames';
import _ from 'lodash';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Component
import MyButton from '../components/Button';
import Markdown from '../components/Markdown';

// State
import { inProgressSelector } from '../state/responses/responses.selectors';

// services
import { evaluateCumulatives } from '../services/scoring';
import { currentActivitySelector, currentAppletSelector } from '../state/app/app.selectors';

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

  const applet = useSelector(currentAppletSelector);
  const response = useSelector(inProgressSelector);
  const activityAccess = useSelector(currentActivitySelector);
  let url = "";

  const pdfRef = useRef(null);
  const ref = React.createRef();

  if (activity.splash && activity.splash.en) {
    url = activity.splash.en;
  }

  useEffect(() => {
    try {
      if (response[`activity/${activityId}`]) updateActivity(response[`activity/${activityId}`]);
    } catch (error) {
      console.log(error);
    }
    if (activityAccess?.disableSummary) history.push(`/applet/${appletId}/activity_thanks`);
  }, [response && Object.keys(response).length > 1]);

  const updateActivity = (response = {}) => {
    const { responses, activity } = response;
    setActivity(activity);

    if (responses && responses.length > 0) {
      const { reportMessages } = evaluateCumulatives(responses, activity);

      setMessages(reportMessages);
    }
  }

  const findActivity = (name, activities = []) => {
    if (!name) return undefined;
    return _.find(activities, { name: { en: name } });
  }

  const handlePDFSave = () => {
    const isIOSSafari = !!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    if (isIOSSafari) {
      html2canvas(document.body.querySelector('#PDF')).then(canvas => {
        document.body.appendChild(canvas);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4', false);
        pdf.addImage(imgData, 'PNG', 30, 50, 500, 0, undefined, false);
        pdf.save("export.pdf");
      });
    } else
      pdfRef.current && pdfRef.current.save();
  }

  if (activityAccess.disableSummary) return <div />;

  return (
    <Card className={cn('mb-3', className)}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            {messages &&
              messages.map((item, i) => (
                <div key={i}>
                  <h1>{item.category.replace(/_/g, ' ')}</h1>
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
          <PDFExport 
            paperSize="A4" 
            forcePageBreak=".page-break"
            margin="2cm"
            ref={pdfRef}
          >
            <div id="PDF" ref={ref}>
              {url.match(/\.(jpeg|jpg|gif|png)$/) != null &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={url + '?not-from-cache-please'}
                    style={{ objectFit: 'contain', height: '20%', marginTop: '40%' }}
                    crossOrigin="anonymous"
                    alt=''
                  />
                  <div className="page-break" />
                </div>
              }
              {applet.image &&
                <div style={{ float: 'right', marginBottom: 10 }}>
                  <img
                    src={applet.image + '?not-from-cache-please'}
                    style={{ objectFit: 'contain' }}
                    width="100"
                    height="100"
                    crossOrigin="anonymous"
                    alt=''
                  />
                </div>
              }
             
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
                        <b>Your Child's Score</b>
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
                    <div className="mb-4">
                      Your child's score on the {item.category.replace(/_/g, ' ')} subscale was{' '}
                      <span className="text-danger">{item.scoreValue}</span>.
                      <Markdown
                        markdown={item.message.replace(MARKDOWN_REGEX, '$1$2')}
                        useCORS={true}
                      />
                    </div>
                  </div>
                ))} 
              <div style={{ border: '1px solid black' }} className="mb-4"></div>
              <p className="mb-4">{termsText}</p>
              <p>{footerText}</p>
            </div>
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
          handleClick={(e) => handlePDFSave()}
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
    .divider-line {
      border-top: 1px solid black;
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
