# KB-CAPTCHA
KB-CAPTCHA (Keyboard CAPTCHA) uses patterns in typical user typing behavior and machine learning to automatically determine if a user is a robot or not.
This repository contains all the tools used to build the model and sample frontend that uses the solution.

Detailed instructions for installation and usage of the project as well as instructions for viewing the analysis documents are [here](https://github.com/DowdyJ/KB-CAPTCHA/blob/main/Docs/KB-CAPTCHA%20User%20Manual.pdf). A simplfied version follows.

## Before you start
You will need Docker installed on your machine. Instructions for installing it vary by operating system, but you can get it for most operating systems [here](https://www.docker.com/). For Windows, launch Docker Desktop before opening the command line. This starts a background process that’s needed for the command line to function.<br>
If you are acquainted with Docker Desktop you can use that. However, the instructions below will assume you are using the command line. On Unix-like systems, you will likely need to run the docker commands as root. You can attempt to do it without root permissions, but it may break your configuration. On Windows, use an administrator command prompt. To open one:

1. Go to your start menu
2. Search “cmd”
3. Right click “command prompt”
4. Click “Run as Administrator”


## Installing
The commands below are not platform specific and will work on any Docker install.

To download the images and create the network needed for the front/backend, use the following commands.

1. <code>docker pull dowdyj/kb-captcha-frontend-demo</code>
2. <code>docker pull dowdyj/kb-captcha-backend</code>
3. <code>docker network create --driver=bridge kbcaptcha-network</code>

## Running
After performing the steps above, you can start the containers with the following commands:

1. <code>docker run -d -p 5000:5000 --network=kbcaptcha-network --name=kbcaptcha-python-backend dowdyj/kb-captcha-backend</code>
2. <code>docker run -d -p 8080:8080 --network=kbcaptcha-network --name=kbcaptcha-java-frontend dowdyj/kb-captcha-frontend-demo</code>

Last, visit http://localhost:8080 in your browser to see the webpage. If it fails to load, wait a moment and refresh the page.

## Stopping
To stop the solution, you can run these commands:

1. <code>docker stop kbcaptcha-java-frontend</code>
2. <code>docker stop kbcaptcha-python-backend</code>
3. <code>docker rm kbcaptcha-java-frontend</code>
4. <code>docker rm kbcaptcha-python-backend</code>

## Uninstalling
After you've stopped the containers, you can remove the files from your system and clean up with these commands:

1. <code>docker network rm kbcaptcha-network</code>
2. <code>docker image rm dowdyj/kb-captcha-frontend-demo</code>
3. <code>docker image rm dowdyj/kb-captcha-backend</code>



