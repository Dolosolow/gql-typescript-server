# TS GraphQL Server

Built with<br />
&emsp;Typeorm w/ Postgres<br />
&emsp;Apollo-server-express<br />
&emsp;Typescript<br />
&emsp;Redis<br />
&emsp;Yup for form validation<br />
&emsp;GraphQL Code Generator for generating types for the graphql schema.<br />

## Prerequisites:

1. Server uses Typeorm with Postgres so if your running this on your local machine make sure to have [postgres](https://www.postgresql.org/download/) installed and running.

2. Server also uses [Redis](https://redis.io/download) so please make sure to have this installed and running aswell.

## Steps to run this project:

1. Run `yarn install` command
2. Start your redis server and postgres DB.
3. Run `yarn test` command and make sure the tests are passing.
4. Run `yarn start` commnad and if loggings from typeorm are visible everything is good.
