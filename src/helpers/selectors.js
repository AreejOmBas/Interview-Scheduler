

export function getAppointmentsForDay(state, day) {

  const appointmentsId = state.days.filter((dayObj) => (dayObj.name === day))[0];

  if (!appointmentsId) {
    return [];
  }

  const appointmentsArray = appointmentsId.appointments;
  const results = appointmentsArray.map((id) => state.appointments[id]);

  return results;
}

