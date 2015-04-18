var mongodb = require('mongodb');

var url = 'mongodb://urf:urf@ds061701.mongolab.com:61701/urfstatsdbv2';

var MongoClient = mongodb.MongoClient,
    database,
    matchesCollection,
    mapReduceResultsCollection;

MongoClient.connect(url, function (err, db) {
    
    if(!err)
        console.log("Connected to Mongolab");
    
    database = db;
    matchesCollection = database.collection('matches');
    mapReduceResultsCollection = database.collection('mapReduceResults');
    
})


var trim = function (matchinfo) { // trimming useless data
    
    matchinfo.participantIdentities = [];
    
    matchinfo.participants.forEach ( function (participant) {
        
        participant.runes = [];
        participant.masteries = [];
        participant.timeline = [];
        
    } );
    
}

var timeQuery = function (query, from, to) {
    
    if( from | to )
        query.matchCreation = {}
        
    if(from)
        query.matchCreation.$gte = Number(from);
    
    if(to)
        query.matchCreation.$lt = Number(to);
    
    return query;
    
}

var getRate = function (partialQuery, totalQuery, callback) {
    
    matchesCollection.count(totalQuery ,function (err, totalcount) {
        
        if (err)
            return callback (err);
        
        matchesCollection.count(partialQuery, function (err, partialcount) {
            
            if (err)
                return callback (err);
            
            var percentage = ( partialcount * 100 ) / totalcount;
            
            var result = {
                result: percentage
                
            }
            
            callback(null, result);
            
        });
        
    });
    
}

var gamesCountByDay = function (callback) {
    // returns an array of 1-13 days, 0 holds all
    
    function map(){
        
        var gameDay = Math.floor((this.matchCreation - 1427846400000) / 86400000) + 1; // day of april 2015 when the game was played
        
        emit("all", 1);
        
        emit(gameDay, 1);
        
        
    }
    
    function reduce(key, values){
        
        return Array.sum(values);
        
        
    }
    
    matchesCollection.mapReduce(map, reduce, {
        out: { inline: 1 }
                
    }, function (err, data){
                
                if(err)
                    return callback (err);
        
                //console.log(data);

                callback(null, data);
                
    });
    
    
}

var banRatesByChampion = function (callback) {
    
    function map() {
        
        var gameDay = Math.floor((this.matchCreation - 1427846400000) / 86400000) + 1; // day of april 2015 when the game was played
        
        
            var teams = this.teams;
        
        if(teams[0].bans){
            
            var test = teams[0].bans[0];
            
            if(test){
                var value ={
                        banned : 1,
                        firstBanned: ( ((test.pickTurn == 1) || (test.pickTurn == 2))? 1 : 0 )

                    }

                emit({championId: test.championId,
                          day: Number(gameDay)}, value);
                emit({championId: test.championId,
                          day: "all"}, value);
            }
            
            test = teams[0].bans[1];
            
            if(test){
                var value ={
                        banned : 1,
                        firstBanned: ( ((test.pickTurn == 1) || (test.pickTurn == 2))? 1 : 0 )

                    }

                emit({championId: test.championId,
                          day: Number(gameDay)}, value);
                emit({championId: test.championId,
                          day: "all"}, value);
            }
            
            test = teams[0].bans[2];
            
            if(test){
                var value ={
                        banned : 1,
                        firstBanned: ( ((test.pickTurn == 1) || (test.pickTurn == 2))? 1 : 0 )

                    }

                emit({championId: test.championId,
                          day: Number(gameDay)}, value);
                emit({championId: test.championId,
                          day: "all"}, value);
            }
            
        }
        
        if(teams[1].bans){
            
            var test = teams[1].bans[0];
        
            if(test){
                var value ={
                        banned : 1,
                        firstBanned: ( ((test.pickTurn == 1) || (test.pickTurn == 2))? 1 : 0 )

                    }

                emit({championId: test.championId,
                          day: Number(gameDay)}, value);
                emit({championId: test.championId,
                          day: "all"}, value);
            }
            
            test = teams[1].bans[1];
            
            if(test){
                var value ={
                        banned : 1,
                        firstBanned: ( ((test.pickTurn == 1) || (test.pickTurn == 2))? 1 : 0 )

                    }

                emit({championId: test.championId,
                          day: Number(gameDay)}, value);
                emit({championId: test.championId,
                          day: "all"}, value);
            }
            
            test = teams[1].bans[2];
            
            if(test){
                var value ={
                        banned : 1,
                        firstBanned: ( ((test.pickTurn == 1) || (test.pickTurn == 2))? 1 : 0 )

                    }

                emit({championId: test.championId,
                          day: Number(gameDay)}, value);
                emit({championId: test.championId,
                          day: "all"}, value);
            }
            
        }
        
        
        
        
        
        
        /*
            teams[0].bans.forEach(function (ban){
                
                var value ={
                    banned : 1,
                    firstBanned: ( ((ban.pickTurn == 1) || (ban.pickTurn == 2))? 1 : 0 )
                    
                }
                
                emit({championId: ban.championId,
                      day: Number(gameDay)}, value);
                emit({championId: ban.championId,
                      day: "all"}, value);
               
            });
        
            teams[1].bans.forEach(function (ban){
                
                var value ={
                    banned : 1,
                    firstBanned: ( ((ban.pickTurn == 1) || (ban.pickTurn == 2))? 1 : 0 )
                    
                }
                
                emit({championId: ban.championId,
                      day: Number(gameDay)}, value);
                emit({championId: ban.championId,
                      day: "all"}, value);
               
            });*/
            
        
        
    }
    
    function reduce(key, values) {
        
        var a = values[0];
        
        for(var i = 1 ; i<values.length ; i++){
            
            var b = values[i]; // will merge 'b' into 'a'
            
            a.banned += (b.banned? b.banned : 0);
            a.firstBanned += (b.firstBanned? b.firstBanned : 0);
            
            for (var attrname in b){
                
                if(attrname != "banned" && attrname != "firstBanned")
                    a[attrname] = b[attrname];
                
            }
            
        }
        
        return a;
        
    }
    
    matchesCollection.mapReduce(map, reduce, {
        out: { reduce: "mapReduceResults" }
                
    }, function (err, data){
                
        if(err)
            return callback (err);
        
        
        callback (null, "OK");
        
                
    });
    
    
}


