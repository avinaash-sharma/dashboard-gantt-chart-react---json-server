# Project Status Dashboard

This is a React-based project status dashboard that provides a comprehensive overview of a project's progress, including key metrics, milestones, and financial data.

## Features

- **Dashboard View**: A central hub displaying key project metrics like overall progress, delays, and financial summaries.
- **Milestone Tracking**: A detailed table of project milestones, their status, and deadlines.
- **Financial Overview**: Cards for revenue, gross margin, and resource burn.
- **Gantt Chart**: A visual representation of the project timeline and milestone dependencies.
- **Data Management**: A simple interface to manage the underlying project data.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/project-status-dashboard.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd project-status-dashboard
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To run the application in a development environment, use the following command:

```bash
npm run dev
```

This will start both the Vite development server for the React application and a `json-server` to serve the project data from `src/data/projectData.json`.

The application will be available at `http://localhost:5173`, and the mock API will be running on `http://localhost:3001`.

## Available Scripts

-   `npm run dev`: Starts the development server for both the frontend and the mock API.
-   `npm run dev:vite`: Starts only the Vite development server.
-   `npm run dev:api`: Starts only the `json-server`.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the source code using ESLint.
-   `npm run preview`: Previews the production build locally.

## Project Structure

The project is structured as follows:

-   `src/`: Contains the main source code for the application.
-   `src/assets/`: Static assets like images and icons.
-   `src/components/`: Reusable React components.
-   `src/data/`: Mock data for the project.
-   `src/hooks/`: Custom React hooks.
-   `src/services/`: Services for interacting with APIs.
-   `public/`: Public assets that are not processed by Vite.
-   `dist/`: The production build of the application.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.