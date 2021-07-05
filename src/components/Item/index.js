/* eslint-disable react/prop-types */
import React from 'react';
import { Formik, Form } from 'formik';

// Widgets
import Radio from '../../widgets/Radio';
import Checkbox from '../../widgets/Checkbox';
import TextInput from '../../widgets/TextInput';
import Slider from '../../widgets/Slider/index';

import "./style.css";

const Item = (props) => {
  const { data, type, handleSubmit } = props;

  const widget = () => {
    switch (type) {
      case "checkbox":
        return <Checkbox {...props} />;
      case "radio":
        return <Radio {...props} />;
      case "text":
        return <TextInput {...props} />;
      case "slider":
        return <Slider {...props} />;
      default:
        return <div />;
    }
  }

  return (
    <Formik
      initialValues={data}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit }) => (
        <Form noValidate onSubmit={handleSubmit}>
          {widget()}
        </Form>
      )}
    </Formik>
  );
}

export default Item;
