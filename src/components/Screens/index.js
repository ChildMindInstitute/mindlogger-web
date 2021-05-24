import React, { useState, useEffect } from 'react';
import _ from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import Avatar from 'react-avatar';

// Component
import Item from '../Item';

// Constants
import { activity } from "../../util/constants";
import {
    createResponseInProgress,
    setCurrentScreen,
    setAnswer
} from '../../state/response/response.reducer';

import * as R from 'ramda';

const Screens = () => {
  const items = []
  const { activityId } = useParams();
  const [data, setData] = useState({});
  const { applet, activityAccess } = useSelector(state => state.applet);

  const dispatch = useDispatch()

  /** dummy data */
  const user = useSelector(state => R.path(['user', 'info'])(state));

  const activity = {
    "id": "activity/607f361ed6ff0040d3aefc78",
    "name": { "en": "Testing" },
    "description": { "en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur leo leo, tempus eget arcu sit amet, facilisis tempus ante. Nullam ultrices dui eget mi feugiat auctor. Fusce vel erat mauris. " },
    "schemaVersion": { "en": "0.0.1" },
    "version": { "en": "0.0.1" },
    "altLabel": { "en": "Testing" },
    "shuffle": false,
    "skippable": true,
    "backDisabled": true,
    "fullScreen": false,
    "autoAdvance": false,
    "isPrize": false,
    "preamble": { "en": "" },
    "addProperties": [{ "reprolib:terms/isAbout": [{ "@id": "Screen1" }], "reprolib:terms/isVis": [{ "@value": true }], "reprolib:terms/variableName": [{ "@language": "en", "@value": "Screen1" }] }],
    "order": ["607f361ed6ff0040d3aefc78/607f361fd6ff0040d3aefc7a"],
    "notification": {},
    "items": [
      {
        "id": "screen/60a355a34a284325fa573d1f",
        "description": {
          "en": ""
        },
        "schemaVersion": {
          "en": "0.0.1"
        },
        "version": {
          "en": "0.0.1"
        },
        "altLabel": {
          "en": "Screen2"
        },
        "inputType": "slider",
        "isOptionalText": false,
        "question": {
          "en": "slider"
        },
        "valueConstraints": {
            "continuousSlider": true,
            "isOptionalTextRequired": false,
            "responseAlert": true,
            "scoring": true,
            "showTickMarks": false,
            "valueType": "http://www.w3.org/2001/XMLSchema#integer",
            "itemList": [
              {
                  "name": {
                      "en": "1"
                  },
                  "value": 1,
                  "score": 1,
                  "image": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Thumbs-up-icon.png"
              },
              {
                  "name": {
                      "en": "2"
                  },
                  "value": 2,
                  "score": 2
              },
              {
                  "name": {
                      "en": "3"
                  },
                  "value": 3,
                  "score": 3
              },
              {
                  "name": {
                      "en": "4"
                  },
                  "value": 4,
                  "score": 4
              },
              {
                  "name": {
                      "en": "5"
                  },
                  "value": 5,
                  "score": 5,
                  "image": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Thumbs-up-icon.png"
              }
            ],
            "maxAlertValue": 0,
            "maxValue": "Max",
            "minAlertValue": 0,
            "minValue": "Min",
            "responseAlertMessage": "",
            "isOptionalText": false
          },
          "skippable": true,
          "fullScreen": false,
          "backDisabled": false,
          "autoAdvance": false,
          "inputs": {},
          "schema": "60a3557f4a284325fa573d01/60a355a34a284325fa573d1f",
          "variableName": "Screen2",
          "visibility": true
      },
      {
        "id": "screen/607f361fd6ff0040d3aefc7a",
        "description": { "en": "" },
        "schemaVersion": { "en": "0.0.1" },
        "version": { "en": "0.0.1" },
        "altLabel": { "en": "Screen1" },
        "inputType": "radio",
        "isOptionalText": false,
        "question": { "en": "testing" },
        "valueConstraints":
        {
          "enableNegativeTokens": false,
          "multipleChoice": false,
          "responseAlert": false,
          "scoring": false,
          "valueType": "http://www.w3.org/2001/XMLSchema#anyURI",
          "itemList": [
            { "name": { "en": "Option 1" }, "value": 0, "description": "" },
            { "name": { "en": "Option 2" }, "value": 1, "description": "" },
            { "name": { "en": "Option 3" }, "value": 3, "description": "" }
          ],
          "maxValue": 1,
          "minValue": 1,
          "isOptionalText": false
        },
        "fullScreen": false,
        "backDisabled": false,
        "autoAdvance": true,
        "inputs": {},
        "schema": "607f361ed6ff0040d3aefc78/607f361fd6ff0040d3aefc7a",
        "variableName": "Screen1",
        "visibility": true
      },
      {
        "id": "screen/607f361fd6ff0040d3aefc7b",
        "description": { "en": "" },
        "schemaVersion": { "en": "0.0.1" },
        "version": { "en": "0.0.1" },
        "altLabel": { "en": "Screen1" },
        "inputType": "checkbox",
        "isOptionalText": false,
        "question": { "en": "testing 2" },
        "valueConstraints":
        {
          "enableNegativeTokens": false,
          "multipleChoice": false,
          "responseAlert": false,
          "scoring": false,
          "valueType": "http://www.w3.org/2001/XMLSchema#anyURI",
          "itemList": [
            { "name": { "en": "Option 1" }, "value": 0, "description": "" },
            { "name": { "en": "Option 2" }, "value": 1, "description": "" },
            { "name": { "en": "Option 3" }, "value": 2, "description": "" },
            { "name": { "en": "Option 4" }, "value": 3, "description": "" }
          ],
          "maxValue": 1,
          "minValue": 1,
          "isOptionalText": false
        },
        "fullScreen": false,
        "backDisabled": false,
        "autoAdvance": true,
        "inputs": {},
        "schema": "607f361ed6ff0040d3aefc78/607f361fd6ff0040d3aefc7a",
        "variableName": "Screen2",
        "visibility": true
      },
    ],
    "schema": "607f361ed6ff0040d3aefc78"
  }

  const screenIndex = useSelector(state => state.response.inProgress[activity.id].screenIndex);
  const answer = useSelector(state => state.response.inProgress[activity.id].responses[screenIndex])

  useEffect(() => {
    dispatch(createResponseInProgress({
      activity,
      event: null,
      subjectId: user._id,
      timeStarted: new Date().getTime()
    }));
  }, [])


  const handleNext = (values) => {
    if (screenIndex == activity.items.length-1) {

    } else {
      dispatch(
        setCurrentScreen({
          activityId: activity.id,
          screenIndex: screenIndex + 1
        })
      )
    }
  }

  const handleChange = (answer) => {
    dispatch(
      setAnswer({
        activityId: activity.id,
        screenIndex,
        answer
      })
    )
  }

  const handleBack = () => {
    if (screenIndex >= 0) {
      dispatch(
        setCurrentScreen({
          activityId: activity.id,
          screenIndex: screenIndex - 1
        })
      );
    }
  }

  activity.items.forEach((item, i) => {
    items.push(
      <Item
        data={data}
        type={item.valueConstraints.multipleChoice === true ? "checkbox" : item.inputType}
        key={item.id}
        item={item}
        handleSubmit={handleNext}
        handleChange={handleChange}
        handleBack={handleBack}
        isSubmitShown={i == activity.items.length-1}
        answer={answer}
        isBackShown={screenIndex == i && i}
        isNextShown={screenIndex == i}
      />
    );
  });

  return (
    <div className="container">
      <Row className="mt-5 activity">
        <Col sm={24} xs={24} md={3}>
          <Card className="hover">
            <div className="pr-4 pl-4 pt-4">
              {applet.image ?
                <Card.Img variant="top" src={applet.image} className="rounded border w-h" />
                :
                <Avatar name={applet.name.en} maxInitials={2} size="254" round="3px" />
              }
            </div>
            <Card.Body>
              <Card.Text>{applet.name.en}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={24} xs={24} md={9}>
          {_.map(items.slice(0, screenIndex+1))}
        </Col>
      </Row>
    </div>
  )
}

export default Screens;