exports.save = function (matchinfo, callback) {
    
    trim (matchinfo);
    
    matchesCollection.insert(matchinfo, function (err, result) {
        
        if(err)
            return callback(err);
        
    } )
    
}

exports.getGames = function (from, to, callback) {
    
    var query = timeQuery({}, from, to );
    
    matchesCollection.find( query ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.getGamesCount = function (from, to, callback) {
    
    var query = timeQuery({}, from, to );
    
    matchesCollection.count( query, function(err, data) {
        
        if (err)
            return callback (err);
        
        var result = {
                numGames: data
                
            }
        
        callback(null, result);
        
      });
    
}
    
    
exports.pickRate = function (champId, from, to, callback) {
    
    if(!champId)
        return callback("Undefined champId");
    
    var partialQuery = { 'participants.championId': Number(champId) }
    
    timeQuery (partialQuery, from, to );
        
    var totalQuery = timeQuery({}, from, to );
    
    getRate(partialQuery, totalQuery, function (err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
    
    
}

exports.firstPickRate = function (champId, from, to, callback) {
    
    if(!champId)
        return callback("Undefined champId");
    
    var partialQuery = { 
        $or:[
            { participants: { $elemMatch: { championId: Number(champId), participantId: 1 } } },
            { participants: { $elemMatch: { championId: Number(champId), participantId: 6 } } }
        ] 
    }
    
    timeQuery (partialQuery, from, to );
        
    var totalQuery = timeQuery({}, from, to );
    
    getRate(partialQuery, totalQuery, function (err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
    
    
}

exports.banRate = function (champId, from, to, callback) {
    
    if(!champId)
        return callback("Undefined champId");
    
    var partialQuery = { 'teams.bans.championId': Number(champId) }
    
    timeQuery(partialQuery, from, to);
    
    var totalQuery = timeQuery({}, from, to);
        
    
    getRate(partialQuery, totalQuery, function (err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
    
    
}

exports.firstBanRate = function (champId, from, to, callback) {
    
    if(!champId)
        return callback("Undefined champId");
    
    var partialQuery = { 
        $or:[
            { 'teams.bans': { $elemMatch: { championId: Number(champId), pickTurn: 1 } } },
            { 'teams.bans': { $elemMatch: { championId: Number(champId), pickTurn: 2 } } }
        ] 
    }
    
    timeQuery(partialQuery, from, to);
    
    var totalQuery = timeQuery({}, from, to);
    
    getRate(partialQuery, totalQuery, function (err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
    
    
}

exports.winRate = function (champId, from, to, callback) {
    
    if(!champId)
        return callback("Undefined champId");
    
    var partialQuery = { $and: [
            {  participants: { $elemMatch: { championId: Number(champId), 'stats.winner': true } } },
            { $or:[ // this expression filters mirror matches out
                { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 100 } } } },
                { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 200 } } } }
            ] } ]
    } 
    
    timeQuery(partialQuery, from, to);
    
    var totalQuery = { $and: [ 
                { 'participants.championId': Number(champId) },  
                { $or:[ // this expression filters mirror matches out
                    { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 100 } } } },
                    { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 200 } } } }
                ] } ]
        }
    
    timeQuery(totalQuery, from, to);
        
    getRate(partialQuery, totalQuery, function (err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
    
    
    
}

exports.firstBloodRate = function (champId, from, to, callback) {
    
    if(!champId)
        return callback("Undefined champId");
    
    var partialQuery = { participants: { $elemMatch: { championId: Number(champId), 'stats.firstBloodKill': true } } }
    
    timeQuery(partialQuery, from, to);
        
    var totalQuery = { 'participants.championId': Number(champId) }
    
    timeQuery(totalQuery, from, to);
        
    getRate(partialQuery, totalQuery, function (err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
    
    
    
}

exports.firstDragonRate = function (champId, from, to, callback) {
    
    if(!champId)
        return callback("Undefined champId");
    
    var partialQuery = { $and: [
        { $or: [
            { $and: [
                { participants: { $elemMatch: { championId: Number(champId), teamId: 100 } } },
                { teams: { $elemMatch: { teamId: 100, firstDragon: true } } }
            ] },
            { $and: [
                { participants: { $elemMatch: { championId: Number(champId), teamId: 200 } } },
                { teams: { $elemMatch: { teamId: 200, firstDragon: true } } }
            ] }
        ] },
        { $or:[ // this expression filters mirror matches out
            { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 100 } } } },
            { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 200 } } } }
        ] }
        
    ] }
    
    timeQuery(partialQuery, from, to);
    
    var totalQuery = { $and: [ 
                { 'participants.championId': Number(champId) },  
                { $or:[ // this expression filters mirror matches out
                    { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 100 } } } },
                    { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 200 } } } }
                ] } ]
        }
    
    timeQuery(totalQuery, from, to);
        
    getRate(partialQuery, totalQuery, function (err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
    
}

exports.firstBaronRate = function (champId, from, to, callback) {
    
    if(!champId)
        return callback("Undefined champId");
    
    var partialQuery = { $and: [
        { $or: [
            { $and: [
                { participants: { $elemMatch: { championId: Number(champId), teamId: 100 } } },
                { teams: { $elemMatch: { teamId: 100, firstBaron: true } } }
            ] },
            { $and: [
                { participants: { $elemMatch: { championId: Number(champId), teamId: 200 } } },
                { teams: { $elemMatch: { teamId: 200, firstBaron: true } } }
            ] }
        ] },
        { $or:[ // this expression filters mirror matches out
            { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 100 } } } },
            { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 200 } } } }
        ] }
        
    ] }
    
    timeQuery(partialQuery, from, to);
    
    var totalQuery = { $and: [ 
                { 'participants.championId': Number(champId) },  
                { $or:[ // this expression filters mirror matches out
                    { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 100 } } } },
                    { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 200 } } } }
                ] } ]
        }
    
    timeQuery(totalQuery, from, to);
        
    getRate(partialQuery, totalQuery, function (err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
    
}

exports.firstInhibitorRate = function (champId, from, to, callback) {
    
    if(!champId)
        return callback("Undefined champId");
    
    var partialQuery = { $and: [
        { $or: [
            { $and: [
                { participants: { $elemMatch: { championId: Number(champId), teamId: 100 } } },
                { teams: { $elemMatch: { teamId: 100, firstInhibitor: true } } }
            ] },
            { $and: [
                { participants: { $elemMatch: { championId: Number(champId), teamId: 200 } } },
                { teams: { $elemMatch: { teamId: 200, firstInhibitor: true } } }
            ] }
        ] },
        { $or:[ // this expression filters mirror matches out
            { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 100 } } } },
            { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 200 } } } }
        ] }
        
    ] }
    
    timeQuery(partialQuery, from, to);
    
    var totalQuery = { $and: [ 
                { 'participants.championId': Number(champId) },  
                { $or:[ // this expression filters mirror matches out
                    { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 100 } } } },
                    { participants: { $not: { $elemMatch: { championId: Number(champId), teamId: 200 } } } }
                ] } ]
        }
    
    timeQuery(totalQuery, from, to);
        
    getRate(partialQuery, totalQuery, function (err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
    
}

exports.averageStats = function (champId, from, to, callback) {
    
    var initialQuery = champId? { 'participants.championId': Number(champId) } : {};
    
    timeQuery (initialQuery, from, to );
    
    var champIdQuery = champId? { 'participants.championId': Number(champId) } : {};
    
    
    
    matchesCollection.aggregate([
        
        { $match: initialQuery },
        { $unwind : "$participants" },
        { $match: champIdQuery },
        { $unwind: "$teams" },
        { $match: { $or: [
            { 
                'participants.teamId': 100,
                'teams.teamId': 100
            },
            {
                'participants.teamId': 200,
                'teams.teamId': 200
            }
        ] } },
        { $group: { _id: "$participants.championId",
                    assists: { $avg: "$participants.stats.assists"},
                    champLevel: { $avg: "$participants.stats.champLevel"},
                    deaths: { $avg: "$participants.stats.deaths"},
                    doubleKills: { $avg: "$participants.stats.doubleKills"},
                    goldEarned: { $avg: "$participants.stats.goldEarned"},
                    goldSpent: { $avg: "$participants.stats.goldSpent"},
                    inhibitorKills: { $avg: "$participants.stats.inhibitorKills"},
                    killingSprees: { $avg: "$participants.stats.killingSprees"},
                    kills: { $avg: "$participants.stats.kills"},
                    largestCriticalStrike: { $avg: "$participants.stats.largestCriticalStrike"},
                    largestKillingSpree: { $avg: "$participants.stats.largestKillingSpree"},
                    largestMultiKill: { $avg: "$participants.stats.largestMultiKill"},
                    magicDamageDealt: { $avg: "$participants.stats.magicDamageDealt"},
                    magicDamageDealtToChampions: { $avg: "$participants.stats.magicDamageDealtToChampions"},
                    magicDamageTaken: { $avg: "$participants.stats.magicDamageTaken"},
                    minionsKilled: { $avg: "$participants.stats.minionsKilled"},
                    neutralMinionsKilled: { $avg: "$participants.stats.neutralMinionsKilled"},
                    neutralMinionsKilledEnemyJungle: { $avg: "$participants.stats.neutralMinionsKilledEnemyJungle"},
                    neutralMinionsKilledTeamJungle: { $avg: "$participants.stats.neutralMinionsKilledTeamJungle"},
                    pentaKills: { $avg: "$participants.stats.pentaKills"},
                    physicalDamageDealt: { $avg: "$participants.stats.physicalDamageDealt"},
                    physicalDamageDealtToChampions: { $avg: "$participants.stats.physicalDamageDealtToChampions"},
                    physicalDamageTaken: { $avg: "$participants.stats.physicalDamageTaken"},
                    quadraKills: { $avg: "$participants.stats.quadraKills"},
                    sightWardsBoughtInGame: { $avg: "$participants.stats.sightWardsBoughtInGame"},
                    teamBaronKills: { $avg: "$teams.baronKills" },
                    teamDragonKills: { $avg: "$teams.dragonKills" },
                    totalDamageDealt: { $avg: "$participants.stats.totalDamageDealt"},
                    totalDamageDealtToChampions: { $avg: "$participants.stats.totalDamageDealtToChampions"},
                    totalDamageTaken: { $avg: "$participants.stats.totalDamageTaken"},
                    totalHeal: { $avg: "$participants.stats.totalHeal"},
                    totalTimeCrowdControlDealt: { $avg: "$participants.stats.totalTimeCrowdControlDealt"},
                    totalUnitsHealed: { $avg: "$participants.stats.totalUnitsHealed"},
                    towerKills: { $avg: "$participants.stats.towerKills"},
                    tripleKills: { $avg: "$participants.stats.tripleKills"},
                    trueDamageDealt: { $avg: "$participants.stats.trueDamageDealt"},
                    trueDamageDealtToChampions: { $avg: "$participants.stats.trueDamageDealtToChampions"},
                    trueDamageTaken: { $avg: "$participants.stats.trueDamageTaken"},
                    unrealKills: { $avg: "$participants.stats.unrealKills"},
                    visionWardsBoughtInGame: { $avg: "$participants.stats.visionWardsBoughtInGame"},
                    wardsKilled: { $avg: "$participants.stats.wardsKilled"},
                    wardsPlaced: { $avg: "$participants.stats.wardsPlaced"}
                   
                  } 
        }
        
    ], function(err, data) {
        
        if(err)
            return callback (err);
        
        callback(null, data);
        
    });
    
}




exports.mapReduceAllStats = function (callback) {
    
            console.log("starting");
    
            //MAPREDUCE ARGUMENTS AND FUNCTIONS
            
            var checkMirror = function (championId, list) {

                var count = 0;

                list.forEach( function (player) {

                    if ( Number(player.championId) == Number(championId) )
                        count++;

                } );

                if (count >= 2)
                    return true;

                return false;

            }
            
            function map() {
                
                var blueteam = this.teams[0];
                
                var redteam = this.teams[1];
                
                var allparticipants = this.participants;
                
                var gameDay = Math.floor((this.matchCreation - 1427846400000) / 86400000) + 1; // day of april 2015 when the game was played

                allparticipants.forEach (function (participant) {
                    var team = (Number(participant.teamId) == 100) ? blueteam : redteam;
                    
                    //variable for whether this champion in particular is in both teams
                    var mirror = checkMirror(participant.championId, allparticipants);
                    
                    //we dont want it to count as 2 games when the champion is picked by both teams, so red team's pick doesnt count
                    var pickedCounts = ( !mirror || Number(participant.teamId) == 100 );
                        
                    //we dont want it to count as 2 games when the champion is first picked by both teams, so red team's first pick doesnt count
                    var firstPickedCounts = ( !mirror || (Number(participant.teamId) == 100) || (allparticipants[0].championId != participant.championId) );
                    
                    var statsToEmit = { // ban and firstBan rates will be added later
                        
                        count: 1, // notice this counts the number of times this champion is played, not games he's in
                        countNoMirror: (mirror? 0 : 1), // number of games the champion is in one team only (for win and first dragon/baron/inhib rates)
                        picked: (pickedCounts? 1 : 0),
                        firstPicked: ( firstPickedCounts && (( Number(participant.participantId) == 1) || ( Number(participant.participantId) == 6)) ? 1 : 0 ),
                        won: ( mirror? 0 : (participant.stats.winner? 1 : 0) ),
                        firstBlood: (participant.stats.firstBloodKill? 1 : 0),
                        firstDragon: ( mirror? 0 : (team.firstDragon? 1 : 0)),
                        firstBaron: ( mirror? 0 : (team.firstBaron? 1 : 0)),
                        firstInhibitor: ( mirror? 0 : (team.firstInhibitor? 1 : 0)),
                        assists: Number(participant.stats.assists),
                        champLevel: Number(participant.stats.champLevel),
                        deaths: Number(participant.stats.deaths),
                        doubleKills: Number(participant.stats.doubleKills),
                        goldEarned: Number(participant.stats.goldEarned),
                        goldSpent: Number(participant.stats.goldSpent),
                        inhibitorKills: Number(participant.stats.inhibitorKills),
                        killingSprees: Number(participant.stats.killingSprees),
                        kills: Number(participant.stats.kills),
                        largestCriticalStrike: Number(participant.stats.largestCriticalStrike),
                        largestKillingSpree: Number(participant.stats.largestKillingSpree),
                        largestMultiKill: Number(participant.stats.largestMultiKill),
                        magicDamageDealt: Number(participant.stats.magicDamageDealt),
                        magicDamageDealtToChampions: Number(participant.stats.magicDamageDealtToChampions),
                        magicDamageTaken: Number(participant.stats.magicDamageTaken),
                        minionsKilled: Number(participant.stats.minionsKilled),
                        neutralMinionsKilled: Number(participant.stats.neutralMinionsKilled),
                        neutralMinionsKilledEnemyJungle: Number(participant.stats.neutralMinionsKilledEnemyJungle),
                        neutralMinionsKilledTeamJungle: Number(participant.stats.neutralMinionsKilledTeamJungle),
                        pentaKills: Number(participant.stats.pentaKills),
                        physicalDamageDealt: Number(participant.stats.physicalDamageDealt),
                        physicalDamageDealtToChampions: Number(participant.stats.physicalDamageDealtToChampions),
                        physicalDamageTaken: Number(participant.stats.physicalDamageTaken),
                        quadraKills: Number(participant.stats.quadraKills),
                        sightWardsBoughtInGame: Number(participant.stats.sightWardsBoughtInGame),
                        teamBaronKills: Number(team.baronKills),
                        teamDragonKills: Number(team.dragonKills),
                        totalDamageDealt: Number(participant.stats.totalDamageDealt),
                        totalDamageDealtToChampions: Number(participant.stats.totalDamageDealtToChampions),
                        totalDamageTaken: Number(participant.stats.totalDamageTaken),
                        totalHeal: Number(participant.stats.totalHeal),
                        totalTimeCrowdControlDealt: Number(participant.stats.totalTimeCrowdControlDealt),
                        totalUnitsHealed: Number(participant.stats.totalUnitsHealed),
                        towerKills: Number(participant.stats.towerKills),
                        tripleKills: Number(participant.stats.tripleKills),
                        trueDamageDealt: Number(participant.stats.trueDamageDealt),
                        trueDamageDealtToChampions: Number(participant.stats.trueDamageDealtToChampions),
                        trueDamageTaken: Number(participant.stats.trueDamageTaken),
                        unrealKills: Number(participant.stats.unrealKills),
                        visionWardsBoughtInGame: Number(participant.stats.visionWardsBoughtInGame),
                        wardsKilled: Number(participant.stats.wardsKilled),
                        wardsPlaced: Number(participant.stats.wardsPlaced)
                        
                        
                    };

                    emit({ championId: participant.championId,
                           day: Number(gameDay)
                         }, statsToEmit);
                    
                    emit({ championId: participant.championId,
                           day: "all"
                         }, statsToEmit);

                });
            
            }
            
            function reduce(key, values) {
                
                var a = values[0];
                
                for (var i=1/*!*/; i < values.length; i++){
                    
                    var b = values[i]; // will merge 'b' into 'a'
                    
                    a.count += b.count;
                    a.countNoMirror += b.countNoMirror;
                    a.picked += b.picked;
                    a.firstPicked += b.firstPicked;
                    a.won += b.won;
                    a.firstBlood += b.firstBlood;
                    a.firstDragon += b.firstDragon;
                    a.firstBaron += b.firstBaron;
                    a.firstInhibitor += b.firstInhibitor;
                    a.assists += b.assists;
                    a.champLevel += b.champLevel;
                    a.deaths += b.deaths;
                    a.doubleKills += b.doubleKills;
                    a.goldEarned += b.goldEarned;
                    a.goldSpent += b.goldSpent;
                    a.inhibitorKills += b.inhibitorKills;
                    a.killingSprees += b.killingSprees;
                    a.kills += b.kills;
                    a.largestCriticalStrike += b.largestCriticalStrike;
                    a.largestKillingSpree += b.largestKillingSpree;
                    a.largestMultiKill += b.largestMultiKill;
                    a.magicDamageDealt += b.magicDamageDealt;
                    a.magicDamageDealtToChampions += b.magicDamageDealtToChampions,
                    a.magicDamageTaken += b.magicDamageTaken;
                    a.minionsKilled += b.minionsKilled;
                    a.neutralMinionsKilled += b.neutralMinionsKilled;
                    a.neutralMinionsKilledEnemyJungle += b.neutralMinionsKilledEnemyJungle;
                    a.neutralMinionsKilledTeamJungle += b.neutralMinionsKilledTeamJungle;
                    a.pentaKills += b.pentaKills;
                    a.physicalDamageDealt += b.physicalDamageDealt;
                    a.physicalDamageDealtToChampions += b.physicalDamageDealtToChampions;
                    a.physicalDamageTaken += b.physicalDamageTaken;
                    a.quadraKills += b.quadraKills;
                    a.sightWardsBoughtInGame += b.sightWardsBoughtInGame;
                    a.teamBaronKills += b.teamBaronKills;
                    a.teamDragonKills += b.teamDragonKills;
                    a.totalDamageDealt += b.totalDamageDealt;
                    a.totalDamageDealtToChampions += b.totalDamageDealtToChampions;
                    a.totalDamageTaken += b.totalDamageTaken;
                    a.totalHeal += b.totalHeal;
                    a.totalTimeCrowdControlDealt += b.totalTimeCrowdControlDealt;
                    a.totalUnitsHealed += b.totalUnitsHealed;
                    a.towerKills += b.towerKills;
                    a.tripleKills += b.tripleKills;
                    a.trueDamageDealt += b.trueDamageDealt;
                    a.trueDamageDealtToChampions += b.trueDamageDealtToChampions;
                    a.trueDamageTaken += b.trueDamageTaken;
                    a.unrealKills += b.unrealKills;
                    a.visionWardsBoughtInGame += b.visionWardsBoughtInGame;
                    a.wardsKilled += b.wardsKilled;
                    a.wardsPlaced += b.wardsPlaced;
                    
                    
                }
                
                return a;
        
            };

            function finalize(key, value){
                
                
                    //value.count
                    //value.countNoMirror
                
                    value.winRate = value.won / value.countNoMirror;
                    value.firstBloodRate = value.firstBlood / value.picked;
                    value.firstDragonRate = value.firstDragon / value.countNoMirror;
                    value.firstBaronRate = value.firstBaron / value.countNoMirror;
                    value.firstInhibitorRate = value.firstInhibitor / value.countNoMirror;
                    value.assists = value.assists / value.count;
                    value.champLevel = value.champLevel / value.count;
                    value.deaths = value.deaths / value.count;
                    value.doubleKills = value.doubleKills / value.count;
                    value.goldEarned = value.goldEarned / value.count;
                    value.goldSpent = value.goldSpent / value.count;
                    value.inhibitorKills = value.inhibitorKills / value.count;
                    value.killingSprees = value.killingSprees / value.count;
                    value.kills = value.kills / value.count;
                    value.largestCriticalStrike = value.largestCriticalStrike / value.count;
                    value.largestKillingSpree = value.largestKillingSpree / value.count;
                    value.largestMultiKill = value.largestMultiKill / value.count;
                    value.magicDamageDealt = value.magicDamageDealt / value.count;
                    value.magicDamageDealtToChampions = value.magicDamageDealtToChampions,
                    value.magicDamageTaken = value.magicDamageTaken / value.count;
                    value.minionsKilled = value.minionsKilled / value.count;
                    value.neutralMinionsKilled = value.neutralMinionsKilled / value.count;
                    value.neutralMinionsKilledEnemyJungle = value.neutralMinionsKilledEnemyJungle / value.count;
                    value.neutralMinionsKilledTeamJungle = value.neutralMinionsKilledTeamJungle / value.count;
                    value.pentaKills = value.pentaKills / value.count;
                    value.physicalDamageDealt = value.physicalDamageDealt / value.count;
                    value.physicalDamageDealtToChampions = value.physicalDamageDealtToChampions / value.count;
                    value.physicalDamageTaken = value.physicalDamageTaken / value.count;
                    value.quadraKills = value.quadraKills / value.count;
                    value.sightWardsBoughtInGame = value.sightWardsBoughtInGame / value.count;
                    value.teamBaronKills = value.teamBaronKills / value.count;
                    value.teamDragonKills = value.teamDragonKills / value.count;
                    value.totalDamageDealt = value.totalDamageDealt / value.count;
                    value.totalDamageDealtToChampions = value.totalDamageDealtToChampions / value.count;
                    value.totalDamageTaken = value.totalDamageTaken / value.count;
                    value.totalHeal = value.totalHeal / value.count;
                    value.totalTimeCrowdControlDealt = value.totalTimeCrowdControlDealt / value.count;
                    value.totalUnitsHealed = value.totalUnitsHealed / value.count;
                    value.towerKills = value.towerKills / value.count;
                    value.tripleKills = value.tripleKills / value.count;
                    value.trueDamageDealt = value.trueDamageDealt / value.count;
                    value.trueDamageDealtToChampions = value.trueDamageDealtToChampions / value.count;
                    value.trueDamageTaken = value.trueDamageTaken / value.count;
                    value.unrealKills = value.unrealKills / value.count;
                    value.visionWardsBoughtInGame = value.visionWardsBoughtInGame / value.count;
                    value.wardsKilled = value.wardsKilled / value.count;
                    value.wardsPlaced = value.wardsPlaced / value.count;
                
                return value
                
            }
            
            
            matchesCollection.mapReduce(map, reduce, {
                out: { replace: "mapReduceResults" },
                finalize: finalize,
                scope: {
                    checkMirror: checkMirror
                }
                
            }, function (err, data){
                
                if(err)
                    return callback (err);
                
                console.log("Initial MapReduce OK");
                
                //callback (null, "OK"); 
                
                // NEXT STAGE
                processFinalData(function (err, data){
                    if(err)
                        return callback(err);
                    
                    callback(null, data);
                });
            });
            
    
}

var processFinalData = function (callback) {
    
    //exports.mapReduceAllResults (function (err, data) {
        
        
        banRatesByChampion(function (err, data){ // AGGREGATING BAN RATES
            
            if(err)
                return callback (err);
            
            console.log("Ban rates aggregated OK");
            
            gamesCountByDay(function (err, data){ // GETTING GAME COUNTS PER DAY
                
                if(err)
                    callback (err);
                
                var queryCount = 0;
                
                data.forEach (function (dayInfo){
                    
                    var day = dayInfo._id;
                    
                    mapReduceResultsCollection.updateMany({ '_id.day': day }, {$set: { 'value.totalDayGames': dayInfo.value }}, function(err, r) { // AGGREGATING GAME COUNTS PER DAY
                        
                        if(err)
                            return callback(err);
                        
                        //console.log(day);
                        
                        queryCount++;
                        
                        if( queryCount == data.length ){
                            console.log("Total game counts updated");
                            
                            processFinalRates(function (err, data){ // NEXT STAGE
                               if(err)
                                   return callback(err);
                                
                                callback (null, data);
                            });
                        }
                        
                    });
                    
                });
                
            });
        });
        
        
        
    //});
    
}

var processFinalRates = function(callback){ // CALCULATING RATES WITH THE DATA ALREADY IN THE DOCS AND INITIALIZING FIELDS
    
    
    function map() {
        
        emit({championId: this._id.championId, 
             day: this._id.day},this.value);
        
    }
    
    function reduce(key, values) {
        
        var a = values[0];
        
        a.pickRate = (a.picked? (a.picked / a.totalDayGames) : 0);
        a.firstPickRate = (a.firstPicked? (a.firstPicked / a.totalDayGames) : 0);
        a.banRate = (a.banned? (a.banned / a.totalDayGames) : 0);
        a.firstBanRate = (a.firstBanned? (a.firstBanned / a.totalDayGames) : 0);
        
        return a;
        
    }
    
    mapReduceResultsCollection.mapReduce(map, reduce, {
                out: { reduce: "mapReduceResults" }
                
            }, function (err, data){
                
        if(err)
            return callback (err);
        
        console.log("Finished OK");
        
        callback (null, "Finished OK"); // FINISHED
        
                
    });
    
    
}


exports.mapReduceAllResults = function (callback) {
    
    mapReduceResultsCollection.find( {} ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsByChampion = function (champId, callback) {
    
    var champId = Number(champId);
    
    mapReduceResultsCollection.find( { '_id.championId': champId } ).sort( { '_id.day': 1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsByWinrate = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.winRate': { $exists: true } }).sort( { 'value.winRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsByPickrate = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.winRate': { $exists: true } }).sort( { 'value.pickRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopPickrate = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day }).limit( 10 ).sort( { 'value.pickRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsWorstPickrate = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.winRate': { $exists: true } }).limit( 10 ).sort( { 'value.pickRate': 1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopFirstPickrate = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day }).limit( 10 ).sort( { 'value.firstPickRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopWinrate = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.winRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsWorstWinrate = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.winRate': 1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopKills = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.kills': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopDeaths = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.deaths': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopGold = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.goldEarned': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopAssists = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.assists': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopKillingSprees = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.killingSprees': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopMinionsKilled = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.minionsKilled': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopPentaKills = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.pentaKills': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopDamage = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.totalDamageDealtToChampions': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopDamageTaken = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.totalDamageTaken': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopHeal = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.totalHeal': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopCrowdControl = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.totalTimeCrowdControlDealt': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopTowerKills = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.towerKills': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopUnrealKills = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.unrealKills': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopFirstBlood = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, 'value.picked': { $gte: 100 } }).limit( 10 ).sort( { 'value.firstBloodRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}


var fighters = [266, 23, 79, 78, 2, 86, 68, 82, 122, 77, 126, 80, 92, 150, 254, 10, 39, 64, 106, 24, 102, 36, 131, 421, 120, 19, 72, 157, 75, 58, 114, 83, 62, 5, 41, 48];
var tanks = [14, 111, 27, 57, 12, 89, 3, 106, 36, 113, 154, 54, 75, 33, 31, 98, 32, 48, 59];
var supports = [412, 43, 37, 117, 89, 432, 20, 40, 16, 26, 53, 201, 44, 267];
var assassins = [28, 105, 238, 55, 121, 76, 84, 107, 35, 91, 7, 56, 11, 38];
var mages = [69, 13, 1, 99, 103, 112, 34, 127, 25, 74, 30, 134, 268, 85, 45, 90, 60, 4, 63, 131, 8, 101, 50, 115, 61, 9, 161, 143];
var marksmen = [96, 22, 67, 110, 42, 51, 104, 429, 133, 18, 15, 236, 17, 119, 222, 6, 21, 29, 81];



exports.mapReduceResultsTopFighters = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, '_id.championId': {$in: fighters} }).limit( 10 ).sort( { 'value.pickRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopTanks = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, '_id.championId': {$in: tanks} }).limit( 10 ).sort( { 'value.pickRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopSupports = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, '_id.championId': {$in: supports} }).limit( 10 ).sort( { 'value.pickRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopAssasins = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, '_id.championId': {$in: assassins} }).limit( 10 ).sort( { 'value.pickRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopMages = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, '_id.championId': {$in: mages} }).limit( 10 ).sort( { 'value.pickRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}

exports.mapReduceResultsTopMarksmen = function (day, callback) {
    
    if(day != "all")
        var day = Number(day);
    
    mapReduceResultsCollection.find({ '_id.day': day, '_id.championId': {$in: marksmen} }).limit( 10 ).sort( { 'value.pickRate': -1 } ).toArray(function(err, data) {
        
        if (err)
            return callback (err);
        
        callback(null, data);
        
      });
    
}