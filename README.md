# userauth - User and Authentication API using JWT

This is the User and Authentication/Authorization API. It is currently 
hosted on public DNS at https://userauth.virtualyou.info/ .

## News
This API was converted from javascript to typescript on Dec 9, 2023.

## API Resources

- POST /userauth/v1/auth/signup
- POST /userauth/v1/auth/signin
- POST /userauth/v1/auth/signout
- GET /userauth/v1/users
- GET /userauth/v1/users/{id}
- GET /userauth/v1/users/{id}/roles

These resources are subject to great change and probably will be removed (no concern to test). These would provide
HTTP content based on ROLE\_???. Ignore these for now. They are not included in Postman Collection.

- GET /userauth/v1/all
- GET /userauth/v1/owner
- GET /userauth/v1/agent
- GET /userauth/v1/monitor
- GET /userauth/v1/admin

## Project setup

Follow these steps to run this API locally.

1. `git clone git@github.com:virtualyou/userauth.git`
2. `cd userauth`
3. `yarn install`
4. `yarn dev -- --init=true` # this creates roles

WARNING: if the `--init=true` is used, it will wipe all users in an
established database. Use at your own risk.

To test and see coverage.

1. `yarn test`
2. `yarn coverage`

### Database

The database is MySQL dialect but we will probably use MariaDB for now. 
This API is currently hosted on Kubernetes and it's using MariaDB as a 
service. Use the docker-compose in an isolated folder away from this 
repo because the docker image uses a volume locally called `data/` and 
you need root privileges to delete this volume.

NOTE: The other API hostings will use the MariaDB schema `virtualyou`. 
You only need to run the database in the background using the 
docker-compose once.

### Environment

The API ENV is contained in a file with this repo called `.env`. The values are configured to work in a
local environment or workstation. Naturally in production, these values would be different and also
DO NOT COMMIT production values to this repository.

Disclaimer: These exports will be for the local MariaDB image described in `docker-compose.yaml`.

### Dependencies

Software dependencies used with this API do not come with the repository
clone. Use the following command to install dependencies required by `package.json`.

```
yarn install
```

### Run

```
yarn dev
```

### Create Docker Image

Pending draft

### Kubernetes Hosting

Pending draft
