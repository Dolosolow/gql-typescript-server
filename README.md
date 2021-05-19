# TS GraphQL Server

A GraphQL Server boilerplate

## Prerequisites

- :warning:  Server uses Typeorm w/ Postgres so please make sure to have [postgres](https://www.postgresql.org/download/) installed.

- :warning:  Server also uses [Redis](https://redis.io/download) so please make sure to have this installed.

## Stack<br /> 

- Apollo-server-express<br />
- GraphQL Code Generator for generating graphql schema types.<br />
- Jest<br />
- Redis<br />
- Typeorm w/ Postgres<br />
- Typescript<br />

## Installation

1. Clone git project
```
git clone https://github.com/Dolosolow/gql-typescript-server.git
```
2. CD to project
```
cd gql-typescript-server
```
3. Install dependencies
```
yarn install
```
4. Install and start Redis server, after installation run
```
redis-server
```
5. Start PostgreSQL server

6. Create a new database called `gql-typescript-server`
```
createdb gql-typescript-server
```

## Usage

Start the server with `yarn start` then to use GraphQL Playground navigate to `http://localhost:4000/graphql` .

## Features

* Register - Send confirmation email
* Login
* Forgot Password
* Logout  
* Cookies
* Authentication middleware
* Rate limiting
* Locking accounts
* Testing (probably Jest)
