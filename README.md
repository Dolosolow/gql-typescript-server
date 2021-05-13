# A Graphql Server

Server built with Typeorm w/ Postgres, Apollo-server-express, Typescript, Redis, Yup for form validation and GraphQL Code Generator for generating types for the graphql schema.

Prerequisites:

1. Server uses Typeorm with Postgres so if your running this on your local machine make sure to have [postgres](https://www.postgresql.org/download/) installed and running.

2. Server also uses [Redis](https://redis.io/download) so please make sure to have this installed and running aswell.

Steps to run this project:

1. Run `yarn install` command
2. Start your redis server and postgres DB.
3. Run `yarn test` command and make sure the tests are passing.
