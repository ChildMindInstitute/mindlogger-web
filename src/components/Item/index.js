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

  const widget = (handleChange, values) => {
    const onChange = (answer) => {
      handleChange(answer);

      if (item.autoAdvance) {
        handleSubmit(answer);
      }
    }

    switch (type) {
      case "checkbox":
        return <Checkbox {...props} handleChange={onChange} values={values} />;
      case "radio":
        return <Radio {...props} handleChange={onChange} values={values} />;
      case "text":
        return <TextInput {...props} handleChange={onChange} values={values} />;
      case "slider":
        return <Slider {...props} handleChange={onChange} values={values} />;
      default:
        return <div />;
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit, values }) => (
        <Form noValidate onSubmit={handleSubmit}>
          {widget(handleChange, values)}
        </Form>
      )}
    </Formik>
  );
}

export default Item;
