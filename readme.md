# How to preview the app
- You can try the app on your mobile device without any setting up by previewing it from my public expo update link.
- **Important notes:**
- The Expo Go mobile app needs to be expo sdk 49.
- If you use an emulator, make sure it has enough ram and VM heap allocated (3Gb ram and 1Gb vm heap worked for me).
- Link for downloading the mobile app https://expo.dev/go.
- Link to expo update: [https://expo.dev/preview/update?message=%23skip%20Merge%20pull%20request%20%2361%20from%20Samuliej%2Flast-changes%0A%0AChanged%20the%20IOS%20color%20to%20be%20the%20same%20as%20on%20android&updateRuntimeVersion=1.1.0&createdAt=2024-07-19T07%3A23%3A09.685Z&slug=exp&projectId=c65168d9-6015-44c3-8256-ab2b906efa5f&group=09a4cebe-2161-43df-968f-ddb9e4ad847b](https://expo.dev/preview/update?message=%23skip%20Merge%20pull%20request%20%2361%20from%20Samuliej%2Flast-changes%0A%0AChanged%20the%20IOS%20color%20to%20be%20the%20same%20as%20on%20android&updateRuntimeVersion=1.1.0&createdAt=2024-07-19T07%3A23%3A09.685Z&slug=exp&projectId=c65168d9-6015-44c3-8256-ab2b906efa5f&group=09a4cebe-2161-43df-968f-ddb9e4ad847b)

## Development Diary

For a detailed development diary, see [kehityspaivakirja.md](./kehityspaivakirja.md).

# Welcome to The Hive 🐝

Welcome to The Hive, your go-to social networking app designed to bring people closer
together, no matter where they are. In today's fast-paced world, staying connected with
friends and loved ones is more important than ever. The Hive makes it easy and fun
to share your life's moments, chat in real-time, and build meaningful connections.

## Why The Hive?

The Hive stands out with its intuitive design, seamless user experience, and a suite of
features tailored to enhance your social interactions. Whether you're looking to catch up
with old friends, make new ones, or simply share a glimpse of your day, The Hive provides
the perfect platform to do so.

## Key Features

- **Friend Network:** Build your own hive by adding friends and family. Your network is where the magic happens.
- **Instant Messaging:** Send and receive messages in real-time. Whether it's a quick update or a long catch-up, we've got you covered.
- **Post & Share:** Share your favorite moments as posts. Add photos and updates to keep your circle in the loop.
- **Engage & Interact:** React to posts, comment on them, and engage with your friends' content.

## Technologies Used
- **Frontend:** React-Native, CSS, JavaScript, React, Expo sdk 49
- **Backend:** Node.js, Express.js, MongoDB, Cloudinary
- **Authentication:** JSON Web Tokens (JWT)
- **Real-time Communication:** Socket.IO
- **Encryption:** https://www.npmjs.com/package/react-native-simple-encryption

## How to run locally

- Fork the project and clone it to your local machine.
- Run npm install in both backend-express and theHive. The project was developed using Expo sdk 49 and node v16.19.0.
- You are going to need to set up some environmental variables both in the server and the frontend.
- **Server:**
- MONGODB_URI and MONGODB_TEST_URI: You need to create a MongoDB account and enter your cluster's url, for example: mongodb+srv://user:password@cluster.mongodb.net/project?...
- JWT_SECRET: Enter a secure JWT_SECRET key.
- PORT: set it as 3000.
- NODE_ENV: set it as ""
- CLOUDINARY_URL: You need to create a cloudinary account and get the url to use for media storage. After creating an account and setting up a product environment, you can find your url in settings -> Product environment settings -> API keys. At the same location you can find your CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.
- CLOUDINARY_NAME: The same as the name of your product environment.

- **Frontend:**
- HTTP_URL: Use http://ipaddr:3000 where ipaddr is your local IP address. This is necessary as localhost:3000 may not work in some configurations. The IP address should be the same as when starting frontend: "Metro waiting on exp://ipaddr:8081".

- **Starting the app:**
- To start the server, navigate to backend-express and run npm run dev.
- To start the frontend, navigate to theHive and run npm start. If you encounter issues with the IP address, stop the server and run npm run start-clean after updating HTTP_URL.

## Preview pictures

![Login](https://github.com/user-attachments/assets/5b335115-7fdd-401e-9405-0dba065b28fa)
![Register](https://github.com/user-attachments/assets/63a5b2b6-4f73-4b53-8d1a-2a55bbb2ba3d)
![Conversations](https://github.com/user-attachments/assets/fc8c4bff-df1f-4d54-8559-5373235bf0e1)
![Chat](https://github.com/user-attachments/assets/f161097a-ce69-4324-bdc0-9a35f7cd8c49)
![Feed](https://github.com/user-attachments/assets/8a093702-9e57-4657-8184-c394056fc293)
![SearchUser](https://github.com/user-attachments/assets/5f9ce9c6-45ea-4927-a05f-8aed19a8d87b)

## Credits to photos and icons used in the app
- **User default profile picture:** https://www.onlinewebfonts.com/icon/506837
- **Fist bump icon:** Designed by Freepik on Flaticon. https://www.flaticon.com/free-icon/fist-bump_3113503?term=fist+bump&page=1&position=29&origin=tag&related_id=3113503
- **Honeycomb icon:** Designed by PIXARTIST on flaticon. https://www.flaticon.com/free-icon/honeycomb_4991934?term=honeycomb&page=1&position=8&origin=tag&related_id=4991934
- **Chat background:** Designed by Freepik. https://www.freepik.com/free-vector/blue-fluid-background-frame-vector_18227082.htm

