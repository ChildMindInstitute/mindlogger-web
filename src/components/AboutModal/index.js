import React from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Markdown from '../Markdown';
import './style.css'

const AboutModal = (props) => {
  const { aboutPage, aboutType, markdown, closeAboutPage } = props;
  const { t } = useTranslation()

  return (
    <Modal className="aboutModal" show={aboutPage} onHide={closeAboutPage} centered>
      <Modal.Header closeButton>
        <Modal.Title>{ t('About.about') }</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Markdown
          markdown={aboutType == 'image' ? `![](${markdown})` : markdown}
        />
      </Modal.Body>
    </Modal>
  );
}

export default AboutModal
