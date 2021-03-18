import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next"
import {useDispatch} from "react-redux";
import { doLogout } from '../../state/app/app.thunks';

/**
 * Component for Rendering the NavBar
 * @param user
 * @constructor
 *
 */
export default function NavBar({ user }) {
  const { t ,i18n } = useTranslation()
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(doLogout())
  };

  let userDropDown = (user) => {
    if(user) {
      return (
        <>
          <NavDropdown title={user.firstName} id="basic-nav-dropdown" className="ml-auto">
            <NavDropdown.Item href="/changepassword">{t("Navbar.settings")}</NavDropdown.Item>
            <NavDropdown.Item href="/profile">{t("Navbar.profile")}</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={() => logOut()}>{t("Navbar.logOut")}</NavDropdown.Item>
          </NavDropdown>
        </>
      )
    } else {
      return (
        <Nav.Link href="/login">{t("Navbar.logIn")}</Nav.Link>
      )
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
        <Nav className="ml-auto">
          {userDropDown(user)}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

