import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";

import DayList from 'components/DayList';
import Appointment from 'components/Appointment';
import { getAppointmentsForDay } from "helpers/selectors";



export default function Application(props) {
 
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  //setting the day when user clicks 
  const setDay = day => setState({ ...state, day });
  // getting all appointments for the selected day
  const dailyAppointments = getAppointmentsForDay(state,state.day);

  // Iterate through the appointments list to generate Appointment components 
  const appointmentList = dailyAppointments.map( (appointment) => {
    return (
      <Appointment key={appointment.id} {...appointment} />)
  })

  // Get data from API and set the sate with the retrieved data
  useEffect( () => {

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      
    ]).then((all) => {
      setState(prev => ({...prev, days:all[0].data, appointments: all[1].data}));
    });
  },[])


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
