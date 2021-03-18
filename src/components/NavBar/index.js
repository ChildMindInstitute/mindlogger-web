import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { doLogout } from "../../state/app/app.thunks";
import { Languages } from "../../constants/index";
/**
 * Component for Rendering the NavBar
 * @param user
 * @constructor
 *
 */
export default function NavBar({ user }) {
  const [language, setLanguage] = useState(Languages.ENGLISH);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(doLogout());
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  let userDropDown = (user) => {
    if (user) {
      return (
        <>
          <div className="App container">
            <DropdownButton
              alignRight
              title={
                language === Languages.ENGLISH
                  ? t("Navbar.english")
                  : t("Navbar.french")
              }
              id="dropdown-menu-align-right"
              onSelect={changeLanguage}
            >
              <Dropdown.Item eventKey={Languages.ENGLISH}>
                {t("Navbar.english")}
              </Dropdown.Item>
              <Dropdown.Item eventKey={Languages.FRENCH}>
                {t("Navbar.french")}
              </Dropdown.Item>
            </DropdownButton>
            {/* <h4>You selected {value}</h4> */}
          </div>

          <NavDropdown
            title={user.firstName}
            id="basic-nav-dropdown"
            className="ml-auto"
          >
            <NavDropdown.Item href="/changepassword">
              {t("Navbar.settings")}
            </NavDropdown.Item>
            <NavDropdown.Item href="/profile">
              {t("Navbar.profile")}
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={() => logOut()}>
              {t("Navbar.logOut")}
            </NavDropdown.Item>
          </NavDropdown>
        </>
      );
    } else {
      return <Nav.Link href="/login">{t("Navbar.logIn")}</Nav.Link>;
    }
  };

  return (
    <Navbar expand="lg" variant="dark" className="site-header">
      <Navbar.Brand href="#home">{t("Navbar.mindLogger")}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">{t("Navbar.home")}</Nav.Link>
        </Nav>
        <Nav className="ml-auto">{userDropDown(user)}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
