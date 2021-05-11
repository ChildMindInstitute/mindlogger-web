import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  Button, 
  Row,
  Col,
  Modal
} from 'react-bootstrap'
import MDEditor from "@uiw/react-md-editor";
import './style.css'

export const AppletDashboard = () => {
  // const { appletId } = useParams();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
              <Modal.Title>NIMH Applet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MDEditor.Markdown source="Hello Markdown! `Hi!`" />
            </Modal.Body>
          </Modal>
        </Col>
        <Col sm={1} />
        <Col sm={8}>
          <h4> Healthy Brain Network (NIMH Content) v0.30 </h4>
          <p className="ds-activity-status"> Past Due </p>
          <Button
            className="ds-shadow ds-activity-button"
            variant="link" 
            block
          >
            EMA Assessment (Morning)
          </Button>
          <Button
            className="ds-shadow ds-activity-button"
            variant="link"
            block
          >
            EMA Assessment (Mid Day)
          </Button>
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
