# 🚀 Projet DevOps Complet - API Node.js

## 📋 Description

Projet DevOps end-to-end démontrant l'implémentation complète d'une pipeline CI/CD.

## 🏗️ Architecture
```
GitHub → Jenkins → Docker → Kubernetes → Monitoring
           ↓         ↓
       SonarQube   Trivy
```

## 🛠️ Stack Technique

- Node.js 18, Express
- Docker, Kubernetes (Minikube)
- Jenkins, SonarQube, Trivy
- Prometheus, Grafana
- Git/GitHub

## 🚀 Installation

### Prérequis
- Docker
- Minikube
- Node.js 18+

### Déploiement
```bash
# Cloner le repository
git clone https://github.com/username/devops-sonatel-project.git
cd devops-sonatel-project

# Installer les dépendances
npm install

# Tests
npm test

# Build Docker
docker build -t nodejs-api:latest .

# Déployer sur Kubernetes
minikube start
minikube image load nodejs-api:latest
kubectl apply -f k8s/

# Vérifier
kubectl get all -n devops-app
```

## 🎯 Endpoints API

- `GET /` - Message de bienvenue
- `GET /health` - Health check

## 📊 Services

- **Jenkins**: http://localhost:8080
- **SonarQube**: http://localhost:9001
- **Grafana**: http://localhost:3000
- **Prometheus**: http://localhost:9090

## 👥 Auteur

**Mouhamadou Mansour MBENGUE**
- Email: mbenguemouhamadoumansour@gmail.com
- GitHub: @mbenguemouhamadoumansour-pn

## 📄 Licence

MIT
