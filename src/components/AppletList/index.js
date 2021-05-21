import React, { useEffect } from 'react';
import Avatar from 'react-avatar';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Container, Row, Spinner } from 'react-bootstrap';

import { getApplets } from '../../state/applet/applet.actions';
import { selectApplet } from '../../state/applet/applet.reducer';

import './style.css';

/**
 * Component for the index page of the WebApp
 * @constructor
 */
export default function AppletList() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { applets, loading, error } = useSelector(state => state.applet);    

  useEffect(() => {
    dispatch(getApplets());
  }, [])

  const onSelectApplet = (applet) => {
    dispatch(selectApplet(applet));
    history.push(`/${applet.id}/dashboard`);
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        {loading && applets.length === 0 
          ?
          <Spinner animation="border" role="status" className="mt-5" />
          :
          applets.map(applet => (
            <Card className="applet-card" onClick={() => onSelectApplet(applet)} key={applet.id}>
              {applet.image ?
                <Card.Img variant="top" src={applet.image} />
                :
                <Avatar name={applet.name.en} maxInitials={2} size="254" round="3px" />
              }
              <Card.Body>
                <Card.Title className="applet-card-title"> {applet.name.en} </Card.Title>
                <Card.Text> {applet.description.en} </Card.Text>
              </Card.Body>
            </Card>
          ))}
      </Row>
    </Container>
  )
}
