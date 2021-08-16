import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Container, Row, Spinner } from 'react-bootstrap'
import Avatar from 'react-avatar';

import { getApplets } from '../../state/applet/applet.actions'
import { setCurrentApplet } from '../../state/app/app.reducer'
import { appletsSelector } from '../../state/applet/applet.selectors';

import './style.css'

/**
 * Component for the index page of the WebApp
 * @constructor
 */
export default function AppletList() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);
  const applets = useSelector(appletsSelector);

  useEffect(() => {
    const fetchApplets = async () => {
      setIsLoading(true);
      await dispatch(getApplets());
      setIsLoading(false);
    }
    fetchApplets();
  }, [])

  const onSelectApplet = (appletId) => {
    dispatch(setCurrentApplet(appletId));

    history.push(`/${appletId}/dashboard`);
  }

  return (
    <Container>
      <Row className="applet-list">
        {!isLoading ?
          applets.length && applets.map(applet => (
            <Card className="applet-card" onClick={() => onSelectApplet(applet.id)} key={applet.id}>
              {applet.image ?
                <Card.Img variant="top" src={applet.image} />
                :
                <Avatar color="#777" name={applet.name.en} maxInitials={2} size="280" round="3px" />
              }
              <Card.Body>
                <Card.Title className="applet-card-title"> {applet.name.en} </Card.Title>
                <Card.Text> {applet.description.en} </Card.Text>
              </Card.Body>
            </Card>
          )) || <h3 className="mt-4">You currently do not have any applets.</h3> :

          <Spinner animation="border mt-4"></Spinner>}
      </Row>
    </Container>
  )
}
