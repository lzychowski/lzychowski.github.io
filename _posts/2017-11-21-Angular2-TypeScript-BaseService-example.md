---
title: Angular2 TypeScript BaseService example
author: Leszek Zychowski
layout: post
permalink: /Angular2-TypeScript-BaseService-example
path: 2017-11-21-Angular2-TypeScript-BaseService-example.md
---

## Introduction

Ever wonder how to utilize TypeScript's inheritance to create a usable BaseService in Angular2+? Wonder no more.  In this tutorial we will create a single class that can be extended by any Angular service without the need to rewrite code that handles AJAX calls and response processing.  

## Imports

The imports in this example cover basic HTTP operations as well as handling of promises and cookies.  Ngx-cookie library can be downloaded from NPM via `npm install ngx-cookie`.

``` typescript
import { Injectable, Injector } from '@angular/core';
import { Headers, Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import 'rxjs/add/operator/toPromise';
```

## Generic class

Next we want to create a generic BaseService that will return a promise containing a specific model.  A service extending this class will specify the model used in the BaseService as such `export class MyService extends BaseService<MyModel>`.

``` typescript

export class BaseService<Type> {

    protected headers = new Headers();

    protected http: Http;
    protected cookieService: CookieService;
    
    constructor (private injector: Injector) {
        console.log("constructor");

        this.http = this.injector.get(Http);
        this.cookieService = injector.get(CookieService);
    }
    
    ...
}
```

## HTTP and helper methods

Lastly we need to write the actual code that will fire up the AJAX requests as well as handle headers, request body, and errors.

``` typescript

    ...

    // base CRUD methods
    // -----------------

    protected getMany(url: string, options?: RequestOptionsArgs): Promise<Array<Type>> {
        console.log("getMany");

        return this.http.get(url, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }

    protected get(url: string, options?: RequestOptionsArgs): Promise<Type> {
        console.log("get");

        return this.http.get(url, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }

    protected post(url: string, options?: RequestOptionsArgs): Promise<Type> {
        console.log("post");

        return this.http.post(url, this.buildBody(options), options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }

    // data and error handling
    // -----------------------
    
    protected buildBody(options: RequestOptionsArgs): any {
        console.log("buildBody");
        
        if (options){
            return options.body;
        } else {
            return null;
        }
    }

    protected extractData(response: Response): any {
        console.log("extractData");

        let obj = response.json();
        return obj || [];
    }

    protected handleError(error: any): Promise<any> {
        console.log("handleError");
        
        return Promise.reject(error.message || error);
    }

    // HTTP header methods
    // -------------------

    protected appendToHeader(key: string, value: string): void {
        console.log("appendToHeader");
        
        if (!this.headers.has(key)){
            this.headers.append(key, value);
        }
    }
    
    ...
    
```



