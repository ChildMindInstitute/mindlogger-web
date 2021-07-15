import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MDEditor from "@uiw/react-md-editor";
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Modal
} from 'react-bootstrap';

import { selectActivity } from '../../state/applet/applet.reducer';

import './style.css';


export const AppletDashboard = ({ history }) => {
  const { appletId } = useParams();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { applet } = useSelector(state => state.applet);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleActivityClick = (activity) => {
    dispatch(selectActivity(activity));
    history.push(`/applet/${appletId}/${activity.id}`);
  }

  return (
    <Container fluid>
      <Row className="ds-applet-layout">
        <Col sm={3}>
          <Card className="ds-card">
            <Card.Img
              className="ds-shadow"
              variant="top"
              src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Color-blue.JPG"
            />
            <Card.Body>
              <Card.Title className="ds-card-title">
                <Button
                  className="ds-shadow ds-about-button"
                  onClick={handleShow}
                  variant="link"
                >
                  About Page
                </Button>
              </Card.Title>
            </Card.Body>
          </Card>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{applet.name && applet.name.en}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MDEditor.Markdown source={applet.description && applet.description.en} />
            </Modal.Body>
          </Modal>
        </Col>
        <Col sm={1} />
        <Col sm={8}>
          <h4>{applet.name ? applet.name.en : 'Healthy Brain Network (NIMH Content) v0.30'}</h4>
          <p className="ds-activity-status"> Past Due </p>
          {applet.activities && applet.activities.map(activity => (
            <Button
              onClick={() => handleActivityClick(activity)}
              className="ds-shadow ds-activity-button"
              key={activity.id}
              variant="link"
              block
            >
              {activity.name.en}
            </Button>
          ))}
          <p className="ds-activity-status"> Scheduled </p>
          <Button
            className="ds-shadow ds-activity-button"
            variant="link"
            block
            disabled
          >
            EMA Assessment (Evening) - Available between 12:00 PM - 3:00 PM
          </Button>
          <Button
            className="ds-shadow ds-activity-button"
            variant="link"
            block
            disabled
          >
            Prequestionnaire - Available between 12:00 PM - 3:00 PM
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default AppletDashboard
