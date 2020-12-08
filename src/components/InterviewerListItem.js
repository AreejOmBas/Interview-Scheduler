// id:number - the id of the interviewer
// name:string - the name of the interviewer
// avatar:url - a url to an image of the interviewer
// selected:boolean - to determine if an interview is selected or not
// setInterviewer:function - sets the interviewer upon selection

import React from 'react';
import './IntreviewerListItem.scss'
import classnames from 'classnames';

export default function InterviewerListItem(props) {

  const interviewerClass = classnames("interviewers__item", {
    "interviewers__item--selected ": props.selected,
    });

  return (

  <li key= { props.id } 
      className={interviewerClass}
      selected={ props.selected }
      onClick={() => props.setInterviewer(props.name)}> 
    <img
      className="interviewers__item-image"
      src={props.avatar}
      alt={props.name}
     
    />
    {props.name}

  </li>
  );
}