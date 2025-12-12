# 🚀 Projet DevOps Complet - API Node.js

## 📋 Description

Projet DevOps end-to-end démontrant l'implémentation complète d'une pipeline CI/CD avec :
- Application Node.js/Express
- Tests automatisés (Jest)
- Analyse de code (SonarQube)
- Conteneurisation (Docker)
- Orchestration (Kubernetes/Minikube)
- Sécurité (Trivy)
- Monitoring (Prometheus + Grafana)
- CI/CD (Jenkins)

## 🏗️ Architecture
```
GitHub → Jenkins Pipeline → Docker → Kubernetes → Monitoring
           ↓         ↓
       SonarQube   Trivy
```

## 🛠️ Stack Technique

| Outil | Version | Usage |
|-------|---------|-------|
| Node.js | 18.20.8 | Runtime application |
| Docker | 28.5.1 | Conteneurisation |
| Kubernetes | 1.34.0 | Orchestration |
| Jenkins | 2.528.1 | CI/CD |
| SonarQube | LTS | Qualité du code |
| Trivy | 0.68.1 | Sécurité |
| Prometheus | Latest | Métriques |
| Grafana | Latest | Dashboards |

## 📦 Prérequis

- Docker
- Minikube
- Node.js 18+
- Git

## 🚀 Installation & Déploiement

### 1. Cloner le repository
```bash
git clone https://github.com/mbenguemouhamadoumansour-pn/devops-sonatel-project.git
cd devops-sonatel-project
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Tests locaux
```bash
npm test
```

### 4. Build Docker
```bash
docker build -t nodejs-api:latest .
```

### 5. Déployer sur Kubernetes
```bash
# Démarrer Minikube
minikube start

# Charger l'image
minikube image load nodejs-api:latest

# Déployer
kubectl apply -f k8s/

# Vérifier
kubectl get all -n devops-app
```

### 6. Accéder à l'application
```bash
minikube service nodejs-api-service -n devops-app
```

## 🔄 Pipeline CI/CD Jenkins

Le pipeline Jenkins automatise :

1. **Checkout** : Récupération du code
2. **Install** : Installation des dépendances
3. **Test** : Tests unitaires Jest
4. **SonarQube** : Analyse qualité du code
5. **Build** : Construction image Docker
6. **Trivy Scan** : Scan de sécurité (image + K8s)
7. **Deploy** : Déploiement sur Kubernetes (manuel)

### Lancer un build

Jenkins → `devops-sonatel-pipeline` → **Build Now**

## 📊 Monitoring

### Prometheus
- URL : `http://localhost:9090`
- Métriques système et application

### Grafana
- URL : `http://localhost:3000`
- Dashboards de monitoring

## 🔒 Sécurité

### Scans Trivy automatiques
- Images Docker : Vulnérabilités CVE
- Manifestes Kubernetes : Misconfigurations

### Résultats
- 0 vulnérabilités CRITICAL
- 2 vulnérabilités HIGH (cross-spawn, glob)

## 📈 Qualité du Code

### SonarQube
- URL : `http://localhost:9001`
- Analyse statique du code
- Détection de code smells
- Couverture de tests

## 🗂️ Structure du Projet
```
devops-sonatel-project/
├── app.js                  # Application principale
├── app.test.js             # Tests unitaires
├── package.json            # Dépendances Node.js
├── Dockerfile              # Image Docker
├── Jenkinsfile             # Pipeline CI/CD
├── sonar-project.properties # Config SonarQube
├── k8s/                    # Manifestes Kubernetes
│   ├── namespace.yaml
│   ├── deployment.yaml
│   └── service.yaml
└── docs/                   # Documentation
```

## 🎯 Endpoints API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/` | GET | Message de bienvenue |
| `/health` | GET | Health check |

### Exemples
```bash
# Bienvenue
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health
```

## 🧪 Tests
```bash
# Tests unitaires
npm test

# Coverage
npm test -- --coverage
```

## 📝 Logs
```bash
# Logs application (Kubernetes)
kubectl logs -n devops-app -l app=nodejs-api

# Logs Jenkins
docker logs jenkins

# Logs Prometheus
docker logs prometheus
```

## 🔧 Dépannage

### Minikube ne démarre pas
```bash
minikube delete
minikube start --driver=docker
```

### Image non trouvée dans Minikube
```bash
minikube image load nodejs-api:latest
```

### Jenkins build échoue
```bash
# Vérifier les logs
Jenkins → Build → Console Output
```

## 👥 Auteur

**Mouhamadou Mansour MBENGUE**
- Email : mbenguemouhamadoumansour@gmail.com
- GitHub : [@mbenguemouhamadoumansour-pn](https://github.com/mbenguemouhamadoumansour-pn)

## 📄 Licence

MIT

## 🙏 Remerciements

Projet réalisé dans le cadre de la formation DevOps.

---

**⭐ Si ce projet vous a été utile, n'hésitez pas à mettre une étoile !**
