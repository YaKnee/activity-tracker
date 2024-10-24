import React from "react";
import "../styles/App.css";

function Settings({ settings, setSettings }) {

  //When change mode to only one active
  //update all tasks except the most recent to be inactive
  
  return (
    <>

      <section id="setting-theme">
        <h3>Themes:</h3>
        <p>WHAT DO I ACTUALLY WANT TO CHANGE?? Button, background, font (maybe)</p>
        <div id="theme-buttons">
          <button id="theme-button-light">Light</button>
          <button id="theme-button-dark">Dark</button>
          <button id="theme-button-rainbow" className="outline-text">Rainbow?</button>
        </div>
      </section>

      <section id="setting-mode">
        <h3>Mode Selection:</h3>
        <p>NEED MORE MODES?</p>
        <label>
          <input type="radio" value="multi" name="modeSelect" defaultChecked/>
          Multiple active tasks at a time.<br />
        </label>
        <label>
          <input type="radio" value="single" name="modeSelect"/>
          Only one active task at a time.<br />
        </label>
      </section>

      <section>
        <p>WHAT ELSE WOULD I NEED TO ADD? OR SHOULD ADD? <strong><u>COME BACK</u></strong></p>
      </section>
    </>
  );
}
export default Settings;
