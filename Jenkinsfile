pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "nodejs-api"
        DOCKER_TAG = "${BUILD_NUMBER}"
        SONAR_PROJECT_KEY = "devops-sonatel-project"
    }
    
    stages {
        stage('🔍 Checkout') {
            steps {
                echo '=== Cloning repository ==='
                checkout scm
            }
        }
        
        stage('📦 Install Dependencies') {
            steps {
                echo '=== Installing Node.js dependencies ==='
                sh 'npm install'
            }
        }
        
        stage('🧪 Run Tests') {
            steps {
                echo '=== Running unit tests ==='
                sh 'npm test'
            }
        }
        
        stage('📊 SonarQube Analysis') {
            steps {
                echo '=== Running SonarQube analysis ==='
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                              -Dsonar.sources=. \
                              -Dsonar.host.url=http://sonarqube:9000 \
                              -Dsonar.exclusions=node_modules/**,k8s/**,terraform/**,ansible/**
                        """
                    }
                }
            }
        }
        
        stage('✅ Quality Gate') {
            steps {
                echo '=== Checking Quality Gate ==='
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        
        stage('🐳 Build Docker Image') {
            steps {
                echo '=== Building Docker image ==='
                sh """
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                    docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }
        
        stage('🔒 Trivy - Scan Docker Image') {
            steps {
                echo '=== Scanning Docker image for vulnerabilities ==='
                sh """
                    trivy image --severity HIGH,CRITICAL --exit-code 0 \
                        --format table ${DOCKER_IMAGE}:${DOCKER_TAG}
                    
                    trivy image --severity CRITICAL --exit-code 1 \
                        ${DOCKER_IMAGE}:${DOCKER_TAG} || true
                """
            }
        }
        
        stage('🔒 Trivy - Scan K8s Manifests') {
            steps {
                echo '=== Scanning Kubernetes manifests ==='
                sh 'trivy config k8s/ --severity MEDIUM,HIGH,CRITICAL --exit-code 0'
            }
        }
        
        stage('☸️ Deploy to Minikube') {
            steps {
                echo '=== Deploying to Kubernetes ==='
                sh """
                    minikube image load ${DOCKER_IMAGE}:${DOCKER_TAG}
                    
                    kubectl apply -f k8s/namespace.yaml
                    
                    sed 's|image: nodejs-api:1.0.0|image: ${DOCKER_IMAGE}:${DOCKER_TAG}|g' \
                        k8s/deployment.yaml | kubectl apply -f -
                    
                    kubectl apply -f k8s/service.yaml
                    
                    kubectl rollout status deployment/nodejs-api -n devops-app --timeout=2m
                """
            }
        }
        
        stage('✅ Verify Deployment') {
            steps {
                echo '=== Verifying deployment ==='
                sh """
                    kubectl get pods -n devops-app
                    kubectl get svc -n devops-app
                    
                    echo "Waiting for pods to be ready..."
                    kubectl wait --for=condition=ready pod -l app=nodejs-api -n devops-app --timeout=60s
                    
                    echo "Testing API..."
                    minikube service nodejs-api-service -n devops-app --url
                """
            }
        }
    }
    
    post {
        always {
            echo '=== Cleaning up ==='
            sh 'docker system prune -f || true'
        }
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
