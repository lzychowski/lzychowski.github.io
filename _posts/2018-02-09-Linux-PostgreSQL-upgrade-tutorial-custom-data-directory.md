---
title: Linux (RedHat 7) PostgreSQL upgrade from 9.4 to 9.5 with a custom data directory
author: Leszek Zychowski
layout: post
permalink: /Linux-PostgreSQL-upgrade-tutorial-custom-data-directory
path: 2018-02-09-Linux-PostgreSQL-upgrade-tutorial-custom-data-directory.md
---

## Introduction

This tutorial will take you through a step-by-step process of upgrading PostgreSQL 9.4 to 9.5 on Linux RadHat.  The data folder in this tutorial is NOT located in the default directory (stored on a separate volume).  Most of the steps below will apply to other versions of Linux as well as other versions of PostgreSQL.

## Requirements

1. root access to the machine
2. Internet connection / public IP.  My instance was hosted on an EC2 instance in AWS.  The solution was to provision an Elastic IP and assign it to the instance for the duration of the upgrade.  Make sure to remove the public IP from your instance after the upgrade is done.

## Installation

1. Login as `root` using `sudo su - root`

2. Download and install PostgreSQL 9.5 via yum 
    `yum install https://download.postgresql.org/pub/repos/yum/9.5/redhat/rhel-7-x86_64/pgdg-redhat95-9.5-3.noarch.rpm`
and `yum install postgresql95-server postgresql95 postgresql95-contrib postgresql95-libs -y`

3. Create a new data folder (separate volume) f.e. `mkdir /u01/9.5/data`

4. Change owner of the folder to `postgres` using `chown postgres /u01/9.5/data`

5. Change permissions of the new data folder using `chmod 700 /u01/9.5/data`

6. Switch to `postgres` user via `su postgres` and initialize the database by running `/usr/pgsql-9.5/bin/initdb -D /u01/9.5/data`

7. Switch back to `root` user via `exit`

8. Stop and disable PostgreSQL 9.4 using `systemctl stop postgresql-9.4.service` and `systemctl disable postgresql-9.4.service`

9. Modify `postgresql.conf` and `pg_hba.conf` in `/u01/9.5/data` to accept remote connections.  For `postgres.conf` modify `#listen_addresses='localhost'` to `listen_addresses='*'` or `listen_addresses='ip_address_of_consumer'`. For `pg_hba.conf` modify `host all all 127.0.0.1/24 trust` to `host all all 0.0.0.0/0 trust` or `host all all ip_address_of_consumer/24 trust`

10. Change value PGDATA environment variable to use the new directory using `export $PGDATA=/u01/9.5/data`

11. Remove the default data folder in the PostgreSQL 9.5 installation direcotry using `rm /var/lib/pgsql/9.5/data -r`

12. Create a symbolic link to the new data directory using `ln -s /u01/9.5/data /var/lib/pgsql/9.5/data`

13. Switch to `postgres` user via `su postgres`. Below steps have to be executed as the `postgres` user.

14. Run data upgrade script with `--check` flag to determine if data can be upgraded from 9.4 to 9.5. `/usr/pgsql-9.5/bin/pg_upgrade --old-bindir=/usr/pgsql-9.4/bin/ --new-bindir=/usr/pgsql-9.5/bin/ --old-datadir=/u01/data/ --new-datadir=/u01/9.5/data/ --check`

15. If everything looks OK in step 14, run the actual upgrade script `/usr/pgsql-9.5/bin/pg_upgrade --old-bindir=/usr/pgsql-9.4/bin/ --new-bindir=/usr/pgsql-9.5/bin/ --old-datadir=/u01/data/ --new-datadir=/u01/9.5/data/`

16. Switch back to `root` user via `exit`

17. Enable PostgreSQL 9.5 service and start it by running `systemctl enable postgresql-9.5.service` and `service postgresql-9.5 start`

This should conclude the upgrade process.  As stated above, make sure to remove any public IPs from your instance so that there is no direct access from the Internet.
 

