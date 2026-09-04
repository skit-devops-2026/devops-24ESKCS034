pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    environment {
        CI = 'true'
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Environment Check') {
            steps {
                echo 'Validating Node.js and runtime environment...'
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Lint & Static Analysis') {
            steps {
                echo 'Running static code syntax validation...'
                sh 'node --check script.js job/script.js src/jobService.js'
            }
        }

        stage('Automated Unit Tests') {
            steps {
                echo 'Executing test suite with Node test runner...'
                sh 'npm test'
            }
        }

        stage('Archive & Package') {
            steps {
                echo 'Archiving build configuration and test outputs...'
                archiveArtifacts artifacts: 'package.json, README.md, src/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Jenkins pipeline completed for build: ${env.BUILD_NUMBER}"
            cleanWs deleteDirs: false, notFailBuild: true
        }
        success {
            echo "Pipeline succeeded! All tests and static checks passed."
        }
        failure {
            echo "Pipeline failed! Please check console output for errors."
        }
    }
}
