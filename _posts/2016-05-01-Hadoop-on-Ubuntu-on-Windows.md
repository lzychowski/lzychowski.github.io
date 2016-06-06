---
title: Hadoop on Ubuntu on Windows
author: Leszek
layout: post
permalink: /Hadoop-on-Ubuntu-on-Windows
path: 2016-05-01-Hadoop-on-Ubuntu-on-Windows.md
---

I have only been tweeting for few months, and I mostly tweet about games, but when I tweeted about Big Data and Hadoop, I have received the most likes and retweets out of everything I ever posted.  It seems that Big Data and Hadoop are a hot topic at this point in time.

Today's tutorial will walk us through setting up Hadoop on a Ubuntu VM in a Windows environment.  The first step is to download VirtualBox from Oracle.  It will allow you to install Ubuntu Server (command line only).

You can download Ubuntu Server 16.04 LTS from [here](http://www.ubuntu.com/download/server).

Once you download it, start VirtualBox and click on the New button.

[![VirtualBox New VM](/assets/images/20160422/1.JPG)](/assets/images/20160422/1.JPG)

Next hit Create and select file location where your VM will be stored.

[![VirtualBox New VM](/assets/images/20160422/2.JPG)](/assets/images/20160422/2.JPG)

Hit Create again which will take you to the main screen that lists all your VMs.

[![VirtualBox New VM](/assets/images/20160422/3.JPG)](/assets/images/20160422/3.JPG)

You will want to setup Bridged Adapter under Network settings to assign a unique IP address to your Ubuntu VM.  Right click on the VM you just created and click on Settings.  Under Settings select the Network tab.

Under the Adapter 1 tab you will select Bridged Adapter from the Attached to drop down.

[![VirtualBox New VM](/assets/images/20160422/6.JPG)](/assets/images/20160422/6.JPG)

Click OK.

Next double click on UnbutuServer1 (or whatever you called your new VM).  You will see the following screen.  You will be asked to select the location of the ISO file you have downloaded from Ubuntu website.  In my image you will see an earlier version, but the current version you can download is 16.04 LTS.

[![VirtualBox New VM](/assets/images/20160422/4.JPG)](/assets/images/20160422/4.JPG)

Hit start to begin Ubuntu setup.

[![VirtualBox New VM](/assets/images/20160422/5.JPG)](/assets/images/20160422/5.JPG)

There are no specific setup options you have to choose to be able to install Hadoop.  You can follow [Ubuntu Server Guide](http://ubuntuserverguide.com/2014/04/how-to-install-ubuntu-server-14-04-trusty-tahr.html) to finish the installation of Ubuntu Server.

Once you are done you will see Ubuntu Server prompt.  The great tutorial I followed to setup Hadoop is located at [bogotobogo.com](http://www.bogotobogo.com/Hadoop/BigData_hadoop_Install_on_ubuntu_single_node_cluster.php)

Finally you will run `start-all.sh` command which wil start Hadoop on your VM.  Next thing you will want to do is find your IP address.  You can type `ifconfig` at the command prompt to view your `eth0` IP address.

[![VirtualBox New VM](/assets/images/20160422/7.JPG)](/assets/images/20160422/7.JPG)

Once you find your IP address you can navigate to `http://{ipaddress}:50070/` to reach the Hadoop Overview screen.

[![VirtualBox New VM](/assets/images/20160422/8.JPG)](/assets/images/20160422/8.JPG)

