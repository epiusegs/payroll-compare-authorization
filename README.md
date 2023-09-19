# payroll-compare-authorization

# AWS CLI Configuration

Make sure you have an AWS profile created with the name `eugs-implementation-tools`. To do this, you can run `aws configure --profile eugs-implementation-tools`.

# Upload Docker image to AWS ECR

## Manual

1. Retrieve auth token
   `aws ecr get-login-password --region us-east-2 --profile eugs-implementation-tools | docker login --username AWS --password-stdin 456217261092.dkr.ecr.us-east-2.amazonaws.com`
2. Build Docker
   `docker buildx build --platform=linux/amd64 -t payroll-compare-authorization .`
3. Tag Docker image as latest
   `docker tag payroll-compare-authorization:latest 456217261092.dkr.ecr.us-east-2.amazonaws.com/payroll-compare-authorization:latest`
4. Upload to AWS ECR
   `docker push 456217261092.dkr.ecr.us-east-2.amazonaws.com/payroll-compare-authorization:latest`

## Semi-Automated

Run the local script like this:
`./deploy.sh eugs-implementation-tools us-east-2`

# Publish New Node Version to Public ECR

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

# GraphQL

You can visit /graphql in your browser to view the GraphiQL UI to execute queries.

# Prisma

## Create Migration After Schem Changes

`npx prisma migrate dev --name SomeDescription`
