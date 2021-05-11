import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card } from 'react-bootstrap'
import { loggedInSelector } from '../../state/user/user.selectors'
import './style.css'
/**
 * Component for the index page of the WebApp
 * @constructor
 */
export default function AppletList() {
  const { t } = useTranslation()
  const history = useHistory()
  const isLoggedIn = useSelector(loggedInSelector);

  const onSelectApplet = (appletId) => {
    console.log('appletId ->', appletId);

    history.push(`/applet/${appletId}/dashboard`);
  }

  return (
    <div className="applet-layout">
      <Card className="applet-card" onClick={() => onSelectApplet("1231")}>
        <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Color-blue.JPG" />
        <Card.Body>
          <Card.Title className="applet-card-title">Healthy Brain NetWork (NIMH Content) V0.30</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="applet-card">
        <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Color-blue.JPG" />
        <Card.Body>
          <Card.Title>Healthy Brain NetWork (NIMH Content) V0.30</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}
