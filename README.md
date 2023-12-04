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

1.
2.
3. 

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
