# Quizzify
*A Realtime Quiz Platform*

## Team Members
- Henry Wong
- Peter Yan Tsai Chow

## Description

Quizzify is an engaging, real-time quiz platform designed to bring interactive learning to classrooms, meetings, and casual groups. Inspired by Kahoot, this web application allows educators, trainers, or anyone interested to create and host quiz sessions where participants can join using a unique code. The primary goal is to offer an intuitive user experience for both the quiz host and participants, combined with a modern and responsive design.

### Key Features to be Completed by Beta Version
- **User Registration & Login:** Securely sign up/log in with their Google account (via Auth0 + JWTs) and manage user profiles.
  - **User accounts**: Use avatar, display name, & email address (unique identifier) from Google auth. Display a list of user’s public quizzes on their profile page.
- **Quiz Creation:** Users can create quizzes with questions and response options
  - **Question types:** multiple choice, true/false, short answer, fill in the blank
  - **Adjustable question timer presets:** short (10s), medium (40s), long (90s)
with multiple-choice questions, set timer for each question, and add images or videos. 
- **Live Quiz Hosting:** Host a quiz where participants (non logged in users) can join using a unique code. Utilize web sockets for real-time interactions between host and clients
  - **Public quiz mode:** Shareable code/link (unique) that non-authenticated users can access
    - Users choose unique names
  - **Host:** Display timer, questions, response options, how many users voted (updates real-time during the round)
    - Show leaderboard between rounds & winner at end of quiz
  - **Client:** Display questions & answer options
    - Points for answering correctly/quicker

### Additional Features to be Completed by Final Version

- **Private quiz creation:** Create Quizzes that are hidden to other users and only accessible to logged in users that are shared to it (allows a specific list of shared emails)
- **Start a private quiz:** Invite/grant access to specified user accounts/emails to privately participate in quiz (prevent unwanted raids)
  - Integrate Twilio SendGrid to send email notifications
- Different game modes: 
  - **Rapid-fire:** Accelerate question speed by a set multiplier (& award points by exponentially decreasing multiplier)
  - **Last one standing:** Three errors and you are out of the game.
- **Quiz templates:** Users can take inspiration from public quiz templates and create a copy of it to modify on their own
- **Account history:** User history shows total/percentage of wins and past quizzes played
- **Image upload:** Quiz questions can be accompanied with an image uploaded by quiz creator


### Technology Stack Used to Build and Deploy
- **Backend:** Express.js (Node.js, express-ws), MongoDB, Auth0, Twilio SendGrid
- **Frontend:** React, Redux, Chakra UI
- **Deployment:** Docker, Heroku

### Top 5 Technical Challenges
> Understand that a challenge is something new that you have to learn or figure out. Anything we have already covered in class cannot be considered as a challenge. Making the application work and deploying it is not a challenge but a project requirement.

1. **Real-time Synchronization**: Utilize web sockets to ensure all participants see all actions at the same time (ex. questions/answers, updated leaderboards, real-time, timer) + handle effects of possible network latency
2. **Scalability**: Ensure the web application can handle a large number of concurrent playing users, (notably large quiz sessions)
3. **3rd-party Services**: Integrate 3rd party services such as Twilio SendGrid to send email notifications 
4. **3rd-party Authorization**: Utilize Auth0 to use Google accounts for our user authorization (JWT) + profiles
5. **Responsive and Interactive UI**: Crafting a user interface that is intuitive, responsive across all device types, and able to handle various media formats without lag or distortion.
