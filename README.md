# ION File Reader

A web application for parsing and visualizing Ion file data with a 3D robot model viewer. This project consists of a Node.js backend for parsing Ion files and a React frontend for displaying the data and 3D models.

## Project Structure

- `backend/`: Node.js server for parsing Ion files and providing API endpoints
- `frontend/`: React application built with Vite for visualization

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Ion files containing robot data (to be placed in `backend/data/`)

## Installation

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Ensure your Ion data files are placed in the `data/` directory.

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Start the Backend Server

1. From the backend directory:
   ```
   node server.js
   ```
   The server will start on http://localhost:3000

### Start the Frontend Development Server

1. From the frontend directory:

   ```
   npm run dev
   ```

   The Vite development server will start, usually on http://localhost:5173

2. Open the URL in your browser to access the application.

## Features

- Parse and display Ion file data
- View robot session information
- 3D visualization of robot model
- Playback of robot movement based on position data
- Log console for viewing system messages
- Dark theme UI for better visibility and reduced eye strain

## API Endpoints

- `GET /api/topics`: List all available topics
- `GET /api/topic/:topicName`: Get data for a specific topic
- `GET /api/botModel`: Get the 3D model of the robot

## Troubleshooting

- If the 3D model doesn't load, check that the decompression is working correctly in `helper.js`
- For backend connection issues, ensure the server is running on port 3000
- If position data isn't loading, verify that the `/tb_control/wheel_odom` topic exists in your Ion data

## Development Notes

- The frontend uses react-three-fiber for 3D rendering
- Position data follows ROS coordinate system and is converted to Three.js coordinates in the viewer
- The backend parses Ion files using the ion-js library
- The application uses a dark theme with Material Design inspired colors:
  - Primary color: #bb86fc (purple)
  - Secondary color: #03dac6 (teal)
  - Background: #121212 (dark gray)
  - Surface elements: #1e1e1e (slightly lighter gray)

## License

[MIT License](LICENSE)
