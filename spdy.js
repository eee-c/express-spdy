
/*!
 * Express - SPDYServer
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var connect = require('connect-spdy')
  , HTTPServer = require('./http')
  , spdy = require('spdy')
  , spdy_res = spdy.Response.prototype
  , http = require('http')
  , res = http.ServerResponse.prototype;

/**
 * Expose `SPDYServer`.
 */

exports = module.exports = SPDYServer;

/**
 * Server proto.
 */

var app = SPDYServer.prototype;

/**
 * Initialize a new `SPDYServer` with the
 * given `options`, and optional `middleware`.
 *
 * @param {Object} options
 * @param {Array} middleware
 * @api public
 */

function SPDYServer(options, middleware){
  connect.SPDYServer.call(this, options, []);
  this.init(middleware);
};

/**
 * Inherit from `connect.SPDYServer`.
 */

app.__proto__ = connect.SPDYServer.prototype;

// mixin HTTPServer methods

Object.keys(HTTPServer.prototype).forEach(function(method){
  app[method] = HTTPServer.prototype[method];
});

// TODO: don't hard-code which methods get mixed-in
spdy_res.partial = res.partial;
spdy_res.render = res.render;
spdy_res._render = res._render;

// TODO: mixin
// spdy_res.send = res.send;
// spdy_res.header = res.header;
// spdy_res.contentType = res.contentType;
// ...
