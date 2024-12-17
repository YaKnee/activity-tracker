# Activity Tracker
Activity Tracker is a feature-rich React/Vite application designed to help users effectively manage and track their tasks. It combines an intuitive user interface with robust backend functionality, enabling seamless task creation, modification, and activity tracking.  

With a responsive design and accessibility in mind, the app ensures a smooth experience across devices and user preferences, including support for keyboard navigation, theme switching, and task filtering.  

This project leverages modern libraries and tools for both frontend and backend development, providing an excellent foundation for task management with data visualization capabilities like bar charts and tables.  

## Usage

For instructions on how to setup and run the simple local backend, see the server's [README](https://github.com/YaKnee/activity-tracker/server/README.txt).

To run the React project, simply navigate to the [frontend](https://github.com/YaKnee/activity-tracker/frontend) directory, install the necessary dependencies with `npm install` via the terminal, and then run the project with `npm run dev`. If you __initialised the server with a different port__, make sure to __update the PORT variable in the [api.js](https://github.com/YaKnee/activity-tracker/frontend/src/utils/api.js) file__ before running the project.


## Requirements
- [x] Implement at least 3 different view with seperate content that is easily navigatable with a menu.
- [x] One of the views must be an Info page providing requested information about the project.
- [x] Application can communicate with the [simple local backend](https://github.com/YaKnee/activity-tracker/server/server.js) and automatically retrieve data to be loaded on frontend.
- [x] User can add and delete tasks via the application's UI.
- [x] User can edit tasks' names, and modifiy (create, apply, edit, remove) tasks' tags.
- [x] Changes made via UI are stored in the backend.
- [x] User can filter which tasks to display based on tags.
- [x] User can select pre-existing tags when creating a new task.
- [x] Displayed tasks can be rearranged and sorted.
- [x] Active status of a task is shown, can be altered via the UI, and timestamps of alteration are stored in the backend.
- [x] User can specify a time interval, select a task, and see a table, listed chronologically, of the start and end times at which that task was active.
- [x] User can specify a time interval, select a task, and a bar chart will display, in different units, the total time that task was active for each day in the interval.
- [x] User is able to change the theme of the application via the UI.
- [x] User is able to switch the mode of the application via the UI such that either multiple tasks can be active simultaneously or enforce that only one task can be active at any given time.
- [x] UI must be responsive.
- [x] Application should usable with only keyboard input.

## Libraries and Dependencies

List of libraries and dependencies used for frontend and backend.

### Backend
- [cors](https://www.npmjs.com/package/cors)
- [express](https://www.npmjs.com/package/express)
- [sqlite3](https://www.npmjs.com/package/sqlite3)

### Frontend
- [@mui/base](https://www.npmjs.com/package/@mui/base)
- [@mui/icons-material](https://www.npmjs.com/package/@mui/icons-material)
- [@mui/material](https://www.npmjs.com/package/@mui/material)
- [@mui/x-date-pickers](https://www.npmjs.com/package/@mui/x-date-pickers)
- [bootstrap](https://www.npmjs.com/package/bootstrap)
- [chart.js](https://www.npmjs.com/package/chartjs)
- [eslint](https://www.npmjs.com/package/eslint)
- [react](https://www.npmjs.com/package/react)
- [react-bootstrap](https://www.npmjs.com/package/react-bootstrap)
- [react-dom](https://www.npmjs.com/package/react-dom)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [vite](https://www.npmjs.com/package/vite)