import React, { useState, useEffect } from 'react';
import _ from "lodash";
import {
  Row,
  Card,
  Col,
  Image,
} from 'react-bootstrap';

import Navigator from './Navigator';
import Markdown from '../components/Markdown';
import questionMark from '../assets/question-mark.svg';

const SplashScreen = (props) => {
  const {
    watermark,
    isBackShown,
    isNextShown,
    handleBack,
    isSubmitShown,
    splashScreen
  } = props;

  let isImageSplash = false;

  if (splashScreen.includes(".png")
    || splashScreen.includes(".bmp")
    || splashScreen.includes(".jpg")
    || splashScreen.includes(".jpeg")) {
    isImageSplash = true;
  }

  return (
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            <Card.Title className="question">
              {
                watermark &&
                <Image className="watermark" src={watermark} alt="watermark" rounded />
              }
            </Card.Title>
            <div className="no-gutters">
              {isImageSplash ? (
                <div className="splash-container">
                  <img src={splashScreen} className="image-splash" />
                </div>
              ): (
                <div></div>
              )}
            </div>
          </Card.Body>
        </Col>
      </Row>
      <Navigator
        isBackShown={isBackShown}
        isNextShown={isNextShown}
        isNextDisable={false}
        handleBack={handleBack}
        isSubmitShown={false}
      />
    </Card>
  );
}

export default SplashScreen;
