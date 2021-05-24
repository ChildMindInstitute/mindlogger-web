import React, { useState } from 'react'
import _ from "lodash";
import { useTranslation } from 'react-i18next';

import Navigator from './Navigator';
import {
  Modal,
  Card,
  Row,
  Col
} from 'react-bootstrap'

const TextInput = ({ item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown }) => {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [value, setValue] = useState(''); // need to be connected to redux soon

  return (
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col
          sm={3}
          className="p-3"
        >
          <Card.Img variant="top" src={'../../../logo192.png'} />
        </Col>

        <Col
          sm={9}
        >
          <Card.Body>
            <Card.Title className="question">{item.question.en}</Card.Title>

            <Row className="no-gutters px-4 py-4">
              <input
                type="text"
                style={{ width: '80%', margin: 'auto' }}
                value={value}
                onChange={e => setValue(e.target.value)}
              />
            </Row>
          </Card.Body>
        </Col>
      </Row>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("failed")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("incorrect_answer")}
        </Modal.Body>
      </Modal>

      <Navigator
        isBackShown={isBackShown}
        isNextShown={isNextShown}
        handleBack={handleBack}
        isSubmitShown={isSubmitShown}
        canSubmit={(e) => {
          if (!item.correctAnswer || !item.correctAnswer.en || item.correctAnswer.en == value) {
            return true;
          }
          setShow(true);
          return false;
        }}
      />
    </Card>
  )
}

export default TextInput;
