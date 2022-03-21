import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { PDFExport } from '@progress/kendo-react-pdf';
import { drawDOM, exportPDF } from "@progress/kendo-drawing";

import styled from 'styled-components';
import cn from 'classnames';
import _ from 'lodash';
import domtoimage from 'dom-to-image';

// Component
import MyButton from '../components/Button';
import Markdown from '../components/Markdown';

// State
import { inProgressSelector, currentAppletResponsesSelector } from '../state/responses/responses.selectors';

// services
import { evaluateCumulatives } from '../services/scoring';
import { getChainedActivities } from '../services/helper';
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
  const { messages } = reports.find(report => report.activity.id.split('/').pop() == activityId) || { messages: [] };

  const dispatch = useDispatch();

  const responseHistory = useSelector(currentAppletResponsesSelector);
  const applet = useSelector(currentAppletSelector);
  const response = useSelector(inProgressSelector);
  const activityAccess = useSelector(currentActivitySelector);

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
        const {messages, activity} = report;

        for (let i = 0; i < messages.length; i++) {
          items.push(`message-${activity.id}-${i}`);
        }
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
            lastResponse.push(itemResponses[itemResponses.length-1]);
          }
        }
      }

      let { reportMessages, scoreOverview } = evaluateCumulatives(lastResponse, chainedActivity);

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
          <div id="PDF" ref={ref}>
            {
              reports.map(({ activity, messages, scoreOverview }, index) => {
                if (!shareAllReports && activity.id.split('/').pop() != activityId) {
                  return <></>;
                }

                let url = "";
                if (activity.splash && activity.splash.en) {
                  url = activity.splash.en;
                }

                return <>
                  {url.match(/\.(jpeg|jpg|gif|png)$/) != null &&
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img
                        src={url + '?not-from-cache-please'}
                        className="splash-image"
                        crossOrigin="anonymous"
                        alt=''
                      />
                      <div className="page-break" />
                    </div>
                  }
                  {applet.image && (!shareAllReports || !index) &&
                    <div style={{ float: 'right', marginBottom: 10 }}>
                      <img
                        src={applet.image + '?not-from-cache-please'}
                        style={{ objectFit: 'contain' }}
                        width="100"
                        crossOrigin="anonymous"
                        alt=''
                      />
                    </div>
                  }

                  <div className="overview-font mb-4">
                    <Markdown useCORS={true} markdown={scoreOverview.replace(MARKDOWN_REGEX, '$1$2')} />
                  </div>
                  {
                    messages && messages.map((item, i) => (<img key={i} src={images.current[`message-${activity.id}-${i}`] || null} className="pdf-message" />))
                  }
                </>
              })
            }
            <div style={{ border: '1px solid black', marginTop: 36, marginBottom: 36 }} />
            <img src={images.current['footer-text'] || null}></img>
          </div>

          <span id="score-title">
            <span
              className="score-title text-nowrap"
            >
              <b>{t("additional.child_score")}</b>
            </span>
          </span>

          <div>
            {
              reports.map(({ activity, messages }) => (
                (messages || []).map((item, i) => (
                  <div id={`message-${activity.id}-${i}`} key={i} className="report-message">
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
                          left: `max(${titleWidth/2}px, ${(item.scoreValue / item.maxScoreValue) * 100}%)`,
                        }}>
                        <b>{t("additional.child_score")}</b>
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
                      {t("additional.child_score_on_subscale", { name: item.category.replace(/_/g, ' ') })}
                      {' '}
                      <span className="text-danger">{item.scoreValue}</span>.
                      <Markdown
                        markdown={item.message.replace(MARKDOWN_REGEX, '$1$2')}
                        useCORS={true}
                      />
                    </div>
                  </div>
                ))
              ))
            }

            <div id="footer-text">
              <p className="mb-4 terms-font">{termsText}</p>
              <p className="terms-footer">{footerText}</p>
            </div>
          </div>
        </div>
        <MyButton
          type="submit"
          label={t('Consent.next')}
          classes="mr-5 mb-2 float-right"
          handleClick={(e) => history.push(`/applet/${appletId}/activity_thanks`)}
        />

        {
          reports.length > 1 ? ( <MyButton
            type="button"
            label={t('additional.share_all_reports')}
            classes="mr-5 mb-2 float-right"
            handleClick={(e) => {
              setShareAllReports(true);

              setTimeout(() => {
                handlePDFSave()
              })
            }}
          /> ) : (
            <MyButton
              type="button"
              label={t('additional.share_report')}
              classes="mr-5 mb-2 float-right"
              handleClick={(e) => {
                setShareAllReports(false);

                setTimeout(() => {
                  handlePDFSave()
                })
              }}
            />
          )
        }
      </div>
    </Card>
  );
})`
  #footer-text, .report-message {
    background-color: white;
  }

  .pdf-message {
    margin: 10px 0px;
  }

  .overview-font {
    font-size: 13px;
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
