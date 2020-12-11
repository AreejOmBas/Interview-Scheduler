import React from "react";
import axios from 'axios';

import "components/Application.scss";

import DayList from 'components/DayList';
import Appointment from 'components/Appointment';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from 'hooks/useApplicationData';



export default function Application(props) {
 
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

 // getting all appointments for the selected day
 const dailyAppointments = getAppointmentsForDay(state,state.day);
  const interviewres =  getInterviewersForDay(state,state.day)
  // Iterate through the appointments list to generate Appointment components 
  const appointmentList = dailyAppointments.map( (appointment) => {
    const interview = getInterview(state, appointment.interview);
    

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers = {interviewres}
        bookInterview = {bookInterview}
        cancelInterview = {cancelInterview}
      />
    );
    })
  

  return (

    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
        {/* Replace this with the sidebar elements during the "Project Setup & Familiarity" activity. */}
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>

  );
}
