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
                              -Dsonar.exclusions=node_modules/**,k8s/**
                        """
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
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh """
                        trivy image --severity HIGH,CRITICAL \
                            --exit-code 0 --format table \
                            ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
        
        stage('🔒 Trivy - Scan K8s') {
            steps {
                echo '=== Scanning Kubernetes manifests ==='
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh """
                        trivy config k8s/ \
                            --severity MEDIUM,HIGH,CRITICAL \
                            --exit-code 0
                    """
                }
            }
        }
        
        stage('✅ Build Complete') {
            steps {
                echo '=== Docker image ready ==='
                sh """
                    echo "✅ Image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    docker images | grep ${DOCKER_IMAGE} | head -3
                """
            }
        }
    }
    
    post {
        always {
            echo '=== Cleaning old images ==='
            sh '''
                docker images ${DOCKER_IMAGE} --format "{{.Tag}}" | \
                    grep -E "^[0-9]+$" | sort -rn | tail -n +6 | \
                    xargs -I {} docker rmi ${DOCKER_IMAGE}:{} 2>/dev/null || true
            '''
        }
        success {
            echo '✅ Pipeline succeeded!'
            echo """
            ========================================
            🎉 BUILD SUCCESSFUL!
            ========================================
            Image: ${DOCKER_IMAGE}:${DOCKER_TAG}
            
            To deploy:
            1. minikube image load ${DOCKER_IMAGE}:${DOCKER_TAG}
            2. kubectl set image deployment/nodejs-api \\
               nodejs-api=${DOCKER_IMAGE}:${DOCKER_TAG} -n devops-app
            ========================================
            """
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
