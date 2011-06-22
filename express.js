var express = require('express')
  , expressCreateServer = express.createServer
  , SPDYServer = require('./spdy');

var exports = module.exports = express;

exports.createServer = function(options){
  if ('object' == typeof options) {
    return new SPDYServer(options, Array.prototype.slice.call(arguments, 1));
  } else {
    return expressCreateServer(Array.prototype.slice.call(arguments));
  }
};

exports.SPDYServer = SPDYServer;

var http = require('http')
  , res = http.ServerResponse.prototype
  , spdy = require('spdy')
  , spdy_res = spdy.Response.prototype;

// TODO: other methods?
spdy_res.send = res.send;
spdy_res.header = res.header;
spdy_res.contentType = res.contentType;
