//
const VoiceRSS = {
  speech: function (settings) {
    this._validate(settings);
    this._request(settings);
  },
  _validate: function (settings) {
    if (!settings) throw "The settings are undefined";
    if (!settings.key) throw "The API key is undefined";
    if (!settings.src) throw "The text is undefined";
    if (!settings.hl) throw "The language is undefined";
    if (settings.c && "auto" != settings.c.toLowerCase()) {
      var audioSupport = false;
      switch (settings.c.toLowerCase()) {
        case "mp3":
          audioSupport = new Audio()
            .canPlayType("audio/mpeg")
            .replace("no", "");
          break;
        case "wav":
          audioSupport = new Audio().canPlayType("audio/wav").replace("no", "");
          break;
        case "aac":
          audioSupport = new Audio().canPlayType("audio/aac").replace("no", "");
          break;
        case "ogg":
          audioSupport = new Audio().canPlayType("audio/ogg").replace("no", "");
          break;
        case "caf":
          audioSupport = new Audio()
            .canPlayType("audio/x-caf")
            .replace("no", "");
      }
      if (!audioSupport)
        throw "The browser does not support the audio codec " + settings.c;
    }
  },
  _request: function (e) {
    var a = this._buildRequest(e),
      t = this._getXHR();
    (t.onreadystatechange = function () {
      if (4 == t.readyState && 200 == t.status) {
        if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;

        //new audio(t.respoinseText).play()
        (audioElement.src = t.responseText), audioElement.play();
      }
    }),
      t.open("POST", "https://api.voicerss.org/", !0),
      t.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8",
      ),
      t.send(a);
  },
  _buildRequest: function (settings) {
    var codec =
      settings.c && "auto" != settings.c.toLowerCase()
        ? settings.c
        : this._detectCodec();
    return (
      "key=" +
      (settings.key || "") +
      "&src=" +
      (settings.src || "") +
      "&hl=" +
      (settings.hl || "") +
      "&r=" +
      (settings.r || "") +
      "&c=" +
      (codec || "") +
      "&f=" +
      (settings.f || "") +
      "&ssml=" +
      (settings.ssml || "") +
      "&b64=true"
    );
  },
  _detectCodec: function () {
    var audio = new Audio();
    return audio.canPlayType("audio/mpeg").replace("no", "")
      ? "mp3"
      : audio.canPlayType("audio/wav").replace("no", "")
        ? "wav"
        : audio.canPlayType("audio/aac").replace("no", "")
          ? "aac"
          : audio.canPlayType("audio/ogg").replace("no", "")
            ? "ogg"
            : audio.canPlayType("audio/x-caf").replace("no", "")
              ? "caf"
              : "";
  },

  _getXHR: function () {
    try {
      return new XMLHttpRequest();
    } catch (error) {
      try {
        return new ActiveXObject("Msxml3.XMLHTTP");
      } catch (error) {
        try {
          return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (error) {
          try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
          } catch (error) {
            try {
              return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (error) {
              try {
                return new ActiveXObject("Microsoft.XMLHTTP");
              } catch (error) {
                throw "The browser does not support HTTP request";
              }
            }
          }
        }
      }
    }
  },
};
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
    if (data.setup) {
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
