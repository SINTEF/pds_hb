# Front-end for PDS data handbook

This repository includes the complete front-end for the PDS data handbook application. It includes all components and pages used in the application, in addition to the app.tsx file which combines the pages with routing. This README will act as a guide for how to install the front-end and how to run both the application and the tests.

## Installation

### Clone repository

Note: Make sure to have [git](https://git-scm.com/). This can be verified by typing ```git --version``` in your terminal.

Clone the repository by your method of choice. To clone with HTTPS, open your terminal and navigate to the directory in which you want to clone the project. Type:
```
git clone https://github.com/SINTEF/pds_hb.git
```

### Install dependencies

Note: Make sure to have [node](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/) installed. This can be verified by typing ```npm --version``` or ```yarn -v ```in your terminal.

In your terminal, navigate to the root directory of the repository you just cloned and run:
```
yarn
```

## Usage

Note: Before running the application, remember to have the [back-end](https://github.com/SINTEF/pds_hb_be/edit/dev/README.md) running locally on the same device. 

### Running the server

To run the front-end of the PDS data handbook, navigate to the root folder and run:
```
yarn start
```

### Running the tests

To run the tests for the front-end, navigate to the root folder and run:
```
yarn test
```

### Running the Cypress E2E-tests
To run the Cypress tests, please ensure that both the front-end and back-end is running in their own terminals. Then, in a fresh terminal, in the root foler, run:
```
yarn run cypress open
```
