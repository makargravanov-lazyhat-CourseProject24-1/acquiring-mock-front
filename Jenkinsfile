pipeline {
    agent any

    environment {
        SERVICE_NAME = "acquiring-mock-front"
    }

    stages {
        stage("Build"){
            steps {
                sh "npm install"
                sh "npm run build"
            }
        }
        stage("Publish"){
            steps {
                sh "sudo cp -r ./dist/* /${SERVICE_NAME}"
            }
        }
    }
}