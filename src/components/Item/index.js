/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';

// Widgets
import Radio from '../../widgets/Radio';
import Checkbox from '../../widgets/Checkbox';
import AgeSelector from '../../widgets/AgeSelector';
import TextInput from '../../widgets/TextInput';
import Slider from '../../widgets/Slider';
import TimeDuration from '../../widgets/TimeDuration';
import SplashScreen from '../../widgets/SplashScreen';
import Dropdown from '../../widgets/Dropdown';

import "./style.css";

const Item = (props) => {
  const { data, type, handleSubmit, handleChange, item, isOnePageAssessment } = props;

  const widget = (handleChange, values) => {
    let { isBackShown } = props;
    const onChange = (answer, valid) => {
      handleChange(answer, valid);

      if (item.autoAdvance && !isOnePageAssessment) {
        handleSubmit(answer);
      }
    }

    if (item?.valueConstraints.removeBackOption) isBackShown = false;

    switch (type) {
      case "checkbox":
        return <Checkbox {...props} isBackShown={isBackShown} handleChange={onChange} values={values} />;
      case "radio":
        return <Radio {...props} isBackShown={isBackShown} handleChange={onChange} values={values} />;
      case "text":
        return <TextInput {...props} isBackShown={isBackShown} handleChange={onChange} values={values} />;
      case "slider":
        return <Slider {...props} handleChange={onChange} values={values} />;
      case "duration":
        return <TimeDuration {...props} handleChange={onChange} values={values} />;
        return <Slider {...props} isBackShown={isBackShown} handleChange={onChange} />;
      case "ageSelector":
        return <AgeSelector {...props} isBackShown={isBackShown} handleChange={onChange} />;
      case "splash":
        return <SplashScreen {...props} isBackShown={isBackShown} />;
      case "dropdownList":
        return <Dropdown {...props} handleChange={onChange} values={values} />;
      default:
        return <div />;
    }
  }

  const ref = useRef();

  useEffect(() => {
    if (props.isNextShown && !isOnePageAssessment) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [props.isNextShown])

  return (
    <Formik
      enableReinitialize
      initialValues={type === 'splash' ? {} : data}
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
