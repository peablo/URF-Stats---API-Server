var express = require('express'),
    mongoHelper = require('../mongoHelper.js');

var router = express.Router();


router.all('/mapReduceAllStats', function(request, response){
    
    var query = request.query;
    
    mongoHelper.mapReduceAllStats(
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceAllResults', function(request, response){
    
    var query = request.query;
    
    mongoHelper.mapReduceAllResults(
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsByChampion', function(request, response){
    
    var query = request.query;
    
    if(!query.champId)
        return response.end("Invalid champion ID");
    
    mongoHelper.mapReduceResultsByChampion(query.champId,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsByWinrate', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsByWinrate(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsByPickrate', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsByPickrate(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopPickrate', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopPickrate(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsWorstPickrate', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsWorstPickrate(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopFirstPickrate', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopFirstPickrate(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopWinrate', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopWinrate(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsWorstWinrate', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsWorstWinrate(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopKills', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopKills(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopGold', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopGold(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopAssists', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopAssists(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopKillingSprees', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopKillingSprees(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopMinionsKilled', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopMinionsKilled(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopPentaKills', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopPentaKills(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopDamage', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopDamage(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopHeal', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopHeal(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopCrowdControl', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopCrowdControl(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopTowerKills', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopTowerKills(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopUnrealKills', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopUnrealKills(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopFirstBlood', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopFirstBlood(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopFighters', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopFighters(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopTanks', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopTanks(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopSupports', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopSupports(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopAssasins', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopAssasins(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopMages', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopMages(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );

router.get('/getMapReduceResultsTopMarksmen', function(request, response){
    
    var query = request.query;
    
    if(!query.day)
        return response.end("Invalid day");
    
    mongoHelper.mapReduceResultsTopMarksmen(query.day,
                        function (err, data) {
        
                            if(err)
                                return console.error('There was an error:', err);
        
                            response.json(data);

                        });
    
    
} );


module.exports = router;