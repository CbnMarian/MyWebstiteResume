const button = document.getElementById("button-robot");
const audioElement = document.getElementById("audio-robot");

// disable/enable button
function toggleButton() {
  button.disabled = !button.disabled;
}

// passing the jokes to voice api
const tellJoke = (joke) => {
  VoiceRSS.speech({
    key: "e7621aace3b64f588463a898b9c2b3a2",
    src: joke,
    hl: "en-us",
    v: "Linda",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
};

// Get Jokes from JokeAPI
async function getJokes() {
  try {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any");
    const data = await response.json();
    if (data.type === "twopart") {
      // Log the joke setup and delivery separately
      console.log("Joke Setup:", data.setup);
      console.log("Joke Delivery:", data.delivery);
      const joke = `${data.setup} ... ${data.delivery}`;
      tellJoke(joke);
    } else {
      console.log("Single-part Joke:", data.joke);
      tellJoke(data.joke);
    }
  } catch (error) {
    console.error("Error fetching jokes:", error.message);
  }
}

// Trigger the function
document.getElementById("button-robot").addEventListener("click", getJokes);

// New console.log for debugging
console.log("Jokes.js file loaded successfully!");
