pipeline {

    agent any

    environment {

        REGISTRY = "docker.io/your-dockerhub-username"

        BACKEND_IMAGE  = "${REGISTRY}/resume-tailor-backend"
        FRONTEND_IMAGE = "${REGISTRY}/resume-tailor-frontend"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out source code..."

                checkout scm
            }
        }


        stage('Backend Test') {
            steps {

                dir('backend') {

                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate

                        pip install --upgrade pip
                        pip install -r requirements.txt

                        if [ -f requirements-dev.txt ]; then
                            pip install -r requirements-dev.txt
                        fi

                        if [ -d tests ]; then
                            pytest -v
                        fi
                    '''
                }
            }
        }


        stage('Frontend Test') {
            steps {

                dir('frontend') {

                    sh '''
                        npm ci

                        npm run lint || true

                        npm test -- --runInBand || true
                    '''
                }
            }
        }


        stage('Build Frontend') {
            steps {

                dir('frontend') {

                    sh '''
                        npm ci
                        npm run build
                    '''
                }
            }
        }


        stage('SonarQube Analysis') {
            steps {

                withSonarQubeEnv('SonarQube') {

                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=resume-tailor \
                        -Dsonar.projectName=resume-tailor \
                        -Dsonar.sources=backend,frontend
                    '''
                }
            }
        }


        stage('Quality Gate') {
            steps {

                timeout(time: 5, unit: 'MINUTES') {

                    waitForQualityGate abortPipeline: true
                }
            }
        }


        stage('Build Backend Docker Image') {
            steps {

                sh """
                    docker build \
                    -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                    -t ${BACKEND_IMAGE}:latest \
                    ./backend
                """
            }
        }


        stage('Build Frontend Docker Image') {
            steps {

                sh """
                    docker build \
                    -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                    -t ${FRONTEND_IMAGE}:latest \
                    ./frontend
                """
            }
        }


        stage('Trivy Security Scan') {
            steps {

                sh """
                    trivy image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    ${BACKEND_IMAGE}:${IMAGE_TAG}

                    trivy image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    ${FRONTEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }


        stage('Docker Login') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASSWORD" | \
                        docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }


        stage('Push Docker Images') {
            steps {

                sh """
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest

                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                """
            }
        }


        stage('Deploy') {
            steps {

                echo "Deploying application..."

                sh '''
                    echo "Deployment step goes here"

                    # Example:
                    # kubectl apply -f k8s/
                    # kubectl set image deployment/backend \
                    # backend=${BACKEND_IMAGE}:${IMAGE_TAG}
                    #
                    # kubectl set image deployment/frontend \
                    # frontend=${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }
    }


    post {

        success {

            echo "===================================="
            echo "CI/CD Pipeline Completed Successfully"
            echo "Build: ${BUILD_NUMBER}"
            echo "===================================="
        }

        failure {

            echo "===================================="
            echo "CI/CD Pipeline Failed"
            echo "Check Jenkins console logs"
            echo "===================================="
        }

        always {

            sh '''
                docker image prune -f || true
            '''

            cleanWs()
        }
    }
}