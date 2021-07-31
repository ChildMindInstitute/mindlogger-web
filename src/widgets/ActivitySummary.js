import React, { useState, useEffect } from 'react';
import _ from "lodash";
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Parser } from 'expr-eval';

// Component
import MyButton from '../components/Button';

// State
import { inProgressSelector } from '../state/responses/responses.selectors';

// services
import { getScoreFromResponse, evaluateScore, getMaxScore } from '../services/scoring';


const Summary = (props) => {
  const { appletId, activityId } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);

  const response = useSelector(inProgressSelector);

  useEffect(() => {
    const { responses, activity } = response[`activity/${activityId}`];

    if (responses && responses.length > 0) {
      const parser = new Parser({
        logical: true,
        comparison: true,
      });

      let scores = [], maxScores = [];
      for (let i = 0; i < activity.items.length; i++) {
        const { variableName } = activity.items[i];
        let score = getScoreFromResponse(activity.items[i], responses[i][variableName]);
        scores.push(score);
        maxScores.push(getMaxScore(activity.items[i]))
      }

      const cumulativeScores = activity.compute.reduce((accumulator, itemCompute) => {
        return {
          ...accumulator,
          [itemCompute.variableName.trim().replace(/\s/g, '__')]: evaluateScore(itemCompute.jsExpression, activity.items, scores),
        };
      }, {});

      const cumulativeMaxScores = activity.compute.reduce((accumulator, itemCompute) => {
        return {
          ...accumulator,
          [itemCompute.variableName.trim().replace(/\s/g, '__')]: evaluateScore(itemCompute.jsExpression, activity.items, maxScores),
        };
      }, {});

      const reportMessages = [];
      activity.messages.forEach((msg) => {
        const { jsExpression, message, outputType } = msg;

        const variableName = jsExpression.split(/[><]/g)[0];
        const category = variableName.trim().replace(/\s/g, '__');
        const expr = parser.parse(category + jsExpression.substr(variableName.length));

        if (expr.evaluate(cumulativeScores)) {
          reportMessages.push({
            category,
            message,
            score: (outputType == 'percentage' ? Math.round(cumulativeMaxScores[category] ? cumulativeScores[category] * 100 / cumulativeMaxScores[category] : 0) + '%' : cumulativeScores[category]),
          });
        }
      });

      setMessages(reportMessages);
    }
  }, [response && Object.keys(response).length > 1]);

  return (
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            {messages && messages.map((item, i) => (
              <>
                <div key={i}>
                  <h1>{item.category.replace(/_/g, ' ')}</h1>
                  <h3><strong>{item.score}</strong></h3>
                  <h4>{item.message}</h4>
                </div>
                {messages.length > 1 && <div key={`${i}-hr`} className="hr" />}
              </>
            ))}
          </Card.Body>
        </Col>
      </Row>
      <div>
        <MyButton
          type="submit"
          label={t("next")}
          classes="mr-5 mb-2 float-right"
          handleClick={(e) => history.push(`/applet/${appletId}/dashboard`)}
        />
      </div>
    </Card>
  )
}

export default Summary;