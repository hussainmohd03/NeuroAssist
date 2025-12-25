# AI-Assisted MRI Brain Tumor Analysis Platform


Figma File [here](https://www.figma.com/design/kKxmNFIIu7cl0FjhzTe1a9/Untitled?node-id=0-1&p=f&t=1owws2DaB06Czmof-0).
Thesis Document [here](https://drive.google.com/file/d/1xVWT35rspeAGCd5cKLQFvUGfxKDB0kZ_/view?usp=sharing).

# Key Features

- Secure doctor authentication with JWT and refresh tokens
- Multi-step study creation workflow
- MRI upload with validation and size handling
- Asynchronous AI inference via FastAPI
- Background job orchestration using queues
- Automatic PDF medical report generation
- Real-time notifications using Redis Pub/Sub and WebSockets
- Persistent notification history

# Tech Stack

### Frontend

- React
- Context API
- WebSockets

### Backend

- Node.js (Express)
- PostgreSQL + Prisma
- JWT Authentication
- BullMQ + Redis

### AI Service

- FastAPI (Python)
- REST-based inference

### Storage

- Azure Blob Storage

### Testing

- Jest
- Supertest

# Architecture Overview

The system uses an event-driven architecture:

- The API handles validation and orchestration
- Heavy tasks (AI inference, reports, emails) run in background workers
- The ML service is fully decoupled from the backend
- Real-time updates are delivered without polling

# Diagrams

### Activity Diagram

![Activity Diagram](<./images/Activity Diagram.png>)

### ERD

![ERD](./images/ERD.png)

### BullMQ Diagram

![Bullmq diagram](<./images/Bullmq diagram 2.png>)
