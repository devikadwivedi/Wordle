"use strict";

(function() {
  window.addEventListener("load", init);
  let currLetter = 0;
  let answer = "FOCUS";
  let guessNum = 1;

  document.ondblclick = function(e) {
    e.preventDefault();
  }

  function init() {
    initButtons();
  }

  function initButtons() {
    let buttons = qsa("button");
    buttons.forEach(element => {
      element.addEventListener("click", typeLetter);
    });

    id("enterButton").addEventListener("click", enterGuess);
    id("enterButton").removeEventListener("click", typeLetter);
  }

  function enterGuess () {
    let currGuess = "guess" + guessNum;
    let word = id(currGuess).querySelectorAll("section");
    let guess = "";

    word.forEach(element => {
      guess += element.textContent;
    });
    if (guess.length < 5) {
      console.log("not enough letters");
    } else {
      console.log(guess);
      validateGuess(guess);
    }
  }

  /**
   * gives the user a helpful message if an error occurs while requesting
   */
  function handleError() {
    console.log("Error: refresh your screen and try again.");
  }

 /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  function validateGuess() {
    let currGuess = "guess" + guessNum;
    let word = id(currGuess).querySelectorAll("section");

    word.forEach(element => {
      element.classList.add("incorrect");
      element.classList.remove("newText");
    });
    let numRight = 0;

    for (let i = 0; i < word.length; i++) {
      for (let j = 0; j < answer.length; j++) {

        if (word[i].textContent === answer[j]) {
          if (i === j) {
            word[i].classList.remove("incorrect");
            word[i].classList.add("correct");
            numRight++;
          } else {
            word[i].classList.remove("incorrect");
            word[i].classList.add("semicorrect");
          }
          break;
        }
      }
    }
    gameState(numRight);
  }

  function gameState(numRight) {
    if (numRight == 5) {
      id("msg").textContent = "Genius!";
      id("msg").classList.remove("hidden");
      let timerId = setTimeout(() => {
        id("msg").classList.add("hidden");
      }, 1000);
      endGame();
    } else if (guessNum < 6) {
      guessNum++;
      currLetter = 0;
    } else {
      id("msg").textContent = answer.toLowerCase();
      id("msg").classList.remove("hidden");
      endGame();
    }
  }

  function endGame() {
    let buttons = qsa("button");
    buttons.forEach(element => {
      element.removeEventListener("click", typeLetter);
    });
    id("enterButton").removeEventListener("click", enterGuess);
  }

  function typeLetter() {
    let letter = this.textContent;
    let currGuess = "guess" + guessNum;
    let word = id(currGuess).querySelectorAll("section");

    if (letter === "backspace" && currLetter > 0) {
      letter = "";
      currLetter--;
      word[currLetter].textContent = letter;
      word[currLetter].classList.toggle("newText");
    } else if (letter !== "backspace" && currLetter < 5) {
      word[currLetter].textContent = letter;
      word[currLetter].classList.toggle("newText");
      currLetter++;
    }
  }


  /**
   * Returns the desired element node
   * @param {string} tag - the name of the tag to create
   * @returns {object} the desired element node
   */
  function gen(tag) {
    return document.createElement(tag);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching the given CSS selector.
   * @param {string} selector - CSS selector.
   * @returns {object} - object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns an array of elements that match the given CSS selector.
   * @param {string} selector - CSS selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

}());