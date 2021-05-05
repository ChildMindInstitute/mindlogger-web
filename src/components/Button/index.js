import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export const MyButton = ({ link, label, classes = "" }) => (
  <Link to={link}>
    <Button variant="outline-dark" size="lg" className={classes}>{label}</Button>
  </Link>
)

export default MyButton;