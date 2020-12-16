import React from "react";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, queryByText, queryByAltText, getByText, getByPlaceholderText, getAllByTestId, getByAltText } from "@testing-library/react";

import Application from "components/Application";
//import mocked from '../../__mocks__ /axios';
//const axios = require('axios');

afterEach(cleanup);


jest.mock('axios', () => {

  const fixtures = {
    days: [
      {
        id: 1,
        name: "Monday",
        appointments: [1, 2],
        interviewers: [1, 2],
        spots: 1
      },
      {
        id: 2,
        name: "Tuesday",
        appointments: [3, 4],
        interviewers: [3, 4],
        spots: 1
      }
    ],
    appointments: {
      "1": { id: 1, time: "12pm", interview: null },
      "2": {
        id: 2,
        time: "1pm",
        interview: { student: "Archie Cohen", interviewer: 2 }
      },
      "3": {
        id: 3,
        time: "2pm",
        interview: { student: "Leopold Silvers", interviewer: 4 }
      },
      "4": { id: 4, time: "3pm", interview: null }
    },
    interviewers: {
      "1": {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png"
      },
      "2": {
        id: 2,
        name: "Tori Malcolm",
        avatar: "https://i.imgur.com/Nmx0Qxo.png"
      },
      "3": {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png"
      },
      "4": {
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg"
      }
    }
  };
  return {

    defaults: { baseURL: "" },
    get: jest.fn(url => {

      if (url === "/api/days") {

        return Promise.resolve({
          status: 200,
          statusText: "OK",
          data: fixtures.days
        });
      }

      if (url === "/api/appointments") {
        /* Resolve appointments data */
        return Promise.resolve({
          status: 200,
          statusText: "OK",
          data: fixtures.appointments
        });
      }

      if (url === "/api/interviewers") {
        /* Resolve interviewers data */
        return Promise.resolve({
          status: 200,
          statusText: "OK",
          data: fixtures.interviewers
        });
      }
    }),
    put: jest.fn(url => {
      return Promise.resolve({
        status: 204,
        statusText: "No Content"
      });
    }),
    delete: jest.fn(url => {
      return Promise.resolve({
        status: 204,
        statusText: "No Content"
      });
    })
  };


});

describe("Application ", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {

    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();

  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    // console.log(prettyDOM(container));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment,/Lydia Miller-Jones/i)).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day,/no spots remaining/i)).toBeInTheDocument()


  });

  it.only("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Delete"));
  
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you want to delete the appointment?")
    ).toBeInTheDocument();
  
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
  
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
  
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    ); 
   // console.log(prettyDOM(container))
  
    expect(getByText(day, "2 spot(s) remaining")).toBeInTheDocument();
  });






})

