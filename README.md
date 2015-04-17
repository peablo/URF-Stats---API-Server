# URF-Stats---API-Server
Node.JS backend server for the URF Stats website

It takes arrays of URF Games IDs via the "/loadgames" endpoint. Parameters: "ids" (an array) and "region", the region identifier.
eg. localhost/loadgames?region=euw&ids=[123,456]

Then it stores the data in a MongoLab deployed MongoDB database, you can change the url string at matchRequest.js and everything else will work the same.
Its also needed to replace "api_key" with your own Riot development API KEY.

The logic for all the database operations is in the mongoHelper.js file, and the routing for all the requests in app.js and
the respective files in /router.

There are two APIs, one calculates the data on the fly via simple queries and aggregate operations, intended for dev purposes, its endpoint is /api

For a better way to deploy an application with this, use the /mapReduce endpoint which returns the results of a sequence of 
MapReduce operations that calculate all sorts of averages and rates by champion and date.

# dev API:

/api/getGames

/api/getGamesCount

/api/getPickRate (param champId)

/api/getFirstPickRate (param champId)

/api/getBanRate (param champId)

/api/getFirstBanRate (param champId)

/api/getWinRate (param champId)

/api/getFirstBloodRate (param champId)

/api/getFirstDragonRate (param champId)

/api/getFirstInhibitorRate (param champId)

/api/getFirstBaronRate (param champId)

/api/getAverageStats -  (param champId) returns all numeric stats that are returned by Riot API for a game, averaged through mongoDB aggregation

# MapReduce API:

/mapReduce/mapReduceAllStats - This just performs the MapReduce operations and replaces the previous results on the chosen collection.

/mapReduce/getMapReduceAllResults

/mapReduce/getMapReduceResultsByChampion (param champId) - returns the results for all days, for a certain champion, as an array, sorted by day ("all" goes last)

/mapReduce/getMapReduceResultsByWinrate (param day) - All results for a certain day, sorted by winrate

/mapReduce/getMapReduceResultsByPickrate (param day) - All results for a certain day, sorted by pickrate

The following queries take a day as a parameter and return the Top 10 champions for each stat, sorted descending

/mapReduce/getMapReduceResultsTopPickrate 

/mapReduce/getMapReduceResultsWorstPickrate 

/mapReduce/getMapReduceResultsTopFirstPickrate 

/mapReduce/getMapReduceResultsTopWinrate 

/mapReduce/getMapReduceResultsWorstWinrate 

/mapReduce/getMapReduceResultsTopKills

/mapReduce/getMapReduceResultsTopDeaths

/mapReduce/getMapReduceResultsTopGold

/mapReduce/getMapReduceResultsTopAssists

/mapReduce/getMapReduceResultsTopKillingSprees

/mapReduce/getMapReduceResultsTopMinionsKilled

/mapReduce/getMapReduceResultsTopPentaKills

/mapReduce/getMapReduceResultsTopDamage

/mapReduce/getMapReduceResultsTopDamageTaken

/mapReduce/getMapReduceResultsTopHeal

/mapReduce/getMapReduceResultsTopCrowdControl

/mapReduce/getMapReduceResultsTopTowerKills

/mapReduce/getMapReduceResultsTopUnrealKills

/mapReduce/getMapReduceResultsTopFirstBlood

The following queries return the top 10 popular (pickrate) champions of each role and sorting by pickrate, also taking a day as a parameter.

/mapReduce/getMapReduceResultsTopFighters

/mapReduce/getMapReduceResultsTopTanks

/mapReduce/getMapReduceResultsTopSupports

/mapReduce/getMapReduceResultsTopAssasins

/mapReduce/getMapReduceResultsTopMages

/mapReduce/getMapReduceResultsTopMarksmen

A MapReduce processed object looks like this:

{

  _id:{ // This is the Primary Key
  
        day: (1 to 13 number (days urf was up) or "all")
        
        championId: (championId number)
        
      }
      
  values: { // all sorts of calculated averages and percentages
  
      pickRate
      
      winRate
      
      totalDamageDealt
      
      ...
      
  }
  
}
