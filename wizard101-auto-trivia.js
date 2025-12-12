// ==UserScript==
// @name         Wizard101 Auto-Trivia Solver
// @namespace    https://github.com/labrat3000/placeholder
// @version      1.4
// @description  Auto solver for Wizard101 Crowns trivia
// @author       Jan-FCloud (modified)
// @match        https://www.wizard101.com/quiz/trivia/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

(function () {
    'use strict';

    // Override the .fadeIn css animation to last 0 seconds
    $("<style type='text/css'> .fadeIn { animation: fadeIn 0s; } </style>").appendTo("head");

    // Make answers visible
    $(".answer").each(function () {
        $(this).addClass("fadeIn").css("visibility", "visible");
    });

    // Make #nextQuestion visible
    $("#nextQuestion").addClass("fadeIn kiaccountsbuttongreen").css("visibility", "visible");

    // Fetch and parse the JSON answers
    $.getJSON("https://raw.githubusercontent.com/labrat3000/placeholder/refs/heads/main/answers.json", function (data) {

        let triviaPages = [
            "https://www.wizard101.com/quiz/trivia/game/english-trivia",
            "https://www.wizard101.com/quiz/trivia/game/kingsisle-trivia",
            "https://www.wizard101.com/quiz/trivia/game/educational-trivia",
            "https://www.wizard101.com/quiz/trivia/game/fun-trivia",
            "https://www.wizard101.com/game/trivia"
        ];

        // Quiz listing page
        if (triviaPages.includes(window.location.href)) {
            $(".darkerparchment_header td:nth-child(2) h2").each(function () {
                let quizTitle = $(this).text().trim().replace("Trivia", "");
                if (data[quizTitle]) {
                    $(this).css("background-color", "green");
                }
            });
        } else {
            // Individual quiz page
            let quizTitle = window.location.href.split("https://www.wizard101.com/quiz/trivia/game/")[1]
                .replace(/-/g, " ")
                .replace("trivia", "")
                .replace(/\b\w/g, l => l.toUpperCase())
                .trim();

            let question = $(".quizQuestion").text();

            data[quizTitle]?.forEach(qElement => {
                if (qElement[0].toUpperCase() === question.toUpperCase() || qElement[0].toUpperCase() === question.toUpperCase() + "?") {
                    $(".answerText").each(function () {
                        let elementText = $(this).text().trim();
                        if (elementText === qElement[1].trim()) {
                            // Highlight and click correct answer
                            $(this).css("background-color", "green")
                                .parent().find('.largecheckbox, .largecheckboxselected').click();

                            // Click next question after delay
                            setTimeout(() => $('#nextQuestion').click(), 100);
                        }
                    });
                }
            });
        }

        // ---- AUTO CLAIM REWARD (Assume user is logged in) ----
        function claimReward() {
            const rewardButton = $(".kiaccountsbuttongreen:contains('CLAIM YOUR REWARD')");
            if (rewardButton.length > 0) {
                console.log("Reward button found, clicking...");

                // Play notification sound immediately
                const audio = new Audio("https://www.soundjay.com/buttons/beep-07a.mp3");
                audio.play().catch(err => console.log("Audio playback failed:", err));

                // Click the reward button
                rewardButton.click();

            } else {
                console.log("Reward button not found, retrying in 1s...");
                setTimeout(claimReward, 250);
            }
        }

        // Wait a bit in case quiz results haven't rendered yet
        setTimeout(claimReward, 250);
    });
})();

