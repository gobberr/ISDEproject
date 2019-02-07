# ISDEproject

## Description

This web service offers one-day planning. Using the Google Calendar and EasyRoom APIs, it returns the merge of the events with the free classrooms in which to spend the free time. Check it out! 

## Scenario

1.	Users must sign in with google accounts using Google+ APIs

2.  Select a Google Calendar to get your events	

3. 	Merge of events in the calendar with free classrooms of University of Trento

4.  See your planned day

## Services

1.  Google+ and Google Calendar adapter, integrated in this project

2.  Easyroom service adapter, integrated [in this project](https://github.com/gobberr/easyroom-service/)

3.  Database service adapter, integrated [in this project](https://github.com/gobberr/database-service/)

## Heroku deployment [at this link](https://isde-project.herokuapp.com)

## Local setup

1. Install the dependencies: `npm install`

2. Start the service `npm start`

3. Go to `localhost:3000` and follow the instructions
