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
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
          ea error quaerat exercitationem libero, totam minus explicabo incidunt
          sit voluptates blanditiis velit reiciendis nemo, nulla quos earum
          dignissimos, aliquid tenetur non fuga iusto praesentium eos? Odit,
          ipsam? Consequuntur adipisci, tempora sunt unde aspernatur dignissimos
          nisi veniam ipsam blanditiis ab beatae perferendis mollitia commodi
          possimus minus, error molestiae at! Nemo numquam accusantium odit
          quidem corporis illum, dolor illo? Id, recusandae deleniti!
          Temporibus, adipisci. Voluptas repellat deserunt sequi blanditiis
          itaque quo ducimus laudantium totam placeat officiis, quasi voluptate
          dicta tempore atque, corporis vel doloremque esse fugiat culpa quae
          recusandae et non? Odio.
        </p>
      </section>

      <section id="about-credits">
        <h3>Accredidation: </h3>
        <Table variant="dark" striped hover id="credit-table">
          <caption>Assets used and their respective licences</caption>
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
            <tr>
              <td>something</td>
              <td>MIT</td>
              <td>
                <a
                  href="https://github.com/facebook/react/tree/main"
                  target="_blank"
                >
                  something
                </a>
              </td>
            </tr>
            <tr>
              <td>RoughViz Charts</td>
              <td>MIT</td>
              <td>
                <a href="https://github.com/jwilber/roughViz" target="_blank">
                  GitHub
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
            <p></p>
          </li>
          <li>
            <p>
              Calculating the average total time for the bar chart and copying
              it to an array the same size as the dayEntries array.
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
        <p>
          <strong>Why: </strong>
          There were just so many edge cases that needed to be considered and
          due to the test data that we had that was generated on initialisation
          having type 0 as the first timestamp (impossible now with my current
          setup from user end), I had to think and think and think of all
          possibilities of how the timestamps could be calculated. There
          definitely is a much easier way but, at this point, it works so I will
          not alter it any further.
        </p>
      </section>
    </>
  );
}
export default About;
