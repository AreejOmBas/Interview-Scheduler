import React, { useState , useEffect} from "react";
import axios from 'axios';

export default function  useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day });
  
  const updateSpots = (appointmentId, cancel = true ) => {
    if (!state.appointments[appointmentId].interview || cancel) {
    
      const currentDay = state.days.find((day) => day.appointments.includes(appointmentId));
      const newDays = [...state.days];
      let index = newDays.findIndex(day =>  day.name === currentDay.name);
      //console.log(currentDay);

      currentDay.spots = (cancel) ? currentDay.spots + 1 : currentDay.spots - 1 ;
      newDays[index] = currentDay;

      return newDays;

    }
    return [];
    
  } 
  const bookInterview = (id, interview) =>  {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    

      const updatedSpots =  updateSpots(id,false);
  
    return axios.put(`/api/appointments/${id}`,{interview},)
    .then(response => {
      setState((prev) => ( {...prev, updatedSpots,appointments}))
    })

  }

  const cancelInterview = (id) => {

   
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const updatedSpots =  updateSpots(id);
      return axios.delete(`/api/appointments/${id}`)
      .then(response => setState((prev) =>( {...prev, updatedSpots, appointments})) )
   
    

  }
  // Get data from API and set the sate with the retrieved data
  useEffect( () => {

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
      
    ]).then((all) => {
      setState(prev => ({...prev, days:all[0].data, appointments: all[1].data, interviewers:all[2].data}));

    });
  },[])


   //setting the day when user clicks 
  
   return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
  
}