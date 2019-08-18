require("dotenv").config();

const keys = require("./keys.js");

const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');
const fs = require("fs");

let action = process.argv[2];
let userRequest = process.argv.slice(3).join(" "); 

function liriBot(action, userRequest) { 
    switch (action) { 
        case "spotify": 
            getSong(userRequest);
            break; 

        case "concerts": 
            getConcerts(userRequest); 
            break; 

        case "movie":
            getMovie(userRequest); 
            break; 
        
        case "help": 
            getHelp(userRequest);
            break;

        default: 
            console.log("Please pick an action: spotify, concerts, movie, help"); 
    }
};

liriBot(action, userRequest);

function getSong() { 
    const spotify = new Spotify(keys.spotify); 

    if (!userRequest) { 
        //default song
        userRequest = "I Want It That Way";
    };

    spotify.request("https://api.spotify.com/v1/search?q=track:" + userRequest + "&type=track&limit=1", function(err, response) { 
        if (err) { 
            console.log(err); 
        }
        
        console.log("-----------------------------------"); 
        console.log("\nSong: " + response.tracks.items[0].name); + 
        console.log("\nArtist: " + response.tracks.items[0].artists[0].name);
        console.log("\nAlbum: " + response.tracks.items[0].album.name);
        console.log("\nURL: " + response.tracks.items[0].preview_url);
        console.log("-----------------------------------"); 

    });
}

function getConcerts() { 
    const queryURL = "https://rest.bandsintown.com/artists/" + userRequest + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function(response) { 

            const concertDatetime = response.data[0].datetime;
            const concertDate = concertDatetime.slice(0,10);
            const dateFormat = moment(concertDate, "YYYY-MM-DD");
            const newFormat = dateFormat.format("MM-DD-YYYY");

            
            console.log("-----------------------------------\n"); 
            console.log("Venue: " + response.data[0].venue.name); 
            console.log("\nCity: " + response.data[0].venue.city); 
            console.log("\nDate: " + newFormat);
            console.log("\nEvent URL: " + response.data[0].url);
            console.log("-----------------------------------"); 

        }
    );
}

function getMovie() { 

    const queryURL ="http://www.omdbapi.com/?t=" + userRequest + "&apikey=trilogy"; 
    
    axios.get(queryURL).then(
        function(response) { 

            if (!userRequest) { 
                //default movie
                userRequest = "Mr. Nobody";
            };

            //console.log(response);
            
            console.log("-----------------------------------"); 
            console.log("\nMovie Title: " + response.data.Title); 
            console.log("\nYear Released: " + response.data.Year); 
            console.log("\nIMDB Rating: " + response.data.imdbRating); 
            console.log("\nRotten Tomatoes Score: " + response.data.Metascore); 
            console.log("\nCountry Produced: " + response.data.Country); 
            console.log("\nLanguages: " + response.data.Language); 
            console.log("\nShort Plot: " + response.data.Plot); 
            console.log("\nActors: " + response.data.Actors); 
            console.log("-----------------------------------"); 

        }
    );
};

function getHelp(){
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
        let output = data.split(",");
  
        let action = output[0];
        userQuery = output[1];

        console.log(action);
        
        liriBot(action, userQuery);
      });
  };