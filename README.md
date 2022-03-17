## How to start api server

- Start the mongoDB server
- make sure mongo is running ( port number : `27017`)
- cd into the folder and run `npm install`
- refer to .env.example file and create the .env file:
  - LOCAL_IP : the IP of your machine
  - PORT : the port on which the server is running.
  - MAIN_BACKEND_PORT : the port on which the server connected to the blockchain is running.
- to start the server , run `npm start`

## How to start client server

- Refer to .env.example file and create the .env file:
  - LOCAL_IP : the IP of your machine
  - BACKEND_PORT : the port on which the backend server is running.
  - PORT : the port on which the web client is running.
  - MAIN_BACKEND_PORT : the port on which the server connected to the blockchain is running.
- cd into the folder and run `npm install`
- to start the server , run `npm start`
