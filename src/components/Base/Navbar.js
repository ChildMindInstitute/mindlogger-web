import React, { useState, useRef, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { push } from 'connected-react-router'
import { doLogout } from '../../state/user/user.actions'
import { Languages } from '../../constants/index'

/**
 * Component for Rendering the NavBar
 * @param user
 *
 */
export default ({ user }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [expanded, setExpanded] = useState(false)
  const ref = useRef();


  return (
    <Navbar
      ref={ref}
      expand="md"
      variant="dark"
      className="site-header"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Navbar.Brand role={'button'} onClick={() => history.push('/applet')}>
        {t('Navbar.mindLogger')}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav onClick={() => setExpanded(false)} className="mr-auto">
          {/* <Nav.Link onClick={() => history.push('/applet')}>
            {t('Navbar.applets')}
          </Nav.Link> */}
        </Nav>
        <Nav className="ml-auto">
          <UserInfoDropdown user={user} setExpanded={setExpanded} />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const UserInfoDropdown = ({ user, setExpanded }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()

  const logOut = () => {
    dispatch(doLogout())
    dispatch(push('/login'))
    setExpanded(false);
  }

  const onSettings = () => {
    history.push('/changepassword');
    setExpanded(false);
  }

  const onLogin = () => {
    history.push('/login')
    setExpanded(false);
  }

  const onProfileSelect = () => {
    history.push('/profile')
    setExpanded(false);
  }

  if (user) {
    return (
      <Row>
        <Col xs={12} md={6} className="App container justify-content-center">
          <LanguageDropdown setExpanded={setExpanded} />
        </Col>

        <Col xs={12} md={6} className="App container justify-content-center">
          <NavDropdown
            title={user.firstName}
            id="basic-nav-dropdown"
            className="text-center drop-down"
            size="xxl"
          >
            <NavDropdown.Item onClick={onSettings}>
              {t('Navbar.settings')}
            </NavDropdown.Item>
            <NavDropdown.Item onClick={onProfileSelect}>
              {t('Navbar.profile')}
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logOut}>
              {t('Navbar.logOut')}
            </NavDropdown.Item>
          </NavDropdown>
        </Col>
      </Row>
    )
  } else {
    return (
      <Row>
        <Col xs={12} md={6} className="App container justify-content-center">
          <LanguageDropdown setExpanded={setExpanded} />
        </Col>
        <Col xs={12} md={6} className="App container justify-content-center">
          <Nav.Link onClick={onLogin}>
            {t('Navbar.logIn')}
          </Nav.Link>
        </Col>
      </Row>
    )
  }
}

const LanguageDropdown = ({ setExpanded }) => {
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language || Languages.ENGLISH)

  // useEffect(() => changeLanguage(i18n.language), [i18n.language])

  const changeLanguage = (lang) => {
    setLanguage(lang)

    if (!['en', 'fr'].includes(lang)) {
      return;
    }

    i18n.changeLanguage(lang)
  }

  return (
    <DropdownButton
      alignRight
      className="text-center drop-down"
      title={
        language === Languages.ENGLISH
          ? t('Navbar.english')
          : t('Navbar.french')
      }
      id="dropdown-menu-align-right"
      onSelect={changeLanguage}
    >
      <Dropdown.Item onClick={() => setExpanded(false)} eventKey={Languages.ENGLISH}>
        {t('Navbar.english')}
      </Dropdown.Item>
      <Dropdown.Item onClick={() => setExpanded(false)} eventKey={Languages.FRENCH}>
        {t('Navbar.french')}
      </Dropdown.Item>
    </DropdownButton>
  )
}
