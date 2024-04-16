# payroll-compare-authorization

## Dependencies
- Node.js [Node JS Installation Docs](https://nodejs.org/en/download/)
- graphql [GraphQL Docs](https://graphql.org/)
- postgresql [PostgreSQL Docs](https://www.postgresql.org/)
    - pgadmin [pgAdmin Docs](https://www.pgadmin.org/)
- prisma [prisma Docs](https://www.prisma.io/docs)
- aws-sdk (for deployment) [AWS SDK Docs](https://docs.aws.amazon.com/sdk-for-javascript/index.html)

## Installation
Make sure dependencies are installed on your machine.

### PostgreSQL Setup 
1. Install PostgreSQL on your machine. The default install will include pgAdmin.
2. When prompted for a password, use `postgres`

3. If you don't have a serverGroup:
    In pgAdmin create a new serverGroup called `Implementation Tools`

#### For Local Development

4. Create a new server in Implementation Tools:
    - Name: Local Dev
    - Host: localhost
    - Port: 5432
    - Username: postgres
    - Password: postgres 

#### For Live Development

5. Create a new server in Implementation Tools:
    - Name: Live Dev
    - Get the live db access credentials from a team member with AWS access.

### Repo Setup 
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Make a copy of the `.env.example` file and name it `.env`. Fill in the `DATABASE_URL` with your database connection string. This is the default: 
    ```
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/PayrollCompare?schema=users"
    ```
    If you don't use the default make sure to update your connection string in your .env file. Here is the template:
    ```
    DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?schema=<schema>"
    ```
4. Run `npx prisma generate` to generate the Prisma client
5. Run `npx prisma migrate dev` to create the database schema
6. Run `npm run dev` to start the server
    - The server will be running on `http://localhost:8080/graphql` click on the link and make sure Yoga GraphiQL opens

## Development
If you make changes to the prisma schema, you will need to run prisma generate and run a migration to update your local database.

```bash
npx prisma generate

# replace everything including < > with the version number
npx prisma migrate dev --name <version index (example: 01)>_SomeDescription
```

### GraphQL
The GraphQL API is available at `http://localhost:8080/graphql` when the server is running. You can use the GraphiQL interface to test queries and mutations.


## AWS CLI Configuration

Make sure you have an AWS profile created with the name `eugs-implementation-tools`. To do this, you can run `aws configure --profile eugs-implementation-tools`.

## Upload Docker image to AWS ECR

### Manual

1. Retrieve auth token
   `aws ecr get-login-password --region us-east-2 --profile eugs-implementation-tools | docker login --username AWS --password-stdin 456217261092.dkr.ecr.us-east-2.amazonaws.com`
2. Build Docker
   `docker buildx build --platform=linux/amd64 -t payroll-compare-authorization .`
3. Tag Docker image as latest
   `docker tag payroll-compare-authorization:latest 456217261092.dkr.ecr.us-east-2.amazonaws.com/payroll-compare-authorization:latest`
4. Upload to AWS ECR
   `docker push 456217261092.dkr.ecr.us-east-2.amazonaws.com/payroll-compare-authorization:latest`

### Semi-Automated

Run the local script like this:
`./deploy.sh eugs-implementation-tools us-east-2`

## Publish New Node Version to Public ECR

1. Pull node from docker hub
   `docker pull --platform=linux/amd64 node:16.16.0`
   Substiture `16.16.0` with the version you need
2. Tag the new version with our ECR version:
   `docker tag node:16.16.0 public.ecr.aws/a3x6y7o3/node:16.16.0`
   if this is the latest we are supporting then also tag it as latest
   ``docker tag node:16.16.0 public.ecr.aws/a3x6y7o3/node:latest`
3. Push to our ECR
   `docker push public.ecr.aws/a3x6y7o3/node:16.16.0`
   If you built a new latest, then also push it
   `docker push public.ecr.aws/a3x6y7o3/node:latest`

## GraphQL

You can visit /graphql in your browser to view the GraphiQL UI to execute queries.

## Prisma

### Create Migration After Schem Changes

`npx prisma migrate dev --name SomeDescription`
