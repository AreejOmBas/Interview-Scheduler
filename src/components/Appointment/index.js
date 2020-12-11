import React from 'react'

import useVisualMode from "hooks/useVisualMode";

import Header from "components/Appointment/Header.js";
import Empty from "components/Appointment/Empty.js";
import Show from "components/Appointment/Show.js";
import Form from "components/Appointment/Form.js";
import Status from "components/Appointment/Status.js";
import Confirm  from "components/Appointment/Confirm.js";

import './styles.scss';


export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id,interview)
    .then(response => transition(SHOW));
    
  };
  const deleteAppointment = () =>{
    transition(DELETING);
    props.cancelInterview(props.id)
    .then(response => transition(EMPTY));
  };
  const showConfirmation = () => {
    transition(CONFIRM);
  }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete = {showConfirmation}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers}
         onSave={save}
         onCancel={back}/>
      )}
      {mode === SAVING && (
        <Status message = {"Saving"} />
      )}
       {mode === CONFIRM && (
        <Confirm message = {"Are you sure you want to delete the appointment?"} 
        onCancel={back}
        onConfirm = {deleteAppointment}/>
      )}
      {mode === DELETING && (
        <Status message = {"Deleting"} />
      )}



    </article>

  )
}