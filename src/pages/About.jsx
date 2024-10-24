import React from "react";
import "../styles/App.css";

function About() {
  return (
    <>

      <section>
        <h3>Author: <em><strong>Jani O&#39;Connell</strong></em></h3>
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
        <table id="credit-table">
          <caption>
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
              <td>Video</td>
              <td>___</td>
              <td><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">yt</a></td>
            </tr>
            <tr>
              <td>something</td>
              <td>MIT</td>
              <td><a href="https://github.com/facebook/react/tree/main" target="_blank">something</a></td>
            </tr>
            <tr>
              <td>RoughViz Charts</td>
              <td>MIT</td>
              <td><a href="https://github.com/jwilber/roughViz" target="_blank">GitHub</a></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h3>AI Usage:</h3>
        <ul>
          <li>
            <p>CSS for task-buttons. When I clicked edit button and rendered the other buttons, it messed up the sizing of the table
              and components were leaking over, so I asked ChatGPT to help fix it.
            </p>
          </li>
        </ul>

      </section>
      <section>
        <h3>Time spent: <em>8 hours</em></h3>
      </section>
      <section>
        <h3>Most complex feature:</h3>
        <p><strong>What:</strong> Task addition</p>
        <p><strong>Why:</strong> Managing dates and state logic for each individual task is quite hard.</p>
      </section>
    </>
  );
}
export default About;
