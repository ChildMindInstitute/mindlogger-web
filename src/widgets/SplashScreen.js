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

  const splashContainer = useRef();

  let isImageSplash = false;

  if (splashScreen.includes(".png")
    || splashScreen.includes(".bmp")
    || splashScreen.includes(".jpg")
    || splashScreen.includes(".gif")
    || splashScreen.includes(".jpeg")) {
    isImageSplash = true;
  }

  function updateSplashImage(el, containerWidth, containerHeight) {
    const w = isImageSplash ? el.naturalWidth : el.videoWidth, h = isImageSplash ? el.naturalHeight : el.videoHeight;
    const scale = Math.min(1.2, Math.min(containerWidth / w, containerHeight / h));

    if (!splashScreen.includes('.gif') || isNextShown) {
      el.setAttribute('width', scale * w);
      el.setAttribute('height', scale * h)

      return ;
    }

    var c = document.createElement('canvas');

    c.width = w * scale;
    c.height = h * scale;
    c.getContext('2d').drawImage(el, 0, 0, c.width, c.height);

    for (var j = 0, a; a = el.attributes[j]; j++) {
      c.setAttribute(a.name, a.value);
    }
    el.parentNode.replaceChild(c, el);
  }

  useEffect(() => {
    const item = splashContainer.current.querySelector('img, video');
    const width = splashContainer.current.offsetWidth;
    let height = window.innerHeight * 0.8;

    if (window.innerHeight > 767) {
      height -= 144;
    }

    if (item) {
      if (item.complete) {
        updateSplashImage(item, width, height);
      } else {
        item.addEventListener(isImageSplash ? 'load' : 'loadedmetadata', () => {
          updateSplashImage(item, width, height);
        })
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
              <div ref={splashContainer} className="splash-container">
                {
                  isImageSplash ? (
                    <img
                      src={splashScreen}
                      className="image-splash"
                    />
                  ): (
                    <video controls autoPlay={isNextShown}>
                      <source src={splashScreen} />
                    </video>
                  )
                }
              </div>
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
