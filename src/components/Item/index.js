/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';

// Widgets
import Radio from '../../widgets/Radio';
import Checkbox from '../../widgets/Checkbox';
import TextInput from '../../widgets/TextInput';
import Slider from '../../widgets/Slider/index';
import TimeDuration from '../../widgets/TimeDuration';

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
      case "duration":
        return <TimeDuration {...props} handleChange={onChange} values={values} />;
      default:
        return <div />;
    }
  }

  const ref = useRef();

  useEffect(() => {
    if (props.isNextShown) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [props.isNextShown])

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
          <div ref={ref}></div>
          {widget(handleChange, values)}
        </Form>
      )}
    </Formik>
  );
}

export default Item;
