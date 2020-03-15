# BuddyGuyBot

## Description

A discord bot that queries various APIs in response to the commands described here.

## Initial Setup

Create a .env file that holds all of your API keys. You will need these keys, formatted like so --

DISCORD_TOKEN=YOUR_KEY_HERE
DARK_SKY_KEY=YOUR_KEY_HERE
GIPHY_KEY=YOUR_KEY_HERE

## Commands

### !random

![random search](/screenshots/random.png)

Finds and posts a random gif from giphy.

### !pokemon NUMBER or NAME

![pokemon command](/screenshots/pokemon.png)

Uses a Pokemon API to find and post information about a pokemon.

### !joke

![joke command](/screenshots/joke.png)

Queries the icanhazdadjoke or official-joke-api API to post a joke to the chat.

### !sticker

![sticker command](/screenshots/sticker.png)

Finds a sticker from giphy.

### !concerts BAND_NAME

![concert search](/screenshots/concerts.png)

Searches for upcoming concerts and posts them.

### !movie MOVIE_NAME

![movie search](/screenshots/movie.png)

Posts information about a movie.

### !catfact

Gets a catfact from the [Cat Fact API](https://alexwohlbruck.github.io/cat-facts/)!

### !insult

Gets an insult from the [Evil Insult Generator](https://evilinsult.com/api/).

### !advice

Retrieves an advice slip from the [Advice Slip API](https://api.adviceslip.com/). If a topic is provided, then it will search for advice based on that topic.

For example: `!advice friends`

![advice friends](/screenshots/advice.png)

### !photo

Queries lorem picsum and unsplash to send a pleasant, random 500 x 300 pixel photo to the chat.

![random photo](/screenshots/photo.png)

### !covid

Without parameters, it will provide global statistics for the Covid-19 pandemic.

![covid global](/screenshots/covid.png)

With a 2-letter country code passed in, it will provide stats for that country.

![covid US](/screenshots/covidCountry.png)
