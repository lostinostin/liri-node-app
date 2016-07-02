function liriApp() {

	var keys = 'keys.js';
	var fs = require('fs');
	var inquirer = require('inquirer');
	var request = require('request');
	var Twitter = require('twitter');
	var debug = require('events');
	//var action = process.argv[2];

	inquirer.prompt([

		{
			type: 'list',
			message: 'What would you like to do?',
			choices: ['Movies & TV', 'Music', 'Twitter', 'Exit'],
			name: 'choice'
		}

		]).then(function(user){

			if (user.choice === 'Movies & TV') {
				return movies();
			}

			if (user.choice === 'Music') {
				return music();
			}

			if (user.choice === 'Twitter'){
				return twitter();
			}

			if (user.choice === 'Exit'){
				return exitProg();
			}

			function movies(){

				inquirer.prompt([

					{
						type: 'input',
						name: 'movie',
						message: 'Type in a movie:'
					}

					]).then(function(choice){

					var movie = choice.movie;
					var dataArray = [];
					request('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&r=json', function(error, response, body){
						if(!error && response.statusCode == 200) {

							for (var i = 0; i < 25; i++){
								var data = body.split(',')[i].replace(/[^\w:]*"/g, '');
								console.log(data);
							}
							return liriApp();
						}
					});
				});
				
			}

			function music(){
				var spotify = require('spotify');

				inquirer.prompt([

					{
						name: 'search',
						message: 'Search for an artist: '	
					}

					]).then(function(user){
						var opn = require('opn');
						spotify.search({ type: 'track', query: user.search }, function(err, data) {
						    if ( err ) {
						        console.log('Error occurred: ' + err);
						        return;
						    }
						    var spotifyArray = [];
						    var artistArray = [];
							var items = data.tracks.items;

							// For future endeavors: 
								// var spotifyBool = true;
								// function isInArray(value, array) {
								// 	return array.indexOf(value) > -1;
								// }
	 
							for (var i = 0; i < items.length; i++) {
								var link = items[i].external_urls.spotify;
								var artists = items[i].artists;
								for(var j = 0; j < artists.length; j++) {
									
									if (items[i].popularity > 40 && artists[j].type === 'artist') {
										console.log(artists[j].name);
										console.log(link);
										opn(link);
										return liriApp();
									}
								}
							}

						});
					})
					
			}

			function twitter(){

				// I didn't really understand how to export the twitter API keys, the commented out code below is what I began trying to accomplish this.

				// var client;
				// fs.readFile('keys.js', "utf8", function(err, data){
				// 	client = new Twitter({data});
				// 	console.log(client.file);
				// });

				var client = new Twitter({
					consumer_key: 'czimrYdwdwhcpUpLpiTuUpGTK',
					consumer_secret: 'oIEy4wm4O6jH3gYBGz9HeJMEObBv0p8DZZ76iDHwnj77XFHLAs',
					access_token_key: '2597222528-E6drNKw6YJ1rS2TDcS98kZkg1UBDw5VWBmaM0Zc',
					access_token_secret: 'X20RYeua3JGf8w7FzRNs0KcmISLyOF4g7upT93q1InVER'
				});

				inquirer.prompt([

						{
							type: 'list',
							name: 'tweeter',
							choices: ['Tweet', 'Search'],
							message: 'What would you like to do?'
						}

					]).then(function(user){

						
						if (user.tweeter === 'Tweet') {

							inquirer.prompt([

								{
									name: 'thought',
									type: 'input',
									message: 'Let your thoughts be known to the world: '
								}

								]).then(function(write){
									// console.log(client);
									client.post('statuses/update', {status: write.thought}, function(error, tweet, response) {
									  if (!error) {
									  	console.log("/------------------------------------------------------------------------------------------------------------------------/");
									  	console.log("/------------------------------------------------------------------------------------------------------------------------/\n");
									    console.log("You tweeted: " + tweet.text + "\n");
									    console.log("/------------------------------------------------------------------------------------------------------------------------/");
									    console.log("/------------------------------------------------------------------------------------------------------------------------/");
									    return liriApp();
									  }
									});
								});

						} 

						if (user.tweeter === 'Search') {

							inquirer.prompt([

								{
									name: 'feed',
									type: 'input',
									message: 'Search all the tweets: '
								}

							]).then(function(search){

								client.get('search/tweets', {q: search.feed}, function(error, tweets, response) {

									if (!error) {
																				
										var topTweets = tweets.statuses;
										for (var i = 1; i < topTweets.length; i++) {
											console.log('\n');
											console.log('\n');
											console.log(i + ":");
											console.log("------------------------------------------------------------------------------------------------------------------------------------------------");
											console.log("                         " + topTweets[i].text + "            ");
											console.log("------------------------------------------------------------------------------------------------------------------------------------------------");
											
										}
										return liriApp();
									}
								});
							});

						}

					});	
						
			}

			function exitProg(){
				return;
			}
			
	});
	
}

liriApp();