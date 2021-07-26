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
  const { data, type, handleSubmit, handleChange, item } = props;

  const widget = (handleChange) => {
    const onChange = (answer) => {
      handleChange(answer);

      if (item.autoAdvance) {
        handleSubmit();
      }
    }

    switch (type) {
      case "checkbox":
        return <Checkbox {...props} handleChange={onChange} />;
      case "radio":
        return <Radio {...props} handleChange={onChange} />;
      case "text":
        return <TextInput {...props} handleChange={onChange} />;
      case "slider":
        return <Slider {...props} handleChange={onChange} />;
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
