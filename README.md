# userauth - User and Authentication API using JWT

This is the User and Authentication/Authorization API. It is currently hosted on public
DNS at https://userauth.virtualyou.info/ .

- Node.js Express User management utilizing CORS, Sequelize ORM
- Authentication and Authorization of resources within this API using JWT validation and User Roles
- API resources to assist other, related APIs with Authentication and Authorization (JWT,Role)

## API Resources
- POST /api/v1/auth/signup 
- POST /api/v1/auth/signin
- POST /api/v1/auth/signout
- GET /api/v1/users
- GET /api/v1/users/{id}
- GET /api/v1/users/{id}/roles

These resources are subject to great change and probably will be removed (no concern to test). These would provide
HTTP content based on ROLE_???. Ignore these for now. They are not included in Postman Collection.

- GET /api/v1/all
- GET /api/v1/owner
- GET /api/v1/agent
- GET /api/v1/monitor
- GET /api/v1/admin

## Pending Refactors
- Convert to Typescript and upgrade controllers to use Repositories, Data Mappers, and DTOs
- Use ENV exports with Dockerized container

## Project setup
Follow these steps to run this API locally.
1. `git clone https://github.com/dlwhitehurst/userauth.git`
2. `cd userauth`
3. `cp docker-compose.yaml ~/docker-compose/virtualyou/`
4. `cd ~/docker-compose/virtualyou`
5. `docker-compose up -d`

NOTE: The virtualyou schema is now running on localhost:3306 and shows no tables until the `vy-userauth`
API has been run to create the users, user_roles, and roles tables. In production these lines in `server.js`
will look just like this.

```javascript
/*
  db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
  });
*/

db.sequelize.sync();
```
6. Do the following, one time only for local testing. Comment the `db.sequelize.sync();` line and uncomment
   the commented section calling `initial();`
7. In `server.js` comment the cookie domain around line 19.
8. Run `npm start`. This will create the tables and create the static Role objects.
9. Kill the running server, put the code back with the `db.sequelize.sync()`, and `npm start` again. The database is prepared for use
   now.

### Database
The database is MySQL dialect but we will probably use MariaDB for now. This API is currently hosted on
Kubernetes and it's using MariaDB as a service. Use the docker-compose in an isolated folder away from
this repo because the docker image uses a volume locally called `data/` and you need root privileges to
delete this volume.

E.g. local client JDBC connection `jdbc:mariadb://localhost:3306/virtualyou`

### Environment
Now copy these exports into your local terminal.
```bash
export COOKIE_SECRET=virtual-you-secret
export DB_HOST='localhost'
export DB_USERNAME='root'
export DB_PASSWORD='mariadbAdmin123'
export DB_SCHEMA='virtualyou'
export NODE_OPTIONS="--unhandled-rejections=strict"
```
Disclaimer: These exports will be for the local MariaDB image described in `docker-compose.yaml`.

### Dependencies
Software dependencies used with this API do not come with the repository
clone. Use the following command to install dependencies required by  `package.json`.

```
npm install
```

### Run
```
npm start
```

### Create Docker Image
Pending draft

### Kubernetes Hosting
Pending draft
