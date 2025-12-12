# 📖 Guide de Déploiement Complet

## 🎯 Objectif
Déployer l'application complète avec tous les composants DevOps.

## 📋 Checklist Pré-déploiement

- [ ] Docker installé et démarré
- [ ] Minikube installé
- [ ] Node.js 18+ installé
- [ ] Git configuré
- [ ] Ports disponibles : 3000, 8080, 9001, 9090, 9100

## 🚀 Déploiement Step-by-Step

### Étape 1 : Infrastructure de base
```bash
# Démarrer Minikube
minikube start --driver=docker --memory=4096 --cpus=2

# Démarrer les services (si non actifs)
docker start jenkins sonarqube grafana prometheus node-exporter
```

### Étape 2 : Application
```bash
cd ~/devops-sonatel-project

# Installer les dépendances
npm install

# Lancer les tests
npm test

# Builder l'image Docker
docker build -t nodejs-api:latest .

# Charger dans Minikube
minikube image load nodejs-api:latest
```

### Étape 3 : Déploiement Kubernetes
```bash
# Appliquer les manifestes
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Vérifier
kubectl get all -n devops-app

# Attendre que les pods soient prêts
kubectl wait --for=condition=ready pod -l app=nodejs-api -n devops-app --timeout=60s
```

### Étape 4 : Vérification
```bash
# Obtenir l'URL de l'application
minikube service nodejs-api-service -n devops-app --url

# Tester
curl $(minikube service nodejs-api-service -n devops-app --url)
curl $(minikube service nodejs-api-service -n devops-app --url)/health
```

### Étape 5 : Pipeline Jenkins

1. Ouvrir Jenkins : `http://localhost:8080`
2. Aller dans `devops-sonatel-pipeline`
3. Cliquer **Build Now**
4. Observer le pipeline

## 🔄 Mise à jour de l'application
```bash
# 1. Modifier le code
nano app.js

# 2. Lancer le pipeline Jenkins
# ou manuellement :

# 3. Build nouvelle image
docker build -t nodejs-api:21 .

# 4. Charger dans Minikube
minikube image load nodejs-api:21

# 5. Mettre à jour le déploiement
kubectl set image deployment/nodejs-api nodejs-api=nodejs-api:21 -n devops-app

# 6. Vérifier le rollout
kubectl rollout status deployment/nodejs-api -n devops-app
```

## 🛑 Arrêt des services
```bash
# Supprimer le déploiement K8s
kubectl delete namespace devops-app

# Arrêter Minikube
minikube stop

# Arrêter les conteneurs
docker stop jenkins sonarqube grafana prometheus node-exporter
```

## 🗑️ Nettoyage complet
```bash
# Supprimer le déploiement
kubectl delete -f k8s/

# Supprimer Minikube
minikube delete

# Nettoyer Docker
docker system prune -a
```

## 📊 URLs des Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Application | http://192.168.49.2:30080 | - |
| Jenkins | http://localhost:8080 | admin/votre_mdp |
| SonarQube | http://localhost:9001 | admin/admin123 |
| Grafana | http://localhost:3000 | admin/admin |
| Prometheus | http://localhost:9090 | - |

## 🐛 Troubleshooting

### Pods en CrashLoopBackOff
```bash
kubectl logs -n devops-app <pod-name>
kubectl describe pod -n devops-app <pod-name>
```

### Image non trouvée
```bash
minikube image ls | grep nodejs-api
# Si absent :
minikube image load nodejs-api:latest
```

### Service non accessible
```bash
kubectl get svc -n devops-app
minikube service list
```
