To run the server:
open command line in the directory of app.js and type "node app.js"

This server requires a mongodb connection at 127.0.0.1:27017, but it can be changed in app.js.

The homepage can be opened in a webbrowser at localhost:12345.

Note: Line 27 in routes/router.js must be changed to a user that exists in your mongo database, otherwise it won't work.
It's still hardcoded for test purposes and will of course be changed in the near future.