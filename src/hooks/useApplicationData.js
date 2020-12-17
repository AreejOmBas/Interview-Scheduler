import React, { useState, useEffect } from "react";
import axios from 'axios';


// custom hook to have all the logic for the application
export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  // returns new Days Array with updated spots after booking or deleting (cancel true , means we are deleting )
  const updateSpots = (appointmentId, callback) => {

    // if intreview not null, then it is an edit so no need to update spot
    if (state.appointments[appointmentId].interview) {
      return [];
    }
    //find the day using the appointment Id 
    const currentDay = state.days.find((day) => day.appointments.includes(appointmentId));
    //copy the day array 
    const newDays = [...state.days];
    // find the index of the currentday in newDays array
    let index = newDays.findIndex(day => day.name === currentDay.name);
    // update the spots with the callback
    currentDay.spots = callback(currentDay.spots);
    // update the day in the days array
    newDays[index] = currentDay;

    return newDays;

  };

  const bookInterview = (id, interview) => {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const updatedSpots = updateSpots(id, (spots => --spots));

    return axios.put(`/api/appointments/${id}`, { interview },)
      .then(response => {
        setState((prev) => ({ ...prev, updatedSpots, appointments }))
      });

  };

  // Deleting interview
  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const updatedSpots = updateSpots(id, (spots => ++spots));
    return axios.delete(`/api/appointments/${id}`)
      .then(response => setState((prev) => ({ ...prev, updatedSpots, appointments })));
  }

  // Get data from API and set the sate with the retrieved data
  useEffect(() => {

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')

    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, [])

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }

}