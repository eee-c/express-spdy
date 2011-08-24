var vows = require('vows'),
    assert = require('assert'),
    express = require('..'),
    spdy = require('spdy'),
    fs = require('fs'),
    tls = require('tls');

// Common options

var PORT = 23432;

var options = {
  key: fs.readFileSync(__dirname + '/../node_modules/spdy/keys/spdy-key.pem'),
  cert: fs.readFileSync(__dirname + '/../node_modules/spdy/keys/spdy-cert.pem'),
  ca: fs.readFileSync(__dirname + '/../node_modules/spdy/keys/spdy-csr.pem'),
  npnProtocols: ['spdy/2'],
  debug: true
};

// Globals to pass information between batches

var connection,
    spdy_request;

vows.describe('Express SPDY response').
addBatch({
  '[setup]': {
    'establish a simple SSL express server': function() {
      var server = express.createServer(options);

      server.get('/', function(req, res){
        res.send('wahoo');
      });

      server.listen(PORT);
      return true;
    }
  }
}).
addBatch({
  '[setup]': {
    'open an SSL connection to the server': function() {
      connection = tls.connect(PORT, 'localhost', options, function() {});
    },
    'craft a simple SPDY request': function() {
      spdy_request = spdy.createControlFrame(
        spdy.createZLib(),
        { type: spdy.enums.SYN_STREAM, streamID: 1, flags: 0 },
        { version: 'HTTP/1.1', url: '/', method: 'GET' }
      );
    }
  }
}).
addBatch({
  'Sending the request': {
    topic: function () {
      var callback = this.callback;

      var parser = spdy.createParser(spdy.createZLib());
      connection.pipe(parser);

      parser.on('cframe', function(cframe) {
        if (cframe.headers.type == spdy.enums.SYN_REPLY) {
          callback(null, cframe);
        }
      });

      connection.write(spdy_request, function(){});
    },
    'should get a response with no Keep-Alive': function(cframe) {
      assert.notEqual(cframe, undefined);
      assert.notEqual(cframe.data, undefined);
      assert.notEqual(cframe.data.nameValues, undefined);
      assert.equal(cframe.data.nameValues['connection'], undefined);
    }
  }
}).
export(module);
