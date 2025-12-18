# 📖 Guide de Déploiement

## 🚀 Déploiement Complet

### Étape 1: Démarrer l'infrastructure
```bash
# Démarrer Minikube
minikube start --driver=docker --memory=4096 --cpus=2

# Démarrer les services
docker start jenkins sonarqube grafana prometheus node-exporter
```

### Étape 2: Déployer l'application
```bash
cd ~/devops-sonatel-project

# Build image
docker build -t nodejs-api:latest .

# Charger dans Minikube
minikube image load nodejs-api:latest

# Déployer
kubectl apply -f k8s/
```

### Étape 3: Vérifier
```bash
kubectl get all -n devops-app
curl $(minikube service nodejs-api-service -n devops-app --url)
```

## 🔄 Mise à jour
```bash
# Build nouvelle version
docker build -t nodejs-api:2 .
minikube image load nodejs-api:2

# Mise à jour
kubectl set image deployment/nodejs-api nodejs-api=nodejs-api:2 -n devops-app
```

## 📊 URLs des Services

| Service | URL |
|---------|-----|
| Application | http://192.168.49.2:30080 |
| Jenkins | http://localhost:8080 |
| SonarQube | http://localhost:9001 |
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
