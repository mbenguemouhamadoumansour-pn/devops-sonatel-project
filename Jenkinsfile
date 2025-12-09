pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "nodejs-api"
        DOCKER_TAG = "${BUILD_NUMBER}"
        SONAR_PROJECT_KEY = "devops-sonatel-project"

        PATH = "/usr/local/bin:/usr/bin:/bin"
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

                    withSonarQubeEnv('SonarScanner') {
                        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                  -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                  -Dsonar.sources=. \
                                  -Dsonar.host.url=http://sonarqube:9000 \
                                  -Dsonar.login=$SONAR_TOKEN \
                                  -Dsonar.exclusions=node_modules/**,k8s/**,terraform/**,ansible/**
                            """
                        }
                    }
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

        stage('🔒 Trivy - Scan Image') {
            steps {
                echo '=== Scanning Docker image ==='
                sh """
                    export PATH=/usr/local/bin:/usr/bin:/bin
                    trivy image --severity HIGH,CRITICAL --exit-code 0 --format table ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }

        stage('🔒 Trivy - Scan K8s') {
            steps {
                echo '=== Scanning Kubernetes manifests ==='
                sh """
                    export PATH=/usr/local/bin:/usr/bin:/bin
                    trivy config ./k8s --severity MEDIUM,HIGH,CRITICAL --exit-code 0
                """
            }
        }

        stage('☸️ Deploy to K8s') {
            steps {
                echo '=== Deploying to Kubernetes ==='
                sh """
                    export PATH=/usr/local/bin:/usr/bin:/bin
                    minikube image load ${DOCKER_IMAGE}:${DOCKER_TAG}
                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl rollout status deployment/nodejs-api -n devops-app --timeout=2m
                """
            }
        }

        stage('✅ Verify') {
            steps {
                echo '=== Verifying deployment ==='
                sh """
                    kubectl get pods -n devops-app
                    kubectl get svc -n devops-app
                """
            }
        }
    }

    post {
        always {
            echo '=== Pipeline completed ==='
        }
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}

