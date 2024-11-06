import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinkIcon from "@mui/icons-material/Link";

function Home({ tasks, tags, timestamps, showSnackbar }) {
  return (
    <>
      <section>
        <h1>Activity Tracker</h1>
        <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
          In this website, you can freely manage all your tasks at the click of
          a button. It provides different views to monitor and analyse your
          current tasks, providing graphs and tables to easily track your most
          important tasks. You can assign tags to these tasks to easily group
          common tasks together, for easier review.
        </p>
      </section>
      <section style={{ marginBottom: "50px" }}>
        <h3>Previews:</h3>
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            width: "100%",
            boxSizing: "border-box",
            textAlign: "justify", 
            textJustify: "inter-word"
          }}
        >
          <Card
            sx={{
              maxWidth: 325,
              display: "flex",
              flexDirection: "column",
              margin: "20px",
              padding: "5px",
            }}
          >
            <CardMedia
              sx={{ height: 400 }}
              image="manager_preview.png"
              title="Task Manager Preview"
            />
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h5" component="div">
                Manager
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Tasks
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                This section allows you to create, edit, delete and monitor
                tasks. You are also able to create and delete tags in this
                section.
              </Typography>
            </CardContent>
            <CardActions>
              <Link to="/task-manager">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<LinkIcon />}
                >
                  Manager
                </Button>
              </Link>
            </CardActions>
          </Card>

          <Card
            sx={{
              maxWidth: 325,
              display: "flex",
              flexDirection: "column",
              margin: "20px",
              padding: "5px",
            }}
          >
            <CardMedia
              sx={{ height: 400 }}
              image="daily_preview.png"
              title="Daily Times Preview"
            />
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h5" component="div">
                Daily Active Times
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Displays
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                This section provides you with a bar chart depicting daily
                active times for a chosen task within a chosen range. You can
                change the units of feedback from seconds to hours for better
                precision.
              </Typography>
            </CardContent>
            <CardActions>
              <Link to="/daily-times">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<LinkIcon />}
                >
                  Bar Chart
                </Button>
              </Link>
            </CardActions>
          </Card>

          <Card
            sx={{
              maxWidth: 325,
              display: "flex",
              flexDirection: "column",
              margin: "20px",
              padding: "5px",
            }}
          >
            <CardMedia
              sx={{ height: 400 }}
              image="interval_preview.png"
              title="Activity Interval Preview"
            />
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h5" component="div">
                Task Activity Timeline
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Displays
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                This section provides you with a table depicting the time
                starting and ending times of when a task has been active within
                a chosen range, with second precision. It shows any interval
                that overlaps the range chosen.
              </Typography>
            </CardContent>
            <CardActions>
              <Link to="/activity-timeline">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<LinkIcon />}
                >
                  Table
                </Button>
              </Link>
            </CardActions>
          </Card>

          <Card
            sx={{
              maxWidth: 325,
              display: "flex",
              flexDirection: "column",
              margin: "20px",
              padding: "5px",
            }}
          >
            <CardMedia
              sx={{ height: 400 }}
              image="settings_preview.png"
              title="Settings Preview"
            />
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom component="div">
                Settings
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                This section allows you to change the current theme between
                light and dark mode. You can also change th emode of the Task
                Manager so that you can have multiple tasks active at the same
                time, or limit it to only one task active at any given moment.
              </Typography>
            </CardContent>
            <CardActions>
              <Link to="/settings">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<LinkIcon />}
                >
                  Settings
                </Button>
              </Link>
            </CardActions>
          </Card>

          <Card
            sx={{
              maxWidth: 325,
              display: "flex",
              flexDirection: "column",
              margin: "20px",
              padding: "5px",
            }}
          >
            <CardMedia
              sx={{ height: 400 }}
              image="about_preview.png"
              title="About Preview"
            />
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom component="div">
                About
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                This section provides extra information on how to use the
                application, accredits for content usage, as well as
                highlighting the most difficult aspect in developing this app.
              </Typography>
            </CardContent>
            <CardActions>
              <Link to="/about">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<LinkIcon />}
                >
                  About
                </Button>
              </Link>
            </CardActions>
          </Card>
        </div>
      </section>
    </>
  );
}

export default Home;
