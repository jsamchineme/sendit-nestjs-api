# SendIT
[![Build Status](https://travis-ci.org/jsamchineme/send-it.svg?branch=develop)](https://travis-ci.org/jsamchineme/send-it)
[![Coverage Status](https://coveralls.io/repos/github/jsamchineme/send-it/badge.svg?branch=develop)](https://coveralls.io/github/jsamchineme/send-it?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/fb9ed5da54bcd9bf509e/maintainability)](https://codeclimate.com/github/jsamchineme/send-it/maintainability)


## Description
SendIT is a courier service that helps users deliver parcels to different destinations. SendIT provides courier quotes based on weight categories.

## Original Repo
This project is a demonstration of how to use [nestjs](https://nestjs.com). 
Checkout the original repo [here](https://github.com/jsamchineme/send-it)



## Features
- Fetch all parcel delivery orders
- Create a parcel delivery order
- Fetch a specific parcel delivery order
- Fetch all parcel delivery orders by a specific user
- Cancel the specific parcel delivery order
- Change the status of a parcel delivery order
- Change the destination of a parcel delivery order
- Change the present location of a parcel delivery order
- User Signup
- User Login


## Getting Started
### Installation
- run npm install
- You can test routes with POSTMAN
- Here is a collection of requests to test available end points on POSTMAN
https://www.pivotaltracker.com/file_attachments/93440857/download?inline=true
- The environment can also be loaded with the collection
https://www.pivotaltracker.com/file_attachments/93331262/download?inline=true
- After loading the `collection` and the `environment`, the POSTMAN `Collection Runner` can be used to run the requests automatically and generate test report
- run `npm run start` to start the server
- You can also run `npm run start:dev` to start the server in development mode 
- run `npm run test` to test the api


### API Endpoint Routes 
#### NOTE: All requests are prefixed with `api/v1`
<table>
<tr><th>HTTP VERB</th><th>ENDPOINT</th><th>TASK</th></tr>

<tr><td>GET</td> <td>parcels?token={adminToken}</td> <td> Fetch all parcel delivery orders</td></tr>

<tr><td>POST</td> <td>parcels?token={userToken}</td> <td> Create a parcel delivery order </td></tr>

<tr><td>GET</td> <td>parcels/:id?token={ownerAuthToken}</td> <td> Fetch a specific parcel delivery order</td></tr>

<tr><td>GET</td> <td>users/:id/parcels?{ownerAuthToken}</td> <td> Fetch all parcel delivery orders by a specific user </td></tr>

<tr><td>PUT</td> <td>parcels/:id/cancel?token={ownerAuthToken}</td> <td> Cancel the specific parcel delivery order</td></tr> 

<tr><td>PUT</td> <td>parcels/:id/status?{adminAuthToken}</td> <td> Change the status of a parcel delivery order</td></tr>

<tr><td>PUT</td> <td>parcels/:id/destination?token={ownerAuthToken}</td> <td>Change the destination of a parcel delivery order</td></tr>

<tr><td>PUT</td> <td>parcels/:id/presentLocation?token={ownerAuthToken}</td> <td>Change the present location of a parcel delivery order</td></tr>

<tr><td>POST</td> <td>auth/signup</td> <td> User Signup </td></tr>

<tr><td>POST</td> <td>auth/login</td> <td> User Login </td></tr>

<tr><td>GET</td> <td>users/:id</td> <td> Get User profile </td></tr>

<tr><td>POST</td> <td>auth/reset</td> <td> Request Password Reset </td></tr>

<tr><td>PUT</td> <td>auth/reset</td> <td> Change User password </td></tr>

</table>

## Author
**Samuel Osuh** 
