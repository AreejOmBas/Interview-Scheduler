import React from 'react';
import './InterviewerList.scss'


import InterviewerListItem from './InterviewerListItem.js'

// interviewers:array - an array of objects containing the information of each interviewer
// interviewer:number - the id of an interviewer
// setInterviewer:function - a function that accepts an interviewer id
export default function IntreviewerList(props) {

  const intereviewers = props.interviewers.map((interviewer) => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        selected={interviewer.id === props.interviewer}
        setInterviewer={event => props.setInterviewer(interviewer.id)}
        avatar = {interviewer.avatar}
      />
    );
  });

  return ( 
    <section className="interviewers">
        <h4 className="interviewers__header text--light">Interviewer</h4>
        <ul className="interviewers__list"> 
          {intereviewers}
        </ul>
       
  </section>
  )
}


