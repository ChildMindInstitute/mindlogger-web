import React from 'react';

import "./style.css";

// Widgets
import Radio from '../../widgets/Radio';
import TextInput from '../../widgets/TextInput';
import Checkbox from '../../widgets/Checkbox';

export const Item = ({ type }) => {

  let widget;

  switch (type) {
    case "radio":
      widget = <Radio />;
      break;
    case "checkbox":
      widget = <Checkbox />;
      break;
    case "textinput":
      widget = <TextInput />;
      break;

    default:
      widget = <div />;
      break;
  }

  return widget;
}

export default Item;
