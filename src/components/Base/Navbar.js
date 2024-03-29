import React, { useState, useRef, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { push } from 'connected-react-router'
import { loggedInSelector } from '../../state/user/user.selectors'
import { doLogout } from '../../state/user/user.actions'
import { Languages } from '../../constants/index'
import { version } from "../../../package.json";

/**
 * Component for Rendering the NavBar
 * @param user
 *
 */
export default ({ user }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const [appVersion, setVersion] = useState()
  const isLoggedIn = useSelector(loggedInSelector)
  const ref = useRef();

  useEffect(() => {
    setVersion(process.env.REACT_APP_NODE_ENV !== 'production' && version);
  }, [])

  const onLogoClick = () => {
    if (!isLoggedIn) {
      history.push('/dashboard');
    } else if (location.pathname === '/applet') {
      history.go(0)
    } else {
      history.push('/applet')
    }
  }

  return (
    <Navbar
      ref={ref}
      expand="md"
      variant="dark"
      className="site-header"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Navbar.Brand role={'button'} onClick={onLogoClick}>
        {t('Navbar.mindLogger')}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {appVersion && <Navbar.Text>v{appVersion}</Navbar.Text>}
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
    localStorage.clear()
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
