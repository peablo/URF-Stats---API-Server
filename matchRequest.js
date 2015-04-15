var querystring = require('querystring'),
    https = require('https'),
    bl = require('bl');


function matchRequest (gameId, region, callback){
    
    var host = 'https://' + region + '.api.pvp.net';
    var path = '/api/lol/' + region + '/v2.2/match/';
    var qs = { api_key: 'api_key' }
    
    https.get( host + path + gameId + '?' + querystring.stringify(qs) , function(res) {
          
          res.pipe(bl(function (err, data) {
              
            if (err)
              return callback(err) // bl error
              
            
            if(res.statusCode == 200) // OK
            {
                data = data.toString()
            
                // full match info object
                var match = JSON.parse(data); 
              
                // data return
                return callback (null, match); 
            }
            
            if( res.statusCode == 429 ) // rate limit reached
            {
                setTimeout(function(){
                    return matchRequest (gameId, region, callback);
                }, 10000);
                    
            }else{ // all other errors
                return callback(res.statusCode)
            }
            
            
          }))

      }).on('error', function(e) { // connection error
          return callback(e); 
      });
    
}

module.exports = matchRequest;