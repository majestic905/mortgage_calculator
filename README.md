# Mortgage calculator / Ипотечный калькулятор

## Installation

~~~ sh
$ git clone https://github.com/majestic905/mortgage_calculator.git
$ cd mortgage_calculator
$ npm install
$ npm install -g firebase-tools
$ firebase login
$ firebase init
~~~

Use the following answers:
1) Which Firebase CLI features do you want to set up for this folder? **Database**, **Hosting**
2) Create new project
3) Specify a unique project id
2) What file should be used for Database Rules? **database.rules.json**
3) File database.rules.json already exists. Do you want to overwrite it? **No**
4) What do you want to use as your public directory? **build**
5) Configure as a single-page app (rewrite all urls to /index.html)? **Yes**
6) Set up automatic builds and deploys with GitHub? **No**

~~~ sh
$ firebase apps:create web
$ firebase apps:sdkconfig web
~~~

Create .env file. You must copy data from the output of the last command and .env's content must be:
```
REACT_APP_API_KEY=<"apiKey" property value>
REACT_APP_AUTH_DOMAIN=<"authDomain" property value>
REACT_APP_DATABASE_URL=<"databaseURL" property value>
REACT_APP_PROJECT_ID=<"projectId" property value>
REACT_APP_STORAGE_BUCKET=<"storageBucket" property value>
REACT_APP_MESSAGING_SENDER_ID=<"messagingSenderId" property value>
REACT_APP_APP_ID=<"appId" property value>
REACT_APP_VERSION=$npm_package_version
```

Then run
~~~ sh
$ npm run build
$ firebase deploy
~~~

Finally,
* Head to [Firebase console](https://console.firebase.google.com/), to the Authentication section
* Set up sign-in method, choose Email/Password
* Add a user
* Head to the app's URL you were given at deploy step and log in
