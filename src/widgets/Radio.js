import React from 'react';
import _ from "lodash";
import { Form, Row } from 'react-bootstrap';

import Navigator from './Navigator';

const Radio = ({ item, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown }) => (
  <div className="card mb-3" style={{ maxWidth: "auto" }}>
    <div className="row no-gutters">
      <div className="col-md-3 p-3">
        <img src="../../../logo192.png" className="rounded w-h" alt="applet-image" />
      </div>
      <div className="col-md-9">
        <div className="card-body">
          <h5 className="card-title question">{item.question.en}</h5>
          <div className="row no-gutters pl-4">
            <Form.Group as={Row}>
              {_.map(item.valueConstraints.itemList, (obj, i) => (
                <div className="col-md-6" key={i}>
                  <Form.Check label={obj.name.en} name={item.variableName} type="radio" onChange={handleChange} value={obj.value} id={`${item.variableName}${i}`} />
                </div>
              ))}
            </Form.Group>
          </div>
        </div>
      </div>
    </div>
    <Navigator isBackShown={isBackShown} isNextShown={isNextShown} handleBack={handleBack} isSubmitShown={isSubmitShown}/>
  </div>
)

export default Radio;
