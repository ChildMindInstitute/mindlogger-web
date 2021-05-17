import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const MyButton = ({ label, classes = "", type, handleClick }) => (
  <Button variant="outline-dark" size="lg" className={classes} type={type} onClick={() => handleClick && handleClick()}>{label}</Button>
)

export default MyButton;