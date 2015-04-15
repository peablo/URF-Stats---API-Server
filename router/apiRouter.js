var express = require('express'),
    mongoHelper = require('../mongoHelper.js');

var router = express.Router();



router.get('/getGames', function(request, response){
    
    var query = request.query;
    
    mongoHelper.getGames(query.from, 
                         query.to, 
                         function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getGamesCount', function(request, response){
    
    var query = request.query;
    
    mongoHelper.getGamesCount(query.from, 
                         query.to, 
                         function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getPickRate', function(request, response){
    
    var query = request.query;
    
    mongoHelper.pickRate(query.champId,
                         query.from, 
                         query.to,
                         function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getFirstPickRate', function(request, response){
    
    var query = request.query;
    
    mongoHelper.firstPickRate(query.champId,
                         query.from, 
                         query.to,
                         function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getBanRate', function(request, response){
    
    var query = request.query;
    
    mongoHelper.banRate(query.champId,
                        query.from, 
                        query.to,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getFirstBanRate', function(request, response){
    
    var query = request.query;
    
    mongoHelper.firstBanRate(query.champId,
                        query.from, 
                        query.to,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getWinRate', function(request, response){
    
    var query = request.query;
    
    mongoHelper.winRate(query.champId,
                        query.from, 
                        query.to,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getFirstBloodRate', function(request, response){
    
    var query = request.query;
    
    mongoHelper.firstBloodRate(query.champId,
                        query.from, 
                        query.to,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getFirstDragonRate', function(request, response){
    
    var query = request.query;
    
    mongoHelper.firstDragonRate(query.champId,
                        query.from, 
                        query.to,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getFirstInhibitorRate', function(request, response){
    
    var query = request.query;
    
    mongoHelper.firstInhibitorRate(query.champId,
                        query.from, 
                        query.to,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getFirstBaronRate', function(request, response){
    
    var query = request.query;
    
    mongoHelper.firstBaronRate(query.champId,
                        query.from, 
                        query.to,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getAverageStats', function(request, response){
    
    var query = request.query;
    
    mongoHelper.averageStats(query.champId,
                        query.from, 
                        query.to,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

module.exports = router;