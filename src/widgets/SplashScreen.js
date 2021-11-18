import React, { useState, useEffect, useRef } from 'react';
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

  const splashImage = useRef();

  let isImageSplash = false;

  if (splashScreen.includes(".png")
    || splashScreen.includes(".bmp")
    || splashScreen.includes(".jpg")
    || splashScreen.includes(".gif")
    || splashScreen.includes(".jpeg")) {
    isImageSplash = true;
  }

  function freeze_gif(i) {
    var c = document.createElement('canvas');
    var w = c.width = i.offsetWidth;
    var h = c.height = i.offsetHeight;
    c.getContext('2d').drawImage(i, 0, 0, w, h);

    for (var j = 0, a; a = i.attributes[j]; j++) {
      c.setAttribute(a.name, a.value);
    }
    i.parentNode.replaceChild(c, i);
  }

  useEffect(() => {
    if (splashScreen.includes('.gif') && !isNextShown) {
      const gif = splashImage.current.querySelector('img');
      if (gif) {
        if (gif.complete) {
          freeze_gif(gif);
        } else {
          gif.addEventListener('load', () => freeze_gif(gif))
        }
      }
    }
  }, [isNextShown, splashScreen])

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
                <div ref={splashImage} className="splash-container">
                  <img
                    src={splashScreen}
                    className="image-splash"
                  />
                </div>
              ): (
                <div className="splash-container">
                  <video width="320" height="240" controls autoPlay={isNextShown}>
                    <source src={splashScreen} />
                  </video>
                </div>
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
