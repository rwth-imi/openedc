# eCRF

## About The Project
Open electronic data capture (EDC) software for subject related research projects.
This project is a prototype for managing eCRFs (electronic case report form). It is developed to show a scenario for a desktop app and web app.

## Getting Started

To get a local copy up and running follow these simple steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
   
### Development

#### Web application
```
npm run serve
```
This comand starts the system as web application. You have to manually start the server with
```
noder src/backend/server.js
```
Now the application is available under http://localhost:8080.
#### electron application
```
npm run electron:serve
```
This command starts the system as electron app. The server starts automatically. If you want to change the server it is recommanded to start the server manually and disable the automatic server start. This is done in `background.ts` where the server is required.
The electron app starts automatically.

### Building
#### Web application
```
npm run build
```
This builds the system as web application. Database and uploads are saved, where the built is started.

#### electron application
```
npm run electron:build
```
This builds the system as electron application. Database and uploads are saved in the local app data folder of the user.
To install the application double-click on the exe file in the dist_electron folder.
