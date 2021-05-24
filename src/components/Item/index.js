import React from 'react';
import { Formik, Form } from 'formik';

// Widgets
import Radio from '../../widgets/Radio';
import Checkbox from '../../widgets/Checkbox';
import TextInput from '../../widgets/TextInput';
import Slider from '../../widgets/Slider/index';

import "./style.css";

const Item = (props) => {
  const { data, type, handleSubmit, handleChange } = props;

  const widget = (handleChange) => {
    switch (type) {
      case "checkbox":
        return <Checkbox {...props} handleChange={handleChange} />;
      case "radio":
        return <Radio {...props} handleChange={handleChange} />;
      case "text":
        return <TextInput {...props} handleChange={handleChange} />;
      case "slider":
        return <Slider {...props} handleChange={handleChange} />;
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
          {widget(handleChange)}
        </Form>
      )}
    </Formik>
  );
}

export default Item;
