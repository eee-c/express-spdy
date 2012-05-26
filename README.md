express-spdy
============

*WARNING: this is very, very alpha stuff.*

[SPDY](http://www.chromium.org/spdy) is a new protocol from Google based on HTTP.  It aims for 50% decrease in page load times over vanilla HTTP.

Currently, Google Chrome is the only browser that supports SPDY in general release. Firefox has SPDY support in its nightlies.

The express-spdy package aims to allow existing express.js sites to experiment with SPDY without making (many) changes.


INSTALLATION
------------

Install the latest snapshot of openssl with NPN and shared objects.  Currently, this requires obtaining a SNAP tarball from the openssl FTP server or checking out the latest trunk from the openssl CVS server.

Install node.js 0.6.0 or later.

With the npn-enabled node, `npm install express-spdy`.

Detailed instructions in [INSTALL.md](https://github.com/eee-c/express-spdy/blob/master/INSTALL.md).

CONFIGURATION
-------------

An express.js app can then be SPDY-ized by changing the first few lines to:

    var express = require('express-spdy')
      , fs = require('fs');

    var app = module.exports = express.createServer({
      key: fs.readFileSync(__dirname + '/keys/spdy-key.pem'),
      cert: fs.readFileSync(__dirname + '/keys/spdy-cert.pem'),
      ca: fs.readFileSync(__dirname + '/keys/spdy-csr.pem'),
      NPNProtocols: ['spdy/2']
    });

Detailed instructions in [INSTALL.md](https://github.com/eee-c/express-spdy/blob/master/INSTALL.md).


TODO
----

* Tests
* Server push
* Documentation (of course)


THANKS
------

_Huge_ thanks to [Fedor Indutny](https://github.com/indutny) for his awesome [node-spdy](https://github.com/indutny/node-spdy).  Very little was required to get express-spdy working thanks to his hard work.
