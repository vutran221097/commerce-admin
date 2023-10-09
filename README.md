# E-Commerce Website (MERN Stack)

## E-Commerce Website
An ecommerce website for selling mobile devices, full of features like quick-view, mange user-account, add to cart, check out, filter list product in Client Page. When it comes to Admin Page, you can observe a summary revenue dashboard, add/edit/delete product, manage the role of users. The demo apps was deployed on Render and Firebase.

## Technologies
Technologies used: MongoDB, Express, ReactJS, NodeJS, React Router, Redux toolkit, Socket.io.

## Launch demo

\*Note: Please open link back-end first.

- ClientApp (Firebase) : [Link](https://commerce-app-a6c6d.web.app/)
- AdminApp (Firebase) : [Link](https://commerce-44da7.web.app/)
- Back-end (Render) : [Link](https://commerce-server-9797.onrender.com/)

- Client Account: `acoount: user1@gmail.com` , `password: 123456`
- Counselor Account: `acoount: conselor1@gmail.com` , `password: 123456`
- Admin Account: `acoount: admin@gmail.com` , `password: 123456`

## Project Breakdown

### Server

- Directory: Server
- Features:
  - [x] Building api server (MVC model) - CRUD operations
  - [x] Generating schema models
  - [x] JWT Authentication
  - [x] Authenticating api based on user role
  - [x] Socket.io to handle Room Chat on server-side

### Client App

- Directory: Client
- Features:
  - [x] Login/Sign up page
  - [x] Home page, Shop page, Product detail page
  - [x] Cart page, Check out page, History orders page
  - [x] Redux/Redux Toolkit to save user, cart information
  - [x] Chat Box (socket.io-client)
  - [x] Send email with products information when order successfully!

### Admin App

- Directory: Admin
- Features:
  - [x] Login page - authenticate for role admin and role counselor
  - [x] Dashboard to summarize data
  - [x] Create/Update/Delete/Searching products
  - [x] Show all orders - Edit order status
  - [x] User Page - Delete / Update role user
  - [x] Realtime chat - notify when have new user chatting

### Node version

- Node -v 18.17.1
- Npm -v 9.6.7

## Source code
- ClientApp: https://github.com/vutran221097/commerce-client
- AdminApp: https://github.com/vutran221097/commerce-admin
- ServerApp: https://github.com/vutran221097/commerce-server

### Clone or download the `E-commerce App` from source code
#### Client-side usage(PORT: 3000)
- Url: http://localhost:3000
- Change backend url to http://localhost:5000 in config.server.js

```
$ yarn # or npm i    // npm install packages
$ npm start       // run it locally
```

#### Admin usage(PORT: 3001)
- Url: http://localhost:3001
- Change backend url to http://localhost:5000 in config.server.js

```
$ yarn # or npm i    // npm install packages
$ npm start       // run it locally
```

#### Server-side usage(PORT: 5000)
- Url: http://localhost:5000
- Add the .env same with .env.example and replace all the variable by your account, config, origin same

```
$ npm i       // npm install packages
$ npm start // run it locally
```
