# Plix

Plix is a location based social media application for sharing images and experiences. 

## User stories

As an explorer I want to share my journies so others can learn about my experiences.

As a socially interverted person I want to be able to view what my friends are up to so I can stay home.

As an insicure tween I want to share my every moment so others can give me approval. 

## Technologies Used

Node packages: aws-sdk, bcrypt, body-parser, busboy-body-parser, dotenv, express, express-session, flash, morgan, mustache-express, node-fetch, passport, passport-local, pg-promise, sharp

APIs: Google Maps Geolocation API, Google Maps JavaScript API, Google Places API Web Service, Google Static Maps API

## Wireframes

Since the functionality of this app is directed to someone who is on the go, I decided to do mobile first-designs. From these wireframes I later expanded the design to work for desktop.

Landing Page

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/landing.jpg?token=AAAApkjELJDfJNxv1iUb9w58NpTCZomiks5Y0dp7wA%3D%3D)

Sign Up

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/signup.jpg?token=AAAApktBUeCS0I9G1RAnpfFUxge5LoQlks5Y0dq-wA%3D%3D)

Log In

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/login.jpg?token=AAAApvyzZ99eM7TFHc533hW7pwT-tHIpks5Y0dqMwA%3D%3D)

User's Plix

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/list.jpg?token=AAAApgFxRBp7pIEVapepabJBbf5KrjIGks5Y0dqEwA%3D%3D)

Navigation

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/nav.jpg?token=AAAApu7WPZsABEYgDU5d3LRs9cvoVUWkks5Y0d0owA%3D%3D)

Upload Plix

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/upload.jpg?token=AAAAprJBEEj0__MyCoz0D5ld1uoLtRQLks5Y0drJwA%3D%3D)

View Nearby

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/nearby.jpg?token=AAAApvaTS_xyik4hBQdzUlXSvQTWgyO0ks5Y0dqlwA%3D%3D)

Search Location

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/search.jpg?token=AAAApsJPsgqYOr8aqb80h9VklQxVsqhRks5Y0dqwwA%3D%3D)

View Plix

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/view.jpg?token=AAAApp_AypE4avpkyejeIFM-0hdGZXUJks5Y0drawA%3D%3D)

View Plix - when uploaded by user

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/view-owner.jpg?token=AAAApnKv0sHSQs9J3V-bgNLcbzHZg8c9ks5Y0drSwA%3D%3D)

Edit Plix

![](https://git.generalassemb.ly/raw/JackieCasper/turtle-project-2/master/public/img/wireframes/edit.jpg?token=AAAApth4Qf0PeQEwunArRaIF69FUB0Ceks5Y0dptwA%3D%3D)

## Installation Instructions

In terminal while in the root directory run:

```npm install```

```createdb plix```

```psql -d plix -f /config/seeds.sql```

Create an aws account and make an S3 bucket

Create a google api account and add the following apis:
Google Maps Geolocation API, Google Maps JavaScript API, Google Places API Web Service, Google Static Maps API

Run ```touch .env``` in the terminal

Add the following to the .env file - replacing the keys and urls with your own:

```PLACES_KEY=YOUR_GOOGLE_API_KEY

S3_BUCKET=YOUR_S3_BUCKET_NAME

AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY

AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY

DATABASE_URL=postgres://YOUR_USERNAME@localhost:5432/plix

AWS_ROOT_URL=YOUR_AWS_ROOT_URL```

run ```node app.js``` in the terminal

go to localhost:3000 in your browser

Enjoy!