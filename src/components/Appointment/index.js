import React from 'react'

import useVisualMode from "hooks/useVisualMode";

import Header from "components/Appointment/Header.js";
import Empty from "components/Appointment/Empty.js";
import Show from "components/Appointment/Show.js";
import Form from "components/Appointment/Form.js";
import Status from "components/Appointment/Status.js";
import Confirm  from "components/Appointment/Confirm.js";
import Error  from "components/Appointment/Error.js";

import './styles.scss';


export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";


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
    .then(response => transition(SHOW))
    .catch(err => transition(ERROR_SAVE,true))
  };

  const deleteAppointment = () =>{
    transition(DELETING,true);

    props.cancelInterview(props.id)
    .then(response => transition(EMPTY))
    .catch(err => transition(ERROR_DELETE,true))
  };

  const showConfirmation = () => {
    transition(CONFIRM);
  }
  const showForm = () => {
    transition(EDIT);
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete = {showConfirmation}
          onEdit = {showForm}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers}
         onSave={save}
         onCancel={back}/>
      )}
      {mode === EDIT && (
        <Form name={props.interview.student}
            interviewers={props.interviewers}
            interviewer={props.interview.interviewer.id}
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
      {mode === ERROR_DELETE && (
        <Error message = {"Error Deleting Appointment!"} 
              onClose = {back}/>
      )}
       {mode === ERROR_SAVE && (
        <Error message = {"Error Saving Appointment!"} 
              onClose = {back}/>
      )}


    </article>

  )
}