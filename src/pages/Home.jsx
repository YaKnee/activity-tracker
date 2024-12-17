import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinkIcon from "@mui/icons-material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function ImageWithLoader({ src, alt, sx }) {
  const [loading, setLoading] = useState(true);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      {loading && (
        <CircularProgress
          sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
      )}
      <CardMedia
        component="img"
        sx={{ ...sx, display: loading ? "none" : "block" }}
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
      />
    </Box>
  );
}

function Home() {
  return (
    <>
      <section>
        <h1>Activity Tracker</h1>
        <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
          Welcome to the Activity Tracker app. In this website, you can freely
          manage all your tasks at the click of a button. It provides different
          views to monitor and analyse your current tasks, providing graphs and
          tables to easily track your most important tasks. You can assign tags
          to these tasks to easily group common tasks together, for easier
          review.
        </p>
      </section>
      <section style={{ marginBottom: "50px" }}>
        <h3>Previews:</h3>
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            width: "100%",
            boxSizing: "border-box",
            textAlign: "justify",
            textJustify: "inter-word",
          }}
        >
          <Card
            raised
            className="my-2"
            sx={{
              minWidth: 300,
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
              border: "2px solid black",
            }}
          >
            <ImageWithLoader
              src="manager_preview.jpg"
              alt="Task Manager Preview"
              sx={{ height: 300, padding: 1 }}
            />
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h5" component="div">
                Manager
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Tasks
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Access the main hub for creating, editing, and organizing tasks.
                You are also able to create and delete tags in this section for
                easy categorisation and efficient task grouping.
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
            raised
            className="my-2"
            sx={{
              minWidth: 300,
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
              border: "2px solid black",
            }}
          >
            <CardMedia
              component="img"
              sx={{ height: 300, padding: 1 }}
              image="daily_preview.jpg"
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
                change the units of feedback from seconds to hours for a more
                precise understanding of task durations.
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
            raised
            className="my-2"
            sx={{
              minWidth: 300,
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
              border: "2px solid black",
            }}
          >
            <CardMedia
              component="img"
              sx={{ height: 300, padding: 1 }}
              image="interval_preview.jpg"
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
                Explore your task history with precise interval tracking. This
                section provides you with a table depicting the starting and
                ending times of when a task has been active within a chosen
                range, with second precision. It shows any interval that
                overlaps the range chosen.
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
            raised
            className="my-2"
            sx={{
              minWidth: 300,
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
              border: "2px solid black",
            }}
          >
            <CardMedia
              component="img"
              sx={{ height: 300, padding: 1 }}
              image="settings_preview.jpg"
              title="Settings Preview"
            />
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom component="div">
                Settings
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Modify the app's theme and behavior to match your preferences.
                Switch between light and dark modes or adjust how tasks are
                managed so that you can have multiple tasks active at the same
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
            raised
            className="my-2"
            sx={{
              minWidth: 300,
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
              border: "2px solid black",
            }}
          >
            <CardMedia
              component="img"
              sx={{ height: 300, padding: 1 }}
              image="about_preview.jpg"
              title="About Preview"
            />
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom component="div">
                About
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                This section provides extra information on how to use the
                application, acknowledgments for resources used, as well as
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
