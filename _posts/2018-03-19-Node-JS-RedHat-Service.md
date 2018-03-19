---
title: NodeJS RedHat Service
author: Leszek Zychowski
layout: post
permalink: /Node-JS-RedHat-Service
path: 2018-03-19-Node-JS-RedHat-Service.md
---

## Introduction

Setting up Node.js app is fairly easy on platforms like Heroku, but it is also possible to set it up as a service on a standard Linux machine.  

## Requirements

1. NodeJS
2. Working NodeJS project that can be executed manually
3. Text editor of your choice.  I will be using Nano which can be installed via `yum install -y nano`

## Installation

1. Switch to `root` or another sudoer suing `sudo su - USER_NAME_HERE`.
2. Navigate to the system folder using `cd /etc/systemd/system`. 
3. Create service file by typing `nano mynodejsapp.service`.
4. Add the following code to the file. 

```
[Unit]
# replace with your own name
Description=mynodejsapp

[Service]
# replace with your own file
ExecStart=/bin/node /opt/local/dev/mynodejsapp/server.js
Restart=always
User=nobody
# Note RHEL/Fedora uses 'nobody', Debian/Ubuntu uses 'nogroup'
Group=nobody
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
# replace with your own directory
WorkingDirectory=/opt/local/dev/mynodejsapp

[Install]
WantedBy=multi-user.target
```

5. Save the file via `CTRL + X`, `y`, `Enter`.
6. Activate the service so it starts after reboots using `systemctl enable mynodejsapp.service`.
7. Start the service via `service mynodejsapp start` or `systemctl start mynodejsapp.service`.
