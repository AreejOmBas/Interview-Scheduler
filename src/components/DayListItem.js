import React from "react";

import 'components/DayListItem.scss';
import classnames from 'classnames';

export default function DayListItem(props) {
  // css classes selector
  const dayClass = classnames("day-list__item", {
    "day-list__item--selected ": props.selected,
    "day-list__item--full": props.spots === 0
  });

  // format the spot text
  const formatSpots = () => {
    return  props.spots ? `${props.spots} spot(s) remaining` : `no spots remaining`;
  };

  return (
    <li data-testid="day" className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light"> {formatSpots()} </h3>
    </li>
  );
}