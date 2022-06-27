import React from 'react'
import { Alert } from "react-bootstrap";
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './style.css'

/**
 *
 * Component to display User SummaryAlert
 * @constructor
 */
const SummaryAlert = ({ text, heading = 'Alerts' }) => (
  <Alert variant="danger">
    <Alert.Heading>{heading}</Alert.Heading>
    { Array.isArray(text) ?
      text.map((str, index) => <p key={index}><FontAwesomeIcon icon={faBell} className="mr-2" />{str}</p>)
      :
      <p><FontAwesomeIcon icon={faBell} className="mr-2" />{text}</p>
    }
  </Alert>
)

export default SummaryAlert;
