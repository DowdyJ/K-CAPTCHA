# KB-CAPTCHA
KB-CAPTCHA (Keyboard CAPTCHA) uses patterns in typical user typing behavior and machine learning to automatically determine if a user is a robot or not.
This repository contains all the tools used to build the model and sample frontend that uses the solution.

## Installation
To run and install the front/backend, use the following commands. Keep in mind **you will likely need to run these as root** as Docker requires such permissions. For Windows, run in an administartor command prompt.  

<code>docker pull dowdyj/kb-captcha-frontend-demo</code><br>
<code>docker pull dowdyj/kb-captcha-backend</code><br>
<code>docker network create --driver=bridge kbcaptcha-network</code><br>
<code>docker run -d -p 5000:5000 --network=kbcaptcha-network --name=kbcaptcha-python-backend dowdyj/kb-captcha-backend</code><br>
<code>docker run -d -p 8080:8080 --network=kbcaptcha-network --name=kbcaptcha-java-frontend dowdyj/kb-captcha-frontend-demo</code><br>

All together (Won't work on PowerShell):<br>
<code>docker pull dowdyj/kb-captcha-frontend-demo && docker pull dowdyj/kb-captcha-backend && docker network create --driver=bridge kbcaptcha-network && docker run -d -p 5000:5000 --network=kbcaptcha-network --name=kbcaptcha-python-backend dowdyj/kb-captcha-backend && docker run -d -p 8080:8080 --network=kbcaptcha-network --name=kbcaptcha-java-frontend dowdyj/kb-captcha-frontend-demo</code><br>


Last, visit http://localhost:8080 in your browser to see the webpage. If it fails to load, wait a moment and refresh the page.


When you're done, you can clean up with:<br>

<code>docker network rm kbcaptcha-network</code><br>
<code>docker stop kbcaptcha-java-frontend</code><br>
<code>docker stop kbcaptcha-python-backend</code><br>
<code>docker rm kbcaptcha-java-frontend</code><br>
<code>docker rm kbcaptcha-python-backend</code><br>
<code>docker image rm dowdyj/kb-captcha-frontend-demo</code><br>
<code>docker image rm dowdyj/kb-captcha-backend</code><br>

Or, in one command:<br>
<code>docker network rm kbcaptcha-network && docker stop kbcaptcha-java-frontend && docker stop kbcaptcha-python-backend && docker rm kbcaptcha-java-frontend && docker rm kbcaptcha-python-backend && docker image rm dowdyj/kb-captcha-frontend-demo && docker image rm dowdyj/kb-captcha-backend</code><br>
