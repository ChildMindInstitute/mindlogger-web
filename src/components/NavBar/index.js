import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import {useDispatch} from "react-redux";
import { doLogout } from '../../state/app/app.thunks';


export default function NavBar({ user }) {
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(doLogout())
  };

  let userDropDown = (user) => {
    if(user) {
      return (
        <>
          <NavDropdown title={user.firstName} id="basic-nav-dropdown" className="ml-auto">
            <NavDropdown.Item href="/changepassword">Settings</NavDropdown.Item>
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={() => logOut()}>Logout</NavDropdown.Item>
          </NavDropdown>
        </>
      )
    } else {
      return (
        <Nav.Link href="/login">Login</Nav.Link>
      )
    }
  };

  return (
    <Navbar expand="lg" variant="dark" className="site-header">
      <Navbar.Brand href="#home">MindLogger</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          {userDropDown(user)}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

