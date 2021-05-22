import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const MyButton = ({ label, classes = "", type, handleClick }) => (
  <Button variant="outline-dark" size="lg" className={classes} type={type} onClick={(e) => handleClick && handleClick(e)}>{label}</Button>
)

export default MyButton;