# Digital Neurology

This project aims to allow researchers with limited technical skills to be able to create assessments or surveys easily and efficiently so they can then give to their patients and streamline data collection.

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Routing and Navigation](#routing-and-navigation)
6. [Dependencies and Scripts](#dependencies-and-scripts)
7. [Environment Variables](#environment-variables)
8. [Component Documentation](#component-documentation)
9. [API Routes](#api-routes)

## Overview
This project aimed at addressing the challenges faced in patient-centered research, particularly in the context of data collection and assessment design. The primary issue is the time-consuming and costly nature of study design, exacerbated by the limitations of existing software solutions for data collection. The project aims to empower clinicians and researchers by providing a user-friendly platform to create self-administered assessments and streamline data collection, thus reducing the time and cost associated with study designs. Some key features include allowing researchers to create custom surveys and assessments as well as giving those assessments to their patients.

## Project Structure
- The project has two main directories, the `frontend` directory and the `backend` directory. The `frontend` directory contains the NextJS code used to build the frontend user interface while the `backend` directory contains the FastAPI code used to build the backend API endpoints that call the MongoDB database.
- A proxy server is utilized to redirect all the requests sent to localhost::3000 to point toward localhost::8000. The HTTPCookies authentication mechanism is being used. OAuth2PasswordBearerWithCookie Class: It is designed to handle OAuth2 password flow with an additional feature – extracting the token from an HTTP-only cookie named "X-AUTH." The token is typically sent in the Authorization header in OAuth2, but this modification allows the token to be stored in a secure cookie.

## Installation
### Prerequisites
Before setting up and running your project with Next.js (frontend), FastAPI (backend), and MongoDB (database), make sure you have the following prerequisites installed on your system:

1. Node.js and npm

- Node.js: Download and install the latest version of Node.js from [https://nodejs.org/](https://nodejs.org/).

  To check if Node.js is installed, open a terminal and run:

  ```bash
  node -v
  ```

  Ensure npm (Node Package Manager) is also installed:

  ```bash
  npm -v
  ```

2. Text Editor

- Text Editor: Choose a text editor for writing code. Popular choices include Visual Studio Code, Atom, Sublime Text, or any editor of your preference.

3. Git (Optional)

- Git: While optional, having Git installed is beneficial for version control and collaboration. Download Git from [https://git-scm.com/](https://git-scm.com/).

4. FastAPI (Backend)

- Python: FastAPI is a Python web framework. Install Python from [https://www.python.org/](https://www.python.org/) and ensure it's added to your system's PATH.

  To check if Python is installed, run:

  ```bash
  python --version
  ```

- FastAPI: Install FastAPI and Uvicorn (ASGI server) using pip, Python's package installer:

  ```bash
  pip install fastapi uvicorn
  ```

  You might want to create a virtual environment to isolate your Python dependencies.

5. MongoDB (Database)

- MongoDB: Download and install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).

  Follow the installation instructions for your operating system.

6. MongoDB Client (Optional)

- MongoDB Compass (Optional): MongoDB Compass is a graphical user interface for MongoDB. You can download it from [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass).

Ensure these prerequisites are met before starting your project. Additionally, you may need to install specific npm packages and Python packages depending on the libraries and frameworks you plan to use in your Next.js and FastAPI project.

### FastAPI Setup

Make sure you have Python version: Python 3.10.13 installed
Choose a python development IDE of your choice(preferably PyCharm) and create a virtual environment and do 
Pip install -r requirements.txt
NextJS Setup
1. Clone the Repository:

 Clone the repository of your Next.js project to your local machine.

 ```bash
git clone https://github.com/skhoylow8/MSWE-276P-Digital-Neurology.git
 ```

2. Navigate to the Project Directory:

Move into the project directory using the `cd` command.

 ```bash
 cd your-nextjs-project/frontend
```

3. Install Dependencies:

   Use a package manager (npm or yarn) to install the project dependencies.

   ```bash
   # If using npm
   npm install

   # If using yarn
   yarn install
   ```

4. Run the Development Server:

   Start the development server to run your Next.js application locally.

   ```bash
   # If using npm
   npm run dev

   # If using yarn
   yarn dev
   ```

   This command will start the development server, and you can access your Next.js app at [http://localhost:3000](http://localhost:3000) in your web browser.

5. Explore and Develop:

   Open your code editor and start exploring the project. Make changes to the source code, and the development server will automatically reload your application to reflect the changes.

6. Build for Production:

   When you are ready to deploy your Next.js application, build the project for production.

   ```bash
   # If using npm
   npm run build

   # If using yarn
   yarn build
   ```

   This command will generate an optimized production build of your Next.js app.

7. Run in Production Mode:

   After building for production, you can run your app in production mode.

   ```bash
   # If using npm
   npm start

   # If using yarn
   yarn start
   ```

   Your Next.js application will be accessible at [http://localhost:3000](http://localhost:3000) in production mode.

8. Deployment:

   Deploy your Next.js application to your preferred hosting platform. Popular choices include Vercel, Netlify, and others.

## Usage
This platform is aimed at helping researchers create custom surveys and assessments. For that reason the user flow described here is from the researchers perspective. The researcher can login if they have an existing account. If they don’t have an account they can create one on the “Register” page. Once logged in a researcher will be able to see all the assessments they have created. On this page they will be able to create an assessment, start an assessment or download the results from an assessment if there is data. Once an assessment is started the researcher will hand the laptop over to the patient who will take the assessment. For security reasons the assessment will open up in a new tab so the patient data on the researcher page won’t be accessible to the patient. The platform also contains a page that displays all the surveys a researcher has access to. These surveys are used across all researcher accounts. If the researcher who is logged on created a survey they can edit it or duplicate it as well as view it. However, if they did not create the survey they can only duplicate it. The last tab the researcher can access is the “Participant” tab which shows a list of all their participants and what assessments they have completed as well as when they completed it.

## Routing and Navigation
### Frontend:
In a Next.js project, routing is handled primarily through the `app` directory and the file-based routing system. The `app` directory is a special directory in a Next.js project where each `.js` or `.jsx` file inside it automatically becomes a route in your application. Here's a brief overview of how routing works in a Next.js project structure:

1. App Directory:
   - The `app` directory is where you define the structure of your application routes.
   - Each file named `page.jsx` inside the `app` directory represents a route.
   - The file name corresponds to the URL path. For example, `app/page.tsx` represents the root (`/`) route.

2. Nested Routes:
   - You can create nested routes by creating subdirectories inside the `pages` directory. The file structure represents the nested route structure.
   - For example, in this project there is an `assessment` directory which contains a `start` directory so the path would be `/assessments/start`.

### Backend
The backend structure is divided into following directories:

Models: The models directory has the DTO structure and Model structures that are saved to the mongo database. Each file in the models directory has pydantic models related to a particular entity
Routes: The routes directory has the API endpoints which interact with the database. Each file has the GET, POST and PUT endpoints for the corresponding entities from the models directory.
Utils: The utils directory has utility functions required to work with certain entities

The app.py file has the configuration to connect to the mongo database, the proxy server settings and the routes configuration.
Dependencies and Scripts

All the backend dependencies are listed in requirements.txt while all the frontend dependencies are stated in package.json which are 
"@qualtrics/ui-react": "^2.29.0",
   "axios": "^1.6.0",
   "cookies": "^0.8.0",
   "http-proxy": "^1.18.1",
   "next": "14.0.0",
   "react": "^18",
   "react-dom": "^18",
   "react-inline-editing": "^1.0.10",
   "react-multi-select-component": "^4.3.4",
   "survey-react-ui": "^1.9.117",
   "swr": "^2.2.4",
   "universal-cookie": "^6.1.1"



## Environment Variables

There are no environment variables used up in the project.

## Component Documentation

Please reference the web page in the repository for component documentation. Navigate to `frontend/docs/global.html` to view all the components in the project.

The components in the backend are mainly in the routes, the participants.py file contains all the routes for the participants component which is described below, similarly assessment.py file contains the API for assessment API, survey.py file contains survey routes, auth.py contains the authentication routes, and the response.py file contains the

## API Routes

After giving the path of the backend folder of the project, run the app.py file, on doing that, on your browser, giving the following url: http://localhost:8000/docs#/.