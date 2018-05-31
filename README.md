# Code challenge

## Description
created a Node.js project using Express and defining the API for the reporting.
The newly created service's reporting endpoint will be called whenever a song has been learnt.

### Assumption
- This end point assumes that data is stored in a mongo database.
- The user id and song id are both strings.
- The location is a json object with street, city state etc. as values. 
- A resource endpoint is needed to perform a basic CRUD

### Requirements
- Ensure you have Node.JS and Mongo DB installed on your system

## Local Setup
- Unzip folder to any directory of your choice.
- Rename .env.example to .env and update the environment config to match your local setup
- Install all required dependencies with `npm install`
- Start the application with `npm run dev`

### Testing
- Run Test with `npm test` command
