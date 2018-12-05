# CMPE226 Database Web Service

```
Enabling users to find carpool services online from other users
```

### Run 

```` 

Client: port 3000
Server: port 5000 

Create a MySQL Database

name: db
username: root
password: root 

Look at mysql folder for schema 


All mysql file in /mysql

Server: 
node server.js or 
nodemon server.js


Client:
npm start

````

### Dependency 

``` 
MySQL 
Redis 
MongoDB
```

TODO: 
### GET 
```aidl
/v1/users
/v1/users/{:id}
/v1/post

```

### POST 

```aidl

/v1/signin
/v1/signup
/v1/logout

/v1/post (use when users want to make a post to database)



```


### PUT
```aidl 
 /v1/users/{:id}
```

### DELETE

```
 /v1/users/{:id} 
```

Notes:

username is email