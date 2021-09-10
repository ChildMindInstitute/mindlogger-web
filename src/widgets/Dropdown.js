import React from 'react';
import { Row, Card, Col, Image } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import _ from 'lodash';
import { isArray } from 'util';

import Navigator from './Navigator';
import Markdown from '../components/Markdown';

const Dropdown = (props) => {
  const { item, watermark, values, answer, isBackShown, isNextShown, handleChange, handleBack, isSubmitShown } = props;
  const { multipleChoice: isMultipleChoice } = item.valueConstraints;

  const isNextDisable = !answer && answer !== 0;
  const valueType = item.valueConstraints.valueType;
  const token = valueType && valueType.includes('token');

  const invertColor = (hex) => {
    let hexcolor = hex.replace('#', '');
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);
    let yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#333333' : 'white';
  };

  const options = item.valueConstraints.itemList.map((obj) => ({
    name: obj.name.en,
    value: token ? obj.name.en : obj.value,
  }));
  const { color } = options[0];
  const answers = answer ? (isArray(answer.value) ? answer.value : [answer.value]) : [];
  const selectedValues = options.filter((obj) => answers.includes(obj.value));

  const onChange = (selectedList) => {
    if (isMultipleChoice) {
      handleChange({ value: selectedList.map((obj) => obj.value) });
    } else {
      handleChange({ value: selectedList[0].value });
    }
  };

  return (
    <Card className="mb-3" style={{ maxWidth: 'auto' }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            <Card.Title className="question">
              {watermark && <Image className="watermark" src={watermark} alt="watermark" rounded />}
              <div className="markdown">
                <Markdown markdown={item.question.en.replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2')} />
              </div>
            </Card.Title>
            <div className="no-gutters">
              <Multiselect
                singleSelect={!isMultipleChoice}
                options={options}
                selectedValues={selectedValues}
                onSelect={onChange}
                onRemove={onChange}
                displayValue="name"
                style={{
                  option: {
                    color: color ? invertColor(color) : '#333333',
                  },
                }}
                disable={!isNextShown}
              />
            </div>
          </Card.Body>
        </Col>
      </Row>
      <Navigator
        isBackShown={isBackShown}
        isNextShown={isNextShown}
        isNextDisable={isNextDisable}
        handleBack={handleBack}
        answer={answer}
        isSubmitShown={isSubmitShown}
      />
    </Card>
  );
};

export default Dropdown;
