import React from 'react'

import Header from "components/Appointment/Header.js";
import Empty from "components/Appointment/Empty.js";
import Show from "components/Appointment/Show.js";

import './styles.scss';


export default function Appointment(props) {

return (
  <article className="appointment">
    <Header time={props.time}/>
    {props.interview ? <Show onEdit={props.onEdit}
    onDelete={props.onDelete}
    student={props.interview.student}
    interviewer={props.interview.interviewer}/> : <Empty onAdd={props.onAdd}/>}





  </article>
  
  )
}