
// returns appointments in a given day
export function getAppointmentsForDay(state, day) {

  const dayFound = state.days.find((currentDay) => (currentDay.name === day));

  if (!dayFound) {
    return [];
  }

  const results = dayFound.appointments.map((id) => state.appointments[id]);

  return results;
}

// returns single interview in the foramt {student , interviewer}
export function getInterview(state, interview) {
  let result;
  if (!interview) {
    return null;
  }

  for (let key in state.interviewers) {

    if (state.interviewers[key].id === interview.interviewer) {
      result = {
        student: interview.student,
        interviewer: state.interviewers[key]
      };
    }
  }

  return result;
}

// return available interviewres for a given day
export function getInterviewersForDay(state, day) {

  const dayFound = state.days.find((currentDay) => (currentDay.name === day));

  if (!dayFound) {
    return [];
  }

  const results = dayFound.interviewers.map((id) => state.interviewers[id]);

  return results;
}