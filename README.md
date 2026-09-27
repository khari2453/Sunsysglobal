# 🛤️ AI Resume Matcher

An AI-powered resume matching platform built with a 2-tier architecture — **React** frontend and **Python (FastAPI)** backend — that tailors resumes to a given job description.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/python-3670A0?logo=python&logoColor=ffdd54)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=flat-square&logo=jenkins&logoColor=white)

---

## 📸 Screenshots

<img width="1366" height="641" alt="Home" src="https://github.com/user-attachments/assets/875d38af-48db-4af9-b7aa-b7a84f942c9f" />
<img width="1366" height="641" alt="Upload" src="https://github.com/user-attachments/assets/2bbf96bf-cda3-447f-8319-01e794418006" />
<img width="1366" height="641" alt="Match Results" src="https://github.com/user-attachments/assets/434bfa1d-af14-4c48-8abb-2afe3162ff63" />
<img width="1366" height="641" alt="Dashboard" src="https://github.com/user-attachments/assets/71ccc569-022f-486e-a98a-116898b2008f" />
<img width="1366" height="2413" alt="Full View 1" src="https://github.com/user-attachments/assets/3ca0ac63-2bd8-4e78-bf73-912054f16fcf" />
<img width="1366" height="1328" alt="Full View 2" src="https://github.com/user-attachments/assets/45e6939e-cf36-4435-b3c1-74b24f702b55" />
<img width="1366" height="641" alt="Screen 5" src="https://github.com/user-attachments/assets/08b0bf4f-932e-4f81-86d7-d1e9a7857497" />
<img width="1366" height="641" alt="Screen 6" src="https://github.com/user-attachments/assets/f47d5487-366d-4df4-9022-35a2d2a2e9c9" />
<img width="1366" height="641" alt="Screen 7" src="https://github.com/user-attachments/assets/8a7d70e6-56c0-4fd7-b975-a0ed485f2903" />
<img width="1366" height="641" alt="Screen 8" src="https://github.com/user-attachments/assets/df02f457-c02a-41b9-9903-0022e5c36ff5" />
<img width="1366" height="641" alt="Screen 9" src="https://github.com/user-attachments/assets/14e8dbf8-4cde-4356-a02b-ee5f82608b78" />
<img width="1366" height="641" alt="Screen 10" src="https://github.com/user-attachments/assets/07ea2a50-ffc3-403e-beb6-98978f5e6ee8" />
<img width="1366" height="641" alt="Screen 11" src="https://github.com/user-attachments/assets/3bf0a22e-78fc-4001-96dd-3fb701a1061e" />
<img width="1366" height="641" alt="Screen 12" src="https://github.com/user-attachments/assets/49feacce-dc7b-433f-b206-9f63511ad482" />
<img width="1366" height="641" alt="Screen 13" src="https://github.com/user-attachments/assets/bcfc5a11-a8a9-4037-97fe-d9595c211fdd" />

---

## ✨ Features

- Upload a resume and a target job description, and get an AI-tailored match/analysis via the `/api/tailor` endpoint
- 2-tier architecture: React SPA frontend + FastAPI backend
- Fully containerized with Docker, scanned for vulnerabilities before deploy
- Automated CI/CD via Jenkins with quality gates (SonarQube) and security scanning (Trivy)
- Deployed to Kubernetes with Ingress-based routing

---

## 🛠️ Tech Stack

| Layer            | Technology                          |
|-------------------|--------------------------------------|
| Frontend          | React 18, Vite, nginx (serving)      |
| Backend           | Python, FastAPI, Uvicorn             |
| Containerization  | Docker                               |
| Code Quality      | SonarQube                            |
| Security Scanning | Trivy                                |
| Image Registry    | Docker Hub                           |
| Orchestration     | Kubernetes (namespace: `sunsys`)     |
| Ingress           | ingress-nginx                        |
| CI/CD             | Jenkins                              |

---

## 🏗️ Architecture

```
┌─────────────┐      HTTP       ┌──────────────┐
│   React     │ ───────────────▶│   FastAPI    │
│  Frontend   │   /api/tailor    │   Backend    │
│  (nginx)    │◀─────────────── │  (Uvicorn)   │
└─────────────┘                 └──────────────┘
      │                                │
      └──────────── K8s Ingress ───────┘
              (namespace: sunsys)
```

---

## ✅ Prerequisites

- Node.js (for local frontend dev)
- Python 3.11+
- Docker
- kubectl + a Kubernetes cluster (e.g. minikube)
- Jenkins (for CI/CD, optional for local runs)

---

## 🚀 Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker

Build and run each service:

```bash
# Backend
docker build -t ai-resume-matcher-backend ./backend
docker run -p 8000:8000 ai-resume-matcher-backend

# Frontend
docker build -t ai-resume-matcher-frontend ./frontend
docker run -p 80:80 ai-resume-matcher-frontend
```

---

## 🔄 CI/CD Pipeline (Jenkins)

1. **Checkout** source from GitHub
2. **Build** Docker images (frontend + backend)
3. **Code quality scan** — SonarQube
4. **Vulnerability scan** — Trivy
5. **Push** images to Docker Hub
6. **Deploy** to Kubernetes via `kubectl apply` (using a scoped Jenkins service-account kubeconfig)

---

## ☸️ Kubernetes Deployment

```bash
kubectl create namespace sunsys
kubectl apply -f backend-deployment.yaml -n sunsys
kubectl apply -f backend-service.yaml -n sunsys
kubectl apply -f frontend-deployment.yaml -n sunsys
kubectl apply -f frontend-service.yaml -n sunsys
kubectl apply -f ingress.yaml -n sunsys
```

Check status:

```bash
kubectl get pods -n sunsys
kubectl get svc -n sunsys
kubectl get ingress -n sunsys
```

---

## 📡 API

| Endpoint       | Method | Description                                  |
|----------------|--------|-----------------------------------------------|
| `/docs`        | GET    | Auto-generated FastAPI/Swagger documentation |
| `/api/tailor`  | POST   | Submits resume + job description for tailoring |

---

## 📂 Project Structure

```
.
├── backend/
│   ├── main.py
│   ├── nlp_engine.py
│   ├── question_db.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── nginx.conf
│   └── Dockerfile
├── backend-deployment.yaml
├── backend-service.yaml
├── frontend-deployment.yaml
├── frontend-service.yaml
└── README.md
```

---

## 👤 Author

**Harikumar M**
GitHub: [github.com/khari2453](https://github.com/khari2453)
LinkedIn: [linkedin.com/in/hari-kumar-a19024106](https://www.linkedin.com/in/hari-kumarm/)

