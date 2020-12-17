import React from "react";

import { render, cleanup, waitForElement, waitForElementToBeRemoved, fireEvent, prettyDOM, queryByText, queryByAltText, getByText, getByPlaceholderText, getAllByTestId, getByAltText } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";


afterEach(cleanup);

/* Please not for some reason cleanup is not running,
 so to tests #3,4 have to be run alone using .only on each of them at a time, 
otherwise the other tests will affect the expected result  */

describe("Application ", () => {
 
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {

    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    //change the day
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();

  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    const { container } = render(<Application />);
    
    // wait for the data to be loaded 
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // find an appointment 
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // click the add button
    fireEvent.click(getByAltText(appointment, "Add"));

    // adding a student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // choosing an interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // click save button
    fireEvent.click(getByText(appointment, "Save"));

    // wait for saving to be done and the student name appears in the DOM
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, /Lydia Miller-Jones/i)).toBeInTheDocument();

    // find the day and check the spots to be the correct number
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();


  });

  it.skip("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
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

    expect(getByText(day, "2 spot(s) remaining")).toBeInTheDocument();
  });

  it.skip("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {


    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    // find an appointment to edit
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    //click the Edit button 
    fireEvent.click(getByAltText(appointment, "Edit"));

    // change the student name 
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Mike Smith" }
    });
    //change the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    //click Save button 
    fireEvent.click(getByText(appointment, "Save"));

    // wait for the saving to finish and show the new edit it appointment 
    await waitForElement(() => queryByText(appointment, "Mike Smith"));
    expect(getByText(appointment, "Mike Smith")).toBeInTheDocument();

    // find the day Monday to check for the spots 
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot(s) remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {

    axios.put.mockRejectedValueOnce();

    //render the application
    const { container } = render(<Application />);

    // wait for the data to be fetched from the server (fake one )
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // find an appointment to edit
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    //click the Edit button 
    fireEvent.click(getByAltText(appointment, "Edit"));

    // change the student name 
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Mike Smith" }
    });
    //click Save button 
    fireEvent.click(getByText(appointment, "Save"));

    // wait for saving to be done
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    expect(getByText(appointment, "Error Saving Appointment!")).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Close"));

    // wait for the application to render again after the error close button has been clicked 
    await waitForElement(() => getByText(appointment, "Archie Cohen"));

    // this shows that saving did not pass
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {

    // mock axios delete reject
    axios.delete.mockRejectedValueOnce();

    //render the application
    const { container } = render(<Application />);

    // wait for the data to be fetched from the server (fake one )
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // find an appointment to edit
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    //click the Edit button 
    fireEvent.click(getByAltText(appointment, "Delete"));

    //click Save button 
    fireEvent.click(getByText(appointment, "Confirm"));

    // wait for saving to be done
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    expect(getByText(appointment, "Error Deleting Appointment!")).toBeInTheDocument();

    // click the close button 
    fireEvent.click(getByAltText(appointment, "Close"));

    // wait for the application to render again after the error close button has been clicked 
    await waitForElement(() => getByText(appointment, "Archie Cohen"));

    // this shows that deleting did not pass
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();

  });

});

