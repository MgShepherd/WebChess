# Web Chess

A Chess game built to run in the browser.

This project uses plain javascript, with some additional type checking through the use of jsdoc comments.

## Running the Project

Due to the fact that this project uses Javascript modules, you will need to run this application via a web server when running locally.

Todo this, the recommended way is to use nodes `http-server` package.

Firstly, ensure you have the package installed via npm globally:
```
npm install -g http-server
```

Then, from the root of this project, you should just be able to run
```
http-server ./
```

This should start the server and serve the index.html file. You should be able to see this by going to `http://localhost:8080` in your web browser.
