---
title: Connecting to Active Directory using C#
author: Leszek
layout: post
permalink: /Connecting-to-Active-Directory-using-CSharp
path: 2016-03-30-Connecting-to-Active-Directory-using-CSharp.md
---

Another assignment that I had to complete was connecting to AD (Active Directory) using C#.  In this assignment I had to start with referencing the `System.DirectoryService` library.

``` csharp
using System.DirectoryServices;
```

I really wish I owned [ReSharper](//www.jetbrains.com/resharper/) which is an extension to Visual Studio that greatly simplifies management of references, but I did not.

The next step was pretty straight forward.  I had to create an instance of `DirectoryEntry` class, set the LDAP path, username, and password.

``` csharp
DirectoryEntry ldapConnection = new DirectoryEntry("MY_CONNECTION_NAME");
ldapConnection.Path = "LDAP://PATH";
ldapConnection.AuthenticationType = AuthenticationTypes.Secure;
ldapConnection.Username = username;
ldapConnection.Password = password;
```

The last step was to create an instance of `DirectorySearcher` and call the `.FindAll()` (or whatever type of retrieval you will be doing) method on it.

``` csharp
DirectorySearcher search = new DirectorySearcher(ldapConnection);
SearchResultCollection result = search.FindAll();
```

Authentication exceptions can be caught using the `DirectoryServicesCOMException` class.