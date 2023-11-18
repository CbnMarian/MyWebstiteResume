"use strict";
const button = document.getElementById("button-robot");
const audioElement = document.getElementById("audio-robot");

//disable/enable button
function toggleButton() {
  button.disabled = !button.disabled;
}

//passing the jokes to voice api
function tellMe(joke) {
  const jokeString = joke.trim().replace(/ /g, "%20");
  VoiceRSS.speech({
    key: "e7621aace3b64f588463a898b9c2b3a2",
    src: jokeString,
    hl: "en-us",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
}

// Get jokes from joke API
async function getJokes() {
  let joke = "";
  const apiUrl =
    "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data.joke);
    if (data.setup) {
      console.log(data.joke);
      joke = `${data.setup} ... ${data.delivery}`;
    } else {
      joke = data.joke;
    }
    //text-to-speech
    tellMe(joke);
    //disable button
    toggleButton();
  } catch (err) {
    console.log("whoops!", err);
  }
}

// Event listeners

button.addEventListener("click", getJokes);
audioElement.addEventListener("ended", toggleButton);
