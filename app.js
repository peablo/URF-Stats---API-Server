var express = require('express'),
    loadGames = require('./router/loadGamesRouter.js'),
    api = require('./router/apiRouter.js'),
    mapReduce = require('./router/mapReduceDataRouter.js');


var app = express();

app.use('/loadgames', loadGames);

app.use('/api', api);

app.use('/mapReduce', mapReduce);
    



app.listen(3000);