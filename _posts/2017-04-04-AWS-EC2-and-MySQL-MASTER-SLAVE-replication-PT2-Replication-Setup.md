---
title: AWS EC2 and MySQL MASTER-SLAVE replication PT2 - Replication Setup
author: Joanna Bursakowska
layout: post
permalink: /AWS-EC2-and-MySQL-MASTER-SLAVE-replication-PT2-Replication-Setup
path: 2017-04-04-AWS-EC2-and-MySQL-MASTER-SLAVE-replication-PT2-Replication-Setup.md
---

## Introduction

In this tutorial we will pick up where we left off after setting up two EC2 instances for our MySQL replication setup.

## Install MySQL

We will not cover MySQL installation in detail as there are many options and versions of the software.  An important thing to keep in mind is that both EC2 instances should be running the same version of MySQL server.  During our setup we have used MySQL Community Edition 5.7.

## Server ID and Binary Logging

The first step is to differentiate between the instances by changing `server-id` property in the `my.ini` file of each instance.  In our case this file was located in `C:\ProgramData\MySQL\MySQL Server 5.7`.  We have changed MASTER to `1` and SLAVE to `2`.

The second step is to enable binary logging on the MASTER instance that will be read by the SLAVE instance in order to replicate any changes that happen on the MASTER.  To do that, you will set the `log-bin` property with the location/prefix for your log files.

```
# Binary Logging.
log-bin="folder/prefix"
```

## Create MASTER User

Next, we have to create a user on the MASTER instance and allow SLAVE to replicate using that user.  You do that by executing the following commands.

``` sql
CREATE USER 'replication'@'ip_of_SLAVE_server' IDENTIFIED BY 'password';

GRANT REPLICATION SLAVE ON *.* TO 'replication'@'ip_of_SLAVE_server';
```

## Sync Data

Depending on what data you have on the MASTER instance, you might have to take a backup of MASTER and restore it on the SLAVE.  In our instance we used the demo database on both servers therefore it was not necessary to initially sync both instances together.

## Setup SLAVE

The final step to the replication setup is to provide the SLAVE instance with information from where to read changes on the MASTER instance.  First, let's find the current bin log file and position on MASTER.

``` sql
show master status;
```

[![MASTER status](/assets/images/20170404/1.JPG)](/assets/images/20170404/1.JPG)

Using the above information, execute the following statement on the SLAVE instance:

``` sql
CHANGE MASTER TO MASTER_HOST = 'ip_of_MASTER_server',
                 MASTER_USER = 'replication',
                 MASTER_PASSWORD = 'password',
                 MASTER_LOG_FILE = 'name_of_log_file_from_screenshot',
                 MASTER_LOG_POS = integer_position_from_screenshot;
 ```

## Start and Test Replication

All we have left is to start the SLAVE and run some insert commands on the MASTER so that they are replicated to the SLAVE.  First, start the SLAVE

``` sql
start slave;
```

and then check its status

``` sql
show slave status;
```

[![SLAVE status](/assets/images/20170404/2.JPG)](/assets/images/20170404/2.JPG)

Now go ahead and insert a row into any table on the MASTER instance that you want replicated. As soon as you run the insert statement on MASTER you should be able to go to the SLAVE instance and see your new data in the table.





