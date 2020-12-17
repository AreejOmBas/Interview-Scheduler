import React from 'react'

// Component for the Header (the line with the time) before each appointment
export default function Header(props) {

  return (
    <header className="appointment__time">
      <h4 className="text--semi-bold">{props.time}</h4>
      <hr className="appointment__separator" />
    </header>
  );
}