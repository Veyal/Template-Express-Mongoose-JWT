# Express-Mongo-JWT Template

REST API Template with jwt authentication using express and mongo as database

Tested on Ubuntu 20.04 WSL using node v10.19.0

## Installation (For Ubuntu 20.04)
### Mongo
#### Install mongodb
* follow [MongoDB Installation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
```bash
$ wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```

* Start mongodb using ```systemctl start mongod```
#### Setup admin password for mongodb
* Enter mongo shell using ```mongo```
* Enter db **admin** using ```use admin```
* Create superadmin user
``` 
db.createUser({ 
    user: "mongoadmin" , 
    pwd: "mongoadmin", 
    roles: [
        "userAdminAnyDatabase", 
        "dbAdminAnyDatabase", 
        "readWriteAnyDatabase"
    ]
})
```
* Create admin user on desired db
```
use xyz
db.createUser({
    user: 'xyzadmin', 
    pwd: 'xyzpassword', 
    roles: ["dbOwner"]
})
```
#### Edit Mongo config
* Open Mongo config on ```/etc/mongod.conf```
* [Enable authentication](https://stackoverflow.com/questions/25325142/how-to-set-authorization-in-mongodb-config-file) by adding ```auth = true```(<v2.4)

#### Lastly
* Install all required library using ```npm install```
* Config env.json file
