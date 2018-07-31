# GIFcentration (Server)

[![dependencies Status](https://david-dm.org/mstop4/gifcentration-server/status.svg)](https://david-dm.org/mstop4/gifcentration-server)
[![devDependencies Status](https://david-dm.org/mstop4/gifcentration-sever/dev-status.svg)](https://david-dm.org/mstop4/gifcentration-server?type=dev)

Concentration (pairs-matching) game powered by Giphy.

![Screenshot](https://github.com/mstop4/gifcentration-client/blob/master/docs/demo.gif)

The **server** is a backend application that queries the Giphy API for GIFs and digests the information of 10 randomly-chosen GIFs for use by the [client app](https://github.com/mstop4/gifcentration-client).

## Demo
https://mstop4.github.io/gifcentration-client/

## Stack

* MongoDB / Mongoose
* Express.js
* React
* Node v8.11.1
* Giphy JS SDK
* Redis
* Chance.js
