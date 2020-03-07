const word = document.getElementById("response");
const wrongLetter = document.getElementById("wrong-letters");
const popUp = document.getElementById("popup-container");
const finalMessage = document.getElementById("final-message");
const playButton = document.getElementById("play-button");
const notification = document.getElementById("notification");

const hangManParts = document.querySelectorAll(".hangman-part");

// Get the Words
const generateWords = async () => {
  const response = await fetch(
    "https://random-word-api.herokuapp.com/word?number=200"
  );
  const data = await response.json();
  return data;
};


generateWords().then(data => {
  const words = data;
  let selectedWord = words[Math.floor(Math.random() * words.length)];
  const correctLetters = [];
  const wrongLetters = [];

  // Functions
  function displayWord() {
    word.innerHTML = `${selectedWord
      .split("")
      .map(
        letter =>
          `<span class="letter"> ${
            correctLetters.includes(letter) ? letter : ""
          }  </span>`
      )
      .join("")}
      `;
    innerWord = word.innerText.replace(/\n/g, "");
    if (innerWord === selectedWord) {
      finalMessage.innerText = "Congratulations you won";
      popUp.style.display = "flex";
    }
  }
  function updateWrongLetters() {
    wrongLetter.innerHTML = `
          ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
          ${wrongLetters.map(letter => `<span>${letter}</span>`)}`;

    hangManParts.forEach((part, index) => {
      const errors = wrongLetters.length;
      if (index < errors) {
        part.style.display = "block";
      } else {
        part.style.display = "none";
      }
    });
    if (wrongLetters.length == hangManParts.length) {
      finalMessage.innerText = "Sorry you lost";
      popUp.style.display = "flex";
    }
  }
  function showNotification() {
    notification.classList.add("show");
    setTimeout(e => {
      notification.classList.remove("show");
    }, 2000);
  }

  // Event Listeners
  window.addEventListener("keydown", e => {
    if (e.keyCode >= 64 && e.keyCode <= 90) {
      const letter = e.key;
      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);
          displayWord();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);
          updateWrongLetters(letter);
        } else {
          showNotification();
        }
      }
    }
  });
  playButton.addEventListener("click", e => {
    correctLetters.splice(0);
    wrongLetters.splice(0);
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord();
    updateWrongLetters();
    popUp.style.display = "none";
  });

  displayWord();
});
