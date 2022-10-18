# Mushroom Classification

Mushroom Classification

## Development setup

This section will guide you on how to setup your development environment.

This project was built using:

- Serverless Framework
- AWS

## Requirement

### NodeJS

Our project needs [NodeJS](https://nodejs.org/en/) v16 to work, it's an essential requirement, including the `NPM`.

### AWS Account (for deployment only)

xxx

## Installation

Inside the project folder you can run the command.

```bash
npm ci
```
After that all dependencies configured in `package.json` and `package-lock.json` will be installed locally in `node_modules`.

We recommend using `npm ci` instead of `npm install` to ensure the same versions of all project dependencies are installed, to learn more access the [NPM Docs](https://docs.npmjs.com/cli/v8/commands/npm-ci).

## Configuration

Run the code below to make a copy of `sample.env` to `.env`.

```bash
cp sample.env .env
```
After the copy you need to update the `.env` with with your preferred settings.

## Deploy (AWS account required*)

```bash
npm run deploy
```
