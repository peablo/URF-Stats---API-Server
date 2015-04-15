var express = require('express'),
    matchRequest = require('../matchRequest.js'),
    mongoHelper = require('../mongoHelper.js');

var router = express.Router();



router.all('/', function(request, response){
  
  var ids = JSON.parse(request.query.ids);
  var region = request.query.region;
    
  // ending response before the insertion
  response.end();
  
  var i = 0;
  var interval = setInterval( function(){
      
    var id = ids[i];
      
    matchRequest( id, region, function(err, data) {
        
        if(err)
            return console.error('There was an error:', err)
        
        if( data.queueType != "URF_5x5" )
            return console.log('Not an URF game!')
        
        mongoHelper.save(data, function (err, data) {
            if(err)
                return console.error('There was an error:', err)
        });
              
        
    } );
      
    i++;
    
    if(i >= ids.length){
        clearInterval(interval);
        console.log("All games loaded");
    }
      
  } , 1200 );
   
 
    
} );

module.exports = router;