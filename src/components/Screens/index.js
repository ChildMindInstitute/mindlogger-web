import React, { useState } from 'react';
import _ from "lodash";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import Avatar from 'react-avatar';

// Component
import Item from '../Item';

// Constants
import { activity } from "../../util/constants";

const Screens = () => {
  const items = []
  const { activityId } = useParams();
  const [data, setData] = useState({});
  const [activeIndex, setActiveIndex] = useState(1);
  const { applet, activityAccess } = useSelector(state => state.applet);

  const handleNext = (values) => {
    setData({ ...data, ...values })
    setActiveIndex(activeIndex + 1);
  }

  const handleBack = () => {
    setActiveIndex(activeIndex - 1);
  }

  // for dummy data
  // activity.items.forEach((item, i) => {
  //   items.push(
  //     <Item
  //       data={data}
  //       type={item.inputType}
  //       key={item.id}
  //       item={item}
  //       handleSubmit={handleNext}
  //       handleBack={handleBack}
  //       isBackShown={i > 0}
  //       isNextShown={activeIndex === i + 1}
  //       isSubmitShown={i < activity.items.length - 1}
  //     />
  //   );
  // });
  activityAccess.items.forEach((item, i) => {
    items.push(
      <Item
        data={data}
        type={item.valueConstraints.multipleChoice === true ? "checkbox" : item.inputType}
        key={item.id}
        item={item}
        handleSubmit={handleNext}
        handleBack={handleBack}
        isBackShown={i > 0 && activeIndex === i + 1}
        isNextShown={activeIndex === i + 1}
        isSubmitShown={i < activityAccess.items.length - 1}
      />
    );
  });

  return (
    <div className="container">
      <Row className="mt-5 activity">
        <Col sm={24} xs={24} md={3}>
          <Card className="hover">
            <div className="pr-4 pl-4 pt-4">
              {applet.image ?
                <Card.Img variant="top" src={applet.image} className="rounded border w-h" />
                :
                <Avatar name={applet.name.en} maxInitials={2} size="254" round="3px" />
              }
            </div>
            <Card.Body>
              <Card.Text>{applet.name.en}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={24} xs={24} md={9}>
          {_.map(items.slice(0, activeIndex))}
        </Col>
      </Row>
    </div>
  )
}

export default Screens;
