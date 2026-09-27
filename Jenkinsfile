pipeline {
    agent any
    environment {
        BACKEND_IMAGE = "harikumar1997/sunsysglobal-backend"
        FRONTEND_IMAGE = "harikumar1997/sunsysglobal-frontend"
        IMAGE_TAG = "latest"
        BACKEND_URL  = "http://100.53.203.102:8000/"
        KUBECONFIG = '/var/lib/jenkins/kubeconfig'
    }
    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khari2453/Sunsysglobal.git'
            }
        }

        stage('Check Node and NPM') {
            steps {
                sh '''
                    node --version
                    npm --version
                '''
            }
        }
        

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh '''
                rm -rf node_modules
                npm install
                chmod +x node_modules/.bin/vite
            '''
                }
            }
        }

         stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        stage('Build Backend') {
            steps {
                dir('backend') {        
                sh '''
            docker run --rm \
                -v "$WORKSPACE/backend:/app" \
                -w /app \
                python:3.11-slim \
                bash -c '
                    if [ -f requirements.txt ]; then
                        python -m pip install --no-cache-dir -r requirements.txt
                    fi
                '
        '''
                }
            }
        }
       stage('SonarQube Analysis') {
    steps {
        script {
            def scannerHome = tool 'sonarqube-scanner'

            echo "Scanner: ${scannerHome}"

            withSonarQubeEnv('sonarqube-server') {
                sh """
                    echo "===== Scanner Version ====="
                    ${scannerHome}/bin/sonar-scanner --version

                    echo "===== Workspace ====="
                    pwd
                    ls -la

                    echo "===== Backend ====="
                    ls -la backend || true

                    echo "===== Frontend ====="
                    ls -la frontend || true
                    ls -la frontend/src || true

                    echo "===== Sonar Analysis ====="

                    ${scannerHome}/bin/sonar-scanner \
                      -Dsonar.projectKey=sunsys-resume-tailor \
                      -Dsonar.projectName="Sunsys Resume Tailor" \
                      -Dsonar.projectVersion=1.0 \
                      -Dsonar.sources=backend,frontend/src \
                      -Dsonar.exclusions="**/node_modules/**,**/dist/**,**/venv/**,**/__pycache__/**" \
                      -Dsonar.sourceEncoding=UTF-8

                    echo "===== Report Task ====="
                    find . -name "report-task.txt" -print
                """
            }
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
    stage('Trivy Image Scan') {
    steps {
        sh """
            echo "===== Trivy Version ====="
            /usr/bin/trivy --version

            echo "===== Backend Image Scan ====="
            /usr/bin/trivy image \
              --severity HIGH,CRITICAL \
              --exit-code 0 \
              ${BACKEND_IMAGE}:${IMAGE_TAG}

            echo "===== Frontend Image Scan ====="
            /usr/bin/trivy image \
              --severity HIGH,CRITICAL \
              --exit-code 0 \
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

stage('Deploy to Kubernetes') {
    steps {
        sh '''
            kubectl get nodes
            kubectl get pods -n sunsys

            kubectl set image deployment/backend \
                backend=harikumar1997/sunsysglobal-backend:latest \
                -n sunsys

            kubectl set image deployment/frontend \
                frontend=harikumar1997/sunsysglobal-frontend:latest \
                -n sunsys

            kubectl rollout status deployment/backend -n sunsys
            kubectl rollout status deployment/frontend -n sunsys
        '''
    } 
        
}

}
    post {
    success {
        emailext(
            to: 'khari2453@gmail.com',
            subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "Build successful: ${env.BUILD_URL}"
        )
    }

    failure {
        emailext(
            to: 'khari2453@gmail.com',
            subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "Build failed: ${env.BUILD_URL}"
        )
    }
}

        
}
    
