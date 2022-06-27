import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { PDFExport } from '@progress/kendo-react-pdf';
import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import moment from "moment";

import styled from 'styled-components';
import cn from 'classnames';
import _ from 'lodash';
import domtoimage from 'dom-to-image';

// Component
import MyButton from '../components/Button';
import Markdown from '../components/Markdown';
import SummaryAlert from '../components/SummaryAlert';

// State
import { inProgressSelector, currentAppletResponsesSelector, currentAlertsSelector } from '../state/responses/responses.selectors';

// services
import { evaluateCumulatives, evaluateReports } from '../services/scoring';
import { getChainedActivities, replaceItemVariableWithScore } from '../services/helper';
import { currentActivitySelector, currentAppletSelector } from '../state/app/app.selectors';

const MARKDOWN_REGEX = /(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g;

const Summary = styled(({ className, ...props }) => {
  const { appletId, activityId } = useParams();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [reports, setReports] = useState([]);
  const [titleWidth, setTitleWidth] = useState(0);
  const [shareAllReports, setShareAllReports] = useState(false);
  const [, setRefresh] = useState(0);
  const { messages, ...restAct } = reports.find(report => report.activity.id.split('/').pop() == activityId) || { messages: [] };

  const responseHistory = useSelector(currentAppletResponsesSelector);
  const applet = useSelector(currentAppletSelector);
  const response = useSelector(inProgressSelector);
  const activityAccess = useSelector(currentActivitySelector);
  const alerts = useSelector(currentAlertsSelector);

  const ref = useRef(null);
  const images = useRef({});

  const termsText = t("additional.terms_text")
  const footerText = t("additional.footer_text");

  useEffect(() => {
    const el = document.getElementById('score-title');

    if (el) {
      setTitleWidth(el.offsetWidth);
    }

  }, [lang])

  useEffect(() => {
    if (titleWidth && reports.length) {
      const items = ['footer-text'];
      for (const report of reports) {
        const { messages, activity } = report;

        for (let i = 0; i < messages.length; i++) {
          items.push(`message-${activity.id}-${i}`);
        }

        items.push(`overview-${activity.id}`);
      }

      Promise.all(items.map(id => {
        const pdfContent = document.getElementById(id);

        return domtoimage.toJpeg(pdfContent, { quality: 1 })
          .then((dataUrl) => {
            images.current[id] = dataUrl;
          })
      })).then(() => setRefresh(Date.now()));
    }
  }, [titleWidth, reports])

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
    let chained = applet.combineReports ? getChainedActivities(applet.activities, activity) : [activity];
    let reports = [];

    for (let chainedActivity of chained) {
      let lastResponse = [];

      if (activity.id == chainedActivity.id) {
        lastResponse = responses;
      } else {
        for (let item of chainedActivity.items) {
          const itemResponses = responseHistory.responses[item.schema];

          if (itemResponses && itemResponses.length) {
            lastResponse.push(itemResponses[itemResponses.length - 1]);
          } else {
            lastResponse.push(null);
          }
        }
      }

      let { reportMessages, scoreOverview } = evaluateReports(lastResponse, chainedActivity);

      reports.push({
        activity: chainedActivity,
        messages: reportMessages,
        scoreOverview
      });
    }

    setReports(reports);
  }

  const handlePDFSave = () => {
    if (ref.current) {
      drawDOM(ref.current, {
        paperSize: 'A4',
        margin: '2cm',
        forcePageBreak: '.page-break'
      }).then(group => exportPDF(group)).then(dataUri => {
        var byteString = atob(dataUri.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        var file = new Blob([ab], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);

        const anchor = document.createElement('a');
        anchor.href = fileURL;
        anchor.download = 'export.pdf';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      })
    }
  }

  if (activityAccess.disableSummary) return <div />;

  return (
    <Card className={cn('mb-3', className)}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Header>
            <h2>Report Summary</h2>
          </Card.Header>
        </Col>
        <Col md={12}>
          <Card.Body>
            {alerts && alerts.length ?
              <SummaryAlert text={alerts.map(al => al.message)} /> : <></>
            }
            {messages &&
              messages.map((item, i) => (
                <div key={i}>
                  <div className="row">
                    <div className="col-md-9">
                      <p className="message-category">{item.label ? item.label : item.category.replace(/_/g, ' ')}</p>
                      <Markdown markdown={replaceItemVariableWithScore(item.message, messages).replace(`[[${item.category}]]`, item.score).replace(MARKDOWN_REGEX, '$1$2').replace(/\[\[sys.date]\]/i, moment().format('MM/DD/YYYY'))} />
                    </div>
                    {typeof item.scoreValue !== "boolean" && <div className="col-md-3"><p className="message-score float-right">{item.score}</p></div>}
                    {item.conditionals?.map((conditional) => (
                        <div className={`col-md-10 ${conditional.flagScore ? 'text-danger' : ""}`} >
                          <p className="message-category">{conditional.label}</p>
                          <Markdown markdown={replaceItemVariableWithScore(conditional.message, messages).replace(MARKDOWN_REGEX, '$1$2').replace(/\[\[sys.date]\]/i, moment().format('MM/DD/YYYY'))} />
                        </div>
                    ))}
                  </div>
                  {messages.length > 1 && <div className="hr" />}
                </div>
              ))}
          </Card.Body>
        </Col>
      </Row>
      <div>
        <MyButton
          type="submit"
          label={t('Consent.next')}
          classes="mr-5 mb-2 float-right"
          handleClick={(e) => history.push(`/applet/${appletId}/activity_thanks`)}
        />
      </div>
    </Card>
  );
})`
  #footer-text, .report-message {
    background-color: white;
  }

  .message-category {
    font-size: 25px;
    font-weight: 500;
  }

  .message-score {
    font-size: 22px;
    font-weight: 500;
  }

  .pdf-message {
    margin: 10px 0px;
  }


  .score-overview {
    font-size: 0.8rem;
    margin-bottom: 8px;
    background-color: white;
  }

  .pdf-container {
    max-width: 1000px;
    position: absolute;
    left: -2000px;
    top: 0;
    font-size: 20pt;
    font-family: Arial, Helvetica, sans-serif;
  }

  .splash-image {
    object-fit: cover;
    max-height: 25cm;
  }

  .terms-font {
    font-size: 24px;
  }
  .terms-footer {
    font-size: 22px;
  }
  .score-area {
    position: relative;
    display: flex;
    width: 500px;
    padding: 60px 0 60px;

    .score-bar {
      height: 70px;
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
      top: 40px;
      width: 3px;
      height: 110px;
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
