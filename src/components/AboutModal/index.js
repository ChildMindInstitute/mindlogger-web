import React from 'react'
import { Modal } from 'react-bootstrap'
import MDEditor from '@uiw/react-md-editor';

import './style.css'

const AboutModal = (props) => {
  const { aboutPage, markdown, closeAboutPage } = props;

  return (
    <Modal className="aboutModal" show={aboutPage} onHide={closeAboutPage} centered>
      <Modal.Header closeButton>
        <Modal.Title>About Page</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MDEditor.Markdown source={markdown} />
      </Modal.Body>
    </Modal>
  );
}

export default AboutModal
