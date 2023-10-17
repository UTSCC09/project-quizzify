# Project Title

Quizzify: A Realtime Quiz Platform

# Team Members
- Henry Wong
- Peter Yan Tsai Chow

# Description of the Web Application



## Key Features to be Completed by Beta Version



## Additional Features to be Completed by Final Version



## Technology Stack Used to Build and Deploy
- **Backend:** Express.js (Node.js, express-ws), MongoDB, Auth0, Twilio SendGrid
- **Frontend:** React, Redux, Chakra UI
- **Deployment:** Docker, Heroku

## Top 5 Technical Challenges. 
> Understand that a challenge is something new that you have to learn or figure out. Anything we have already covered in class cannot be considered as a challenge. Making the application work and deploying it is not a challenge but a project requirement.

1. **Real-time Synchronization**: Utilize web sockets to ensure all participants see all actions at the same time (ex. questions/answers, updated leaderboards, real-time, timer) + handle effects of possible network latency
2. **Scalability**: Ensure the web application can handle a large number of concurrent playing users, (notably large quiz sessions)
3. **3rd-party Services**: Integrate 3rd party services such as Twilio SendGrid to send email notifications 
4. **3rd-party Authorization**: Utilize Auth0 to use Google accounts for our user authorization (JWT) + profiles
5. **Responsive and Interactive UI**: Crafting a user interface that is intuitive, responsive across all device types, and able to handle various media formats without lag or distortion.
