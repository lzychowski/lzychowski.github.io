---
title: CRUD operations on Oracle DB using Entity Framework
author: Leszek
layout: post
permalink: /CRUD-operations-Oracle-Entity-Framework
path: 2016-03-06-CRUD-operations-Oracle-Entity-Framework.md
---

Recently I was tasked with creating a small project in which I had to perform 4 basic operations on an Oracle database: create, read, update, and delete.  My choice of language was C# as I spent the last year and a half coding in the .net stack.

I have to say that connecting to an Oracle database from C# is not as straight forward as connecting to MS SQL database.

I found a great post by Mariusz Bojkowski which outlines the setup required to be able to access the database.  You can find the instructions on the csharp.today blog at [Entity Framework 6 Database First With Oracle](//csharp.today/entity-framework-6-database-first-with-oracle/).

After you complete Mariusz's tutorial you should have generated few files.  Among them you will find a context and a model.  You will create an instance of this context in a controller of your choice and use the model for various operations.

The remainder of the steps was not outlined, therefore I compiled a quick list of code snippets that will allow you to immediately perform CRUD operations on your Oracle database table.  They are listed below.

First take a look at the classes generated from the instructions in Mariusz's blog.  The DB context class should look similar to this

``` csharp
namespace Project.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class EntityClass : DbContext
    {
        public Entities1()
            : base("name=YourConnectionStringName")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<MODELNAME> TABLENAME { get; set; }
    }
}
```

Where MODELNAME is

``` csharp
namespace Project.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class MODELNAME
    {
        public decimal ID { get; set; }
        public string NAME { get; set; }
    }
}
```

Now you are ready to create an instance of the context

``` csharp
private EntityClass db = new EntityClass();
```

Get all rows in the table

``` csharp
var list = db.TABLENAME.ToList();
```

Get single row

``` csharp
var model = db.TABLENAME.FirstOfDefault(x => x.ID == ID);
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
db.TABLENAME.Remove(db.TABLENAME.FirstOfDefault(x => x.ID == ID));
db.SaveChanges();
```