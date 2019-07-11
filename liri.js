var request = require('request');
require("dotenv").config();
var fs = require('fs');
var Spotify = require('node-spotify-api');

var dotenv = require("dotenv").config();
var keys = require("./keys.js");

//moment js
var moment = require('moment');
moment().format();

//spotify keys
var spotify = new Spotify(keys.spotify);

//variable for input
var command = process.argv[2];
var input = process.argv[3];

//   concert-this
function concertIt(bandQuery) {

    // request omdb api
    var queryUrl = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=codingbootcamp#";

    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        // If successful
        if (!error && response.statusCode === 200) {

            var concertData = JSON.parse(body);

            var concertDT = concertData[0].datetime
            var momentDT = moment().format('L');


            // console.log(concertData);
            // for (i = 0; i < movieData.length && i < 5; i++)
            console.log("===============================");
            console.log("Venue Name : " + concertData[0].venue.name +
                "\nVenue Location: " + concertData[0].venue.city + "," + concertData[0].venue.country +
                "\nDate of the Event: " + momentDT +
                "\n===============================");

        };
    });
}
//     spotify-this-song
function spotifyIt(musicSearch) {

    //default: "The Sign" by Ace of Base.
    if (musicSearch === undefined || null) {
        musicSearch = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: musicSearch }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        else {
            for (i = 0; i < data.tracks.items.length && i < 5; i++) {

                var musicQuery = data.tracks.items[i];
                console.log("Artist: " + musicQuery.artists[0].name +
                    "\nSong Name: " + musicQuery.name +
                    "\nLink to Song: " + musicQuery.preview_url +
                    "\nAlbum Name: " + musicQuery.album.name +
                    "\n===============================");
            }
        };
    });
}
// spotifyIt();

//movie-this
function movieIt(movieQuery) {

    // if no movie, default: 'Mr.Nobody.'
    if (movieQuery === undefined || null) {
        movieQuery = "Mr.Nobody";
    }

    // request ombd api
    var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        // If successful
        if (!error && response.statusCode === 200) {
            var movieData = JSON.parse(body);

            // for (i = 0; i < movieData.length && i < 5; i++) {
            console.log("===============================");
            console.log("Movie Title: " + movieData.Title +
                "\nYear: " + movieData.released +
                "\nIMDB Rating: " + movieData.imdbRating +
                "\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value +
                "\nCountry: " + movieData.Country +
                "\nLanguage: " + movieData.Language +
                "\nPlot: " + movieData.Plot +
                "\nActors: " + movieData.Actors +
                "\n===============================");
            // };
        };
    });
}
// movieIt();

// Switch comms for function
var ask = function (commands, funData) {
    switch (commands) {
        case "concert-this":
            concertIt(funData);
            break;
        case "movie-this":
            movieIt(funData);
            break;
        case 'spotify-this-song':
            spotifyIt(funData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("Please try again");
    }
};

//dowWhatItSays from random.txt
var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) throw err;
        var randomText = data.split(",");

        if (randomText.length == 2) {
            ask(randomText[0], randomText[1]);
        }
        else if (randomText.length == 1) {
            ask(randomText[0]);
        }
    });
}
// arg for switch case
ask(command, input);