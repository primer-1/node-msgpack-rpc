var rpc = require('msgpack-rpc');

var handler = {
  'n' : 0,
  'echo' : function(data, response) {
    response.result(data);
  },
  'hello' : function(data) {
    this.n += 1;
    if(this.n % 100000 == 0) {
      console.log(this.n)
    }
  }
}

var s = rpc.createServer();
s.setHandler(handler);
s.listen("/tmp/node.msgpack.rpc.sock", function () {

  var c = rpc.createClient("/tmp/node.msgpack.rpc.sock", function () {
    var count = 0;
    var MAX_COUNT = 10000
    var start = Date.now()
    for(var i = 0;i < MAX_COUNT;i++) {
      c.invoke("echo", "hello world", function (err, response) {
        count++
        if (count == MAX_COUNT) {
          var end = Date.now()
          console.log('time [ms]: ' + (end - start))
          console.log('calls/s: ' + MAX_COUNT / (end - start) * 1000)
          s.close()
          c.close()
        }
      });
    }
  });
});
