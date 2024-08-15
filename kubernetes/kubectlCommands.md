apply yaml
kubectl apply -f app-deployment.yaml

service expose -
kubectl expose deployment nodejs-app --type="NodePort" --port 3003

port forwarding -
kubectl port-forward svc/app-deployment 3000:3000 --address 0.0.0.0 &

get all pods
kubectl get svc

delete deployment
kubectl delete deployment nodejs-app

delete all pods and deployments
kubectl delete pods,deployments,svc,ingress -A --all