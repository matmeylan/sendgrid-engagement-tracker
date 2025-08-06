# Sendgrid Engagement Tracker Hub (SETH)

The goal for this project is to provide extended insights from engagement events from what sendgrid provides out of the box.

1. Email level analytics on email opens
2. Email level analytics on email link clicks

## How does it work ?

This service is a simple web server that exposes a `POST /webhook` endpoint that is designed to work with [sendgrid engagement events](https://www.twilio.com/docs/sendgrid/for-developers/tracking-events/event#engagement-events).
The server will store every event in a sqlite database.

The service exposes a `GET /` endpoint that is a simple HTML page allowing you to choose filters to extract the events in a CSV format.
The page will redirect you, with the chosen filters, to `GET /events` that will produce a CSV with the filters applied.

## Security

Pages are secured with HTTP basic authentication, and TLS.

## Development & Release

```deno task dev```

Spins a dev server locally, with file watch that reloads the server on every change

```deno task deploy:local``` 

Builds a docker image and run it locally, this is the closest to what a deployment would look like

```deno task deploy```

Uses [kamal](https://kamal-deploy.org/) to deploy.