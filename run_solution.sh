docker network create --driver=bridge kbcaptcha-network
docker run -d -p 5000:5000 --network=kbcaptcha-network --name=kbcaptcha-python-backend kbcaptcha-backend
docker run -d -p 8080:8080 --network=kbcaptcha-network --name=kbcaptcha-java-frontend kbcaptcha-frontend-demo