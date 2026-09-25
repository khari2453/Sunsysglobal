# 🛤️ AI RESUME MATCHER

A AI resume matcher platform built with a 2-tier architecture — React frontend, Python backend .

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/python-3670A0?logo=python&logoColor=ffdd54)

<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/875d38af-48db-4af9-b7aa-b7a84f942c9f" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/2bbf96bf-cda3-447f-8319-01e794418006" 
  
  
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/434bfa1d-af14-4c48-8abb-2afe3162ff63" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/71ccc569-022f-486e-a98a-116898b2008f" />

<img width="1366" height="2413" alt="image" src="https://github.com/user-attachments/assets/3ca0ac63-2bd8-4e78-bf73-912054f16fcf" />
<img width="1366" height="1328" alt="image" src="https://github.com/user-attachments/assets/45e6939e-cf36-4435-b3c1-74b24f702b55" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/08b0bf4f-932e-4f81-86d7-d1e9a7857497" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/f47d5487-366d-4df4-9022-35a2d2a2e9c9" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/8a7d70e6-56c0-4fd7-b975-a0ed485f2903" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/df02f457-c02a-41b9-9903-0022e5c36ff5" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/14e8dbf8-4cde-4356-a02b-ee5f82608b78" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/07ea2a50-ffc3-403e-beb6-98978f5e6ee8" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/3bf0a22e-78fc-4001-96dd-3fb701a1061e" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/49feacce-dc7b-433f-b206-9f63511ad482" />
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/bcfc5a11-a8a9-4037-97fe-d9595c211fdd" />



https://mail.google.com/mail/u/0?ui=2&ik=ee93ae9296&attid=0.1&permmsgid=msg-a:r8602438544460613843&view=fimg&fur=ip&permmsgid=msg-a:r8602438544460613843&sz=s0-l75-ft&attbid=ANGjdJ_QjIQ6T9cLc_PjNxEVyLk_de6LFHFOPvz-dEiVeGSOmVrMJ6MhW_QMjmPZxFgc65fDEWxXeDS_JreYnS9S88fRbU5XyGX0OQOZSIftLfGyaRhfn8kN5KIifi0&disp=emb&realattid=ii_mtvu62gk0&zw

    1  groups
    2  docker run -d --name sonar -p 9000:9000 sonarqube:lts-community
    3  docker ps
    4  sudo apt-get install -y wget apt-transport-https gnupg lsb-release
    5  wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo gpg --dearmor -o /usr/share/keyrings/trivy.gpg
    6  echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
    7  sudo apt-get update
    8  sudo apt-get install -y trivy
    9  trivy --version
   10  echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   11  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   12  kubectl version --client
   13  sudo apt-get update
   14  sudo apt-get install -y kubectl
   15  curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
   16  sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
   17  minikube start
   18  groups jenkins
   19  history
   20  sudo usermod -aG docker jenkins
   21  groups jenkins
   22  sudo systemctl restart jenkins
   23  minikube status
   24  kubectl get nodes
   25  minikube ip
   26  kubectl create namespace sunsys
   27  kubectl get ns
   28  vi backend-deployment.yaml
   29  kubectl apply -f backend-deployment.yaml
   30  kubectl get deployment -n sunsys
   31  vi frontend-deployment.yaml
   32  kubectl apply -f frontend-deployment.yaml
   33  vi frontend-deployment.yaml
   34  kubectl apply -f frontend-deployment.yaml
   35  kubectl get deployment -n sunsys
   36  kubectl get pods -n sunsys
   37  vi backend-service.yaml
   38  kubectl apply -f backend-service.yaml
   39  kubectl get svc -n sunsys
   40  vi frontend-service.yaml
   41  kubectl apply -f frontend-service.yaml
   42  kubectl get svc -n sunsys
   43  minikube ip
   44  curl http://192.168.49.2:31210
   45  kubectl port-forward svc/backend 8000:8000 -n sunsys
   46  sudo ss -lntp | grep :8000
   47  docker ps
   48  kubectl get pods -n sunsys
   49  kubectl get svc -n sunsys
   50  kubectl port-forward svc/backend 8000:8000 -n sunsys
   51  curl http://localhost:8000/docs
   52  kubectl port-forward --address 0.0.0.0 svc/backend 8000:8000 -n sunsys
   53  docker images
   54  # ubectl port-forward --address 0.0.0.0 svc/backend 8000:8000 -n sunsy
   55  minikube addons list
   56  minikube addons enable ingress
   57  df -h
   58  kubectl get pods -n ingress-nginx
   59  vi ingress.yaml
   60  kubectl apply -f ingress.yaml
   61  kubectl get ingress -n sunsys
   62  kubectl get pods -n ingress-nginx
   63  minikube ip
   64  kubectl get svc -n ingress-nginx
   65  /home/ubuntu/.kube/config
   66  ~/.kube/config
   67  ls -l ~/.kube/config
   68  kubectl config view
   69  cp ~/.kube/config ~/jenkins-kubeconfig
   70  kubectl config view --raw --flatten > ~/jenkins-kubeconfig
   71  grep -E "server:|certificate-authority-data:|client-certificate-data:|client-key-data:" ~/jenkins-kubeconfig
   72  kubectl --kubeconfig=$HOME/jenkins-kubeconfig get nodes
   73  kubectl --kubeconfig=$HOME/jenkins-kubeconfig get pods -n sunsys
   74  -rw------- 1 ubuntu jenkins
   75  /home/ubuntu/jenkins-kubeconfig
   76  ls -l /home/ubuntu/jenkins-kubeconfig
   77  kubectl --kubeconfig=/home/ubuntu/jenkins-kubeconfig get nodes
   78  kubectl --kubeconfig=/home/ubuntu/jenkins-kubeconfig get pods -n sunsys
   79  ls -l /home/ubuntu/jenkins-kubeconfig
   80  ls -ld /home/ubuntu
   81  ls -l ~/.kube/config
   82  kubectl config view --raw --flatten > /tmp/jenkins-kubeconfig
   83  ls -l /tmp/jenkins-kubeconfig
   84  kubectl --kubeconfig=/tmp/jenkins-kubeconfig get nodes
   85  sudo cp ~/.kube/config /var/lib/jenkins/kubeconfig
   86  sudo chown jenkins:jenkins /var/lib/jenkins/kubeconfig
   87  sudo chmod 600 /var/lib/jenkins/kubeconfig
   88  sudo -u jenkins kubectl --kubeconfig=/var/lib/jenkins/kubeconfig get nodes
   89  kubectl config view --raw --flatten > /tmp/jenkins-kubeconfig
   90  sudo cp /tmp/jenkins-kubeconfig /var/lib/jenkins/kubeconfig
   91  sudo chown jenkins:jenkins /var/lib/jenkins/kubeconfig
   92  sudo chmod 600 /var/lib/jenkins/kubeconfig
   93  grep -E "certificate-authority-data|client-certificate-data|client-key-data" /var/lib/jenkins/kubeconfiggrep -E "certificate-authority-data|client-certificate-data|client-key-data" /var/lib/jenkins/kubeconfig
   94  grep -E "certificate-authority-data|client-certificate-data|client-key-data" /var/lib/jenkins/kubeconfig
   95  sudo -u jenkins kubectl --kubeconfig=/var/lib/jenkins/kubeconfig get nodes
   96  kubectl get pods -n sunsys
   97  kubectl get svc -n sunsys
   98  minikube ip
   99  kubectl get ingress -n sunsys
  100  kubectl port-forward --address 0.0.0.0 svc/frontend 8000-:80 -n sunsys
  101  kubectl port-forward --address 0.0.0.0 svc/frontend 8000:80 -n sunsys
  102  nohup kubectl port-forward --address 0.0.0.0 svc/frontend 8000:80 -n sunsys > /tmp/frontend-port-forward.log 2>&1 &
  103  nohup kubectl port-forward --address 0.0.0.0 svc/backend 8088:8000 -n sunsys > /tmp/backend-port-forward.log 2>&1 &
  104  # nohup kubectl port-forward --address 0.0.0.0 svc/backend 8088:8000 -n sunsys > /tmp/backend-port-forward.log 2>&1 &
  105  nohup kubectl port-forward --address 0.0.0.0 svc/frontend 9090:80 -n sunsys > /tmp/frontend-port-forward.log 2>&1 &
  106  nohup kubectl port-forward --address 0.0.0.0 svc/backend 8000:8000 -n sunsys > /tmp/backend-port-forward.log 2>&1 &
  107  kubectl get pods -n sunsys -o wide
  108  kubectl get endpoints backend -n sunsyskubectl get endpoints backend -n sunsys
  109  kubectl get endpoints backend -n sunsys
  110  kubectl describe ingress sunsys-ingress -n sunsys
  111  kubectl get svc -n ingress-nginx
  112  grep -R "0.0.0.0:8000\|100.53.203.102:8000" /var/lib/jenkins/workspace/sunsys/frontend -n 2>/dev/null
  113  cd /var/lib/jenkins/workspace/sunsys
  114  grep -R "8000\|BACKEND_URL\|api/tailor" frontend/src frontend 2>/dev/null
  115  cd
  116  ls
  117  #nohup kubectl port-forward --address 0.0.0.0 svc/frontend 9090:80 -n sunsys > /tmp/frontend-port-forward.log 2>&1 &
  118  kubectl run test-curl   --image=curlimages/curl   --rm -it   --restart=Never   -n sunsys   -- curl -v http://backend:8000/docs
  119  kubectl describe ingress sunsys-ingress -n sunsys
  120  kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -n sunsys -- curl http://backend:8000/docs












