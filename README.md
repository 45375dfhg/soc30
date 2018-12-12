**Guide to start the backend**  
The backend consists of two components: The **MongoDB-server** and the **Node.js-server**.  
Having a MongoDB-server installed is a requirement. Its tested on version 4.0.4 with Ubuntu 18.04.  
**MongoDB**  
A backup of the entire database with test data is available. The backup can be loaded with **mongorestore dump/** in the terminal. The terminal must be in the directory of the dump folder.
To run the database with authentication, type "mongod --auth". The server runs without --auth, too.
The test data is located in the "sandbox" collection.    
**Node.js**  
In the main directory of the node.js-sever is a **config.js** with information about the IP of the database, account information for the databse and the port the node.js-server is running on. The server can be started with **node app.js** with the terminal inside the directory of app.js. The first time, and only once, you have to run **npm install** to install all used modules.  
  ___
**API Documentation**  
See the API Documentation for further information if needed.  
  
**Test data**  
There are already some test data in the database. A list of them is included in Beispieldatensätze.pdf.  

**What does the application do?**  
- Cycle from creating a help request to rating someone
- Chat between two persons
- Distance calculation works, but we dont get the latest coordinates, because we don't use any APIs like Google's. So for now, the coordinates are random coordinates in the area of Stuttgart.
- Invite friends: You can invite friends by code, but for now everybody can use the application
- Filter requests by distance, category and time effort
- Terra: a helper gets terra after the help has happened. 30 min = 1 Terra