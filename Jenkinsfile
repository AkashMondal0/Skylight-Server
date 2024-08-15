// pipeline {
//     agent any

//     stages {
//         stage('clone code from github') {
//             steps {
//                 git url:"https://github.com/AkashMondal0/Sky-Chat-App-Nextjs.git",
//                 branch: "master"
//             }
//         }
//         stage('building the nextjs-app image') {
//             steps {
//                 sh "docker build -t akashmondal0/sky-chat-nextjs:latest ."
//             }
//         }
//         stage('push docker hub') {
//             steps {
//                 sh "docker compose up -d"
//             }
//         }
//         stage('login docker hub') {
//             steps {
//                 withCredentials([usernamePassword(credentialsId: 'dockerHub', passwordVariable: 'dockerHubPass', usernameVariable: 'dockerHubUser')]){
//                     sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"
//                 }
//             }
//         }
//         stage('push docker hub') {
//             steps {
//                 sh "docker push akashmondal0/next-chat:latest"
//             }
//         }
//         stage('push socket next chat app image to docker hub') {
//             steps {
//                 sh "docker build -t akashmondal0/socket-next-chat:latest ."
//             }
//         }
//         stage('minikube start') {
//             steps {
//                 sh "minikube start --driver=docker"
//             }
//         }
//         stage('configure mysql database deployment file') {
//             steps {
//                 sh "cd kubernetes/mysql && kubectl apply -f mysql.yaml && kubectl apply -f mysql-vc.yaml && kubectl port-forward svc/mysql 3306:3306 --address 0.0.0.0"
//             }
//         }
//         stage('configure socket deployment file') {
//             steps {
//                 sh "cd kubernetes/socket && kubectl apply -f socket.yaml && kubectl port-forward svc/socket 3003:3003 --address 0.0.0.0"
//             }
//         }
//         stage('configure app deployment file') {
//              steps {
//                 sh "cd kubernetes/app && kubectl apply -f app.yaml && kubectl port-forward svc/next-chat 3000:3000 --address 0.0.0.0"
//             }
//         }
//     }
// }