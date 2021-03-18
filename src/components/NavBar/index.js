import React, { useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { doLogout } from '../../state/app/app.thunks'
import { Languages } from '../../constants/index'
/**
 * Component for Rendering the NavBar
 * @param user
 *
 */
export default function NavBar ({ user }) {
  const { t } = useTranslation()

  return (
    <Navbar expand="lg" variant="dark" className="site-header">
      <Navbar.Brand href="#home">{t('Navbar.mindLogger')}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">{t('Navbar.home')}</Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          <UserInfoDropdown user={user} />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const UserInfoDropdown = ({ user }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const logOut = () => {
    dispatch(doLogout())
  }

  if (user) {
    return (
      <React.Fragment>
        <div className="App container">
          <LanguageDropdown />
        </div>

        <NavDropdown
          title={user.firstName}
          id="basic-nav-dropdown"
          className="ml-auto"
        >
          <NavDropdown.Item href="/changepassword">
            {t('Navbar.settings')}
          </NavDropdown.Item>
          <NavDropdown.Item href="/profile">
            {t('Navbar.profile')}
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#" onClick={logOut}>
            {t('Navbar.logOut')}
          </NavDropdown.Item>
        </NavDropdown>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <LanguageDropdown />
        <Nav.Link href="/login">{t('Navbar.logIn')}</Nav.Link>
      </React.Fragment>
    )
  }
}

const LanguageDropdown = () => {
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(Languages.ENGLISH)

  const changeLanguage = (lang) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return (
    <DropdownButton
      alignRight
      title={
        language === Languages.ENGLISH
          ? t('Navbar.english')
          : t('Navbar.french')
      }
      id="dropdown-menu-align-right"
      onSelect={changeLanguage}
    >
      <Dropdown.Item eventKey={Languages.ENGLISH}>
        {t('Navbar.english')}
      </Dropdown.Item>
      <Dropdown.Item eventKey={Languages.FRENCH}>
        {t('Navbar.french')}
      </Dropdown.Item>
    </DropdownButton>
  )
}
