pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "resume-tailor-backend:${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "resume-tailor-frontend:${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t ${BACKEND_IMAGE} ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t ${FRONTEND_IMAGE} ./frontend'
            }
        }

        stage('Archive Build Artifacts') {
            steps {
                archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
