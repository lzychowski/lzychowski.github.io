---
title: CRUD operations on Oracle DB using Entity Framework
author: Leszek
layout: post
permalink: /CRUD-operations-Oracle-Entity-Framework
path: 2016-03-06-CRUD-operations-Oracle-Entity-Framework.md
---

Recently I was tasked with creating a small project in which I had to perform 4 basic operations on an Oracle database: create, read, update, delete.  My choice of language was C# as I spent last year and a half coding in the .net stack.

I have to say that connecting to an Oracle database from C# is not as straight forward as connecting to MS SQL database.  I found a great post by Mariusz Bojkowski which outlines the setup required to be able to access the database.  You can find the instructions on the csharp.today blog at https://csharp.today/entity-framework-6-database-first-with-oracle/.

The remainder of the steps was not outlined, therefore I compiled a quick list of code snippets that will allow you to immediately perform CRUD operations on your Oracle database table.  They are listed below.

Get all rows in the table

``` csharp
var list = db.TABLENAME.ToList();
```

Get single row

``` csharp
var list = db.TABLENAME.ToList();
```

Add row to the table

``` csharp
db.TABLENAME.Add(model);
db.SaveChanges();
```

Update row

``` csharp
db.TABLENAME.Attach(model);
var entry = db.Entry(model);
entry.Property(e => e.COLUMN_TO_UPDATE).IsModified = true;
db.SaveChanges();
```

Delete row from the table

``` csharp
db.TABLENAME.Remove(db.TABLENAME.First(x => x.ID == ID));
db.SaveChanges();
```