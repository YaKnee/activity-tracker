import React from "react";

import { Table } from "react-bootstrap";

function About({ darkMode }) {
  return (
    <>
      <section>
        <h3>
          Author:{" "}
          <em>
            <strong>Jani O&#39;Connell</strong>
          </em>
        </h3>
      </section>

      <section>
        <h3>Instructions:</h3>
        <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
          I believe that I have designed this app so that explicit intructions
          for use are unnecessary. I have added pointers and tips that guide the
          user to navigate the app easily. However, what is not readily
          apparent, is that one can add either tasks or tags from the same
          submission area (see "Manager"). While the button does change text and
          there are alerts assisting you, it could probably be more apparent.
        </p>
      </section>

      <section id="about-credits">
        <h3>Accredidation: </h3>
        <Table variant="dark" striped hover id="credit-table">
          <caption style={{ color: darkMode ? "#DDDDDD" : "#282828" }}>
            Assets used and their respective licences
          </caption>
          <thead>
            <tr>
              <th>Item</th>
              <th>Licence</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Brand</td>
              <td>none</td>
              <td>Self-made</td>
            </tr>
            <tr>
              <td>Icons for Buttons and Links</td>
              <td>MIT</td>
              <td>
                <a
                  href="https://mui.com/material-ui/material-icons/"
                  target="_blank"
                >
                  MUI Icons
                </a>
              </td>
            </tr>
          </tbody>
        </Table>
      </section>

      <section>
        <h3>AI Usage:</h3>
        <ul>
          <li>
            <p>Used for generating missing comments</p>
          </li>
          <li>
            <p>
              Calculating the average total time in DailyBarChart component and
              copying it to an array the same size as the dayEntries array.
            </p>
          </li>
        </ul>
      </section>
      <section>
        <h3>
          Time spent: <em>~92 hours</em>
        </h3>
      </section>
      <section>
        <h3>Most complex feature:</h3>
        <p>
          <strong>What:</strong> Calculating daily active times for the bar
          chart
        </p>
        <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
          <strong>Why: </strong>
          There were numerous edge cases to consider, and because the test data
          we initially generated had a type 0 timestamp as the first entry
          (which is no longer possible with my current setup from the user
          side), I had to carefully think through every possible scenario for
          how the timestamps could be calculated. While there is definitely a
          simpler solution, this one works for now, so I'm leaving it as is
          without further changes.
        </p>
      </section>
    </>
  );
}
export default About;
