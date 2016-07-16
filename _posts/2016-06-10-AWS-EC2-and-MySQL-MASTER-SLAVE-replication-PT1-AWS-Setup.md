---
title: AWS EC2 and MySQL MASTER-SLAVE replication PT1 - AWS Setup
author: Leszek Zychowski
layout: post
permalink: /AWS-EC2-and-MySQL-MASTER-SLAVE-replication-PT1-AWS-Setup
path: 2016-06-10-AWS-EC2-and-MySQL-MASTER-SLAVE-replication-PT1-AWS-Setup.md
---

## Introduction

Recently one of our DBA's decided to quit and left us with a huge MySQL database to maintain.  I am by no means a DBA, thefore this has been a real learning experience for me.  After further review we realised that there are no real backups being done.  The only thing we were relying on were snapshots on the SAN on which the DATA volumes were sitting.

We are talking about a database with billions of rows.  The loss of that data would've most likely shut down the company in question.  I have been hearing from the systems guys that SAN snapshots do not work well when restoring a database and a standard MySQL backup would be better.  That is exactly what we decided to do.

The goal was to create two MySQL instances, a MASTER instance and a SLAVE instance.  Backup would be taken on the SLAVE instance in order not to affect the performance of the production environment.  The database was ~400GB (not including indexes and logs) in size and it would take few hours to perform a dump.

We will use AWS as our platform in this tutorial.  Similar to the DBA part, I am not an AWS Admin, but I know enough to be dangerous.

## Security Group

One thing you might want to do beforehand is setup a Security Group that will be shared between both servers (you can create it during EC2 creation, but I decided to do it first). Now I am not a AWS security expert, but I did read in few places that in order to replicate between two MySQL servers they will need to be on the same security group.  For the inbound rules, I have added "All traffic" from 0.0.0.0/0.  WARNING: this opens up your server to all traffic.  I highly recommend that you do not do that in a production server.  The only reason why I set that up was that I was testing MySQL functionality and I was not working on anything valuable.

[![Amazon Security Groups](/assets/images/20160610/-1.JPG)](/assets/images/20160610/-1.JPG)

## EC2 Instances

You can create this setup on physical servers, but this tutorial will show you how to do it on Amazon's AWS EC2 instances.

[![Amazon EC2](/assets/images/20160610/0.JPG)](/assets/images/20160610/0.JPG)

Given that the current production environment was running Windows Server 2012, I decided to create 2 instances running Windows 2012 Server.

[![EC2 Widnows Server 2012](/assets/images/20160610/1.JPG)](/assets/images/20160610/1.JPG)

For the purpose of the tutorial we will use AWS Free tier.  I do have to warn that setting up the MySQL server will take a lot of time due to the lack of CPU power and RAM on the free tier micro instance.

[![EC2 Widnows Server 2012](/assets/images/20160610/2.JPG)](/assets/images/20160610/2.JPG)

You can most likely skip "Step 3: Configure Instance Details". We will be launching a single instance to act as the MASTER server.

[![EC2 Widnows Server 2012](/assets/images/20160610/3.JPG)](/assets/images/20160610/3.JPG)

Same as above for "Step 4: Add Storage".  Free tier allows 30GB of Elastic Block Storage.

[![EC2 Widnows Server 2012](/assets/images/20160610/4.JPG)](/assets/images/20160610/4.JPG)

For "Step 5: Tag Instance" I have added `Name=Master` for the MASTER instance.

[![EC2 Widnows Server 2012](/assets/images/20160610/5.JPG)](/assets/images/20160610/5.JPG)

In "Step 6: Configure Security Group" you will select the group you have created in the Security Group section of this tutorial.

[![EC2 Widnows Server 2012](/assets/images/20160610/6.JPG)](/assets/images/20160610/6.JPG)

At this point you are ready to launch the instance.  When you hit the launch button you will be prompted to either select or create a private/public key pair that will be used to retrieve passwords for the RDP session.

Name it, download it, and store it in a secure spot.

[![EC2 Widnows Server 2012](/assets/images/20160610/7.JPG)](/assets/images/20160610/7.JPG)

It will take few minutes before you can RDP into the server.

## Access Server

Once your instance is ready, you will be able to access under "Instances".  Click on the checkbox next to your instance and hit connect.

[![EC2 Widnows Server 2012](/assets/images/20160610/8.jpg)](/assets/images/20160610/8.jpg)

You will click on "Get Password" which will ask you to upload the Key you saved in the previous step.  The password will show up in place of the button once you are done.

Next click on "Download Remote Desktop File" and double click on the file.  Use the username and password from the modal window to access your server.

## Slave server

Follow the same steps for your SLAVE server.  Set the tag in Step5 to `Name=Slave`.

We are now ready to proceed to the MySQL installation and setup. Part 2 coming shortly.











