# Quizzify

## Project URL
https://quizzify.games/

## Project Video URL 
https://www.youtube.com/watch?v=Prm8TewCuQs

## Project Description

Quizzify is an immersive, real-time quiz platform crafted to infuse interactivity into classrooms, gatherings, and informal assemblies. Inspired by industry-leading platforms such as Kahoot, Quizzify enables endless possibilities for everybody to create, host, and play fun quiz sessions in real-time with exciting features like quiz templates and special game modes!

## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. 

## Deployment

First, we dockerized our frontend and backend. Then, following instructions from Lab 9, we deployed the dockerized containers with an Nginx reverse proxy to a Google Compute Engine VM instance with the following configuration:
- **Region:** northamerica-northeast2 (Toronto)
- **Machine configuration:** E2 (Low cost, day-to-day computing)
- **Machine type:** e2-micro

Finally, we acquired the domain `quizzify.games` from [name.com](https://www.name.com/) and pointed it to a reserved static IP of our VM. By updating the domains within `quizzify/.env` to this domain, we were able to utilize Let's Encrypt SSL certificates to enable HTTPS across our application.

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. Troubleshooting across multiple systems like Docker, Google Cloud Platform, Let's Encrypt, and our domain host was a tedious and challenging task. We also had no prior experience in deployment with dockerization. The process started with crafting Dockerfiles for both the frontend and backend, which was followed by the crucial step of transforming these into Docker images. This involved encapsulating our application and its dependencies into containers, ensuring they operated consistently across different environments. Running these images as containers brought forth a new set of challenges in networking, data persistence, and container communication. Each step, from managing Docker containers to configuring SSL certificates with Let's Encrypt and setting up our domain on Google Cloud Platform, required knowledge of the technologies used and a significant amount of troubleshooting, which made this phase the most time-consuming and complex, requiring a lot of troubleshooting and adjustments.
2. Orchestrating the real-time functionality in Quizzify presented a significant challenge, particularly in achieving seamless integration between the frontend and backend. The central task was to ensure real-time interaction in the quiz games, where a host controls the game and players join in. The user interface, which players see and use to answer questions, had to be quick and responsive. It needed to update immediately as players interacted with the quiz. On the other hand, the backend had to manage all the quiz activities through socket.io and mongodb, like sending out questions and keeping score, ensuring everything was in sync for all players and also with the database. This demanded careful planning and execution to make sure that everyone's actions were reflected in real-time, making the game engaging and interactive. It was a balancing act of making the game fast and fun, while also handling the technical complexities of connecting everyone in a seamless way.
3. Integrating Auth0 into our application required multiple days of challenges, primarily due to conflicting and outdated documentation. We aimed to establish a secure authentication system for both our front-end single-page application and a separate back-end, requiring two distinct Auth0 setups. This intricate process involved numerous iterations and errors, as we navigated through the complexities of OAuth 2.0 protocols and the secure handling of authentication tokens and user sessions. The task was not only time-consuming but also demanded a deep understanding of secure communication between the client and server. Eventually, our persistence paid off, and we successfully implemented Auth0, ensuring robust user authentication and access control in our quiz platform, and gaining valuable insights into advanced web security practices.

## Contributions

### Henry Wong
- Backend 
  - API endpoints/routing
  - Sockets
  - Authorization
- Auth0
- Deployment
- Initial project setup

### Peter Yan Tsai Chow
- Frontend
- UI/UX design
