$(document).ready(function () {
    // Check if there is a blocked users list in the local storage
    if (localStorage.getItem("blocked_words")) {
        // Get the list from the local storage
        var blocked_words = JSON.parse(localStorage.getItem("blocked_words"));

        // Render the list
        renderList(blocked_words);
        blurBlockedWordsThreads(blocked_words);
        collapseBlockedWords(blocked_words);
        blurBlockedWordsInbox(blocked_words);
    }
});

// When the block button is clicked
$(document).on("click", "#block-word", function (event) {
    event.preventDefault();

    var word_to_block = $("#word-to-block").val().trim().toLowerCase();
    var blocked_words = JSON.parse(localStorage.getItem("blocked_words")) || {};
    var blocked = blocked_words.hasOwnProperty(word_to_block);

    if (blocked) {
        alert("Word already blocked");
    }
    else {
        blocked_words[word_to_block] = "blocked";

        // Get the selected option and add it to the blocked_words object
        var block_option = $("#block-option").val();
        blocked_words[word_to_block] = block_option;

        localStorage.setItem("blocked_words", JSON.stringify(blocked_words));

        $("#word-to-block").val("");
        renderList(blocked_words);
    }
});

// Function to render the list of blocked users
function renderList(blocked_words) {
    var blocked_words_list = $("#blocked_words");
    blocked_words_list.empty();

    for (var word in blocked_words) {
        var list_item = `
            <li class="wf-module-item" style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
                <span>${word}</span>
                <span>${blocked_words[word]}</span>
                <button class="btn mod-action unblock-btn btn" data-word="${word}" style="background-color: #79c38a; width: 50px;">Unblock</button>
            </li>`;
        blocked_words_list.append(list_item);
    }
}

// When the unblock button is clicked
$(document).on("click", ".unblock-btn", function () {
    var word_to_unblock = $(this).data("word");

    var blocked_words = JSON.parse(localStorage.getItem("blocked_words")) || {};
    delete blocked_words[word_to_unblock];
    localStorage.setItem("blocked_words", JSON.stringify(blocked_words));

    renderList(blocked_words);
});

// Function that blurs every .wf-module-item containing blocked words
function blurBlockedWordsThreads(blocked_words) {
    for (var word in blocked_words) {
        if (blocked_words[word] === "Thread Title" || blocked_words[word] === "Both") {
            var regex = new RegExp("\\b" + word + "\\b", "i"); // use regex with word boundary markers \b, ignore casing

            var blocked_threads = $(".js-home-threads .wf-module-item").filter(function () {
                return regex.test($(this).text());
            });

            blocked_threads.each(function () {
                $(this).children().addClass("word-block-blur");
            });
        }
    }
}

// Function to handle blocked posts
function collapseBlockedWords(blocked_words) {
    for (var word in blocked_words) {
        if (blocked_words[word] === "Posts" || blocked_words[word] === "Both") {
            var regex = new RegExp("\\b" + word + "\\b", "i");

            var blocked_threads = $(".post").filter(function () {
                return regex.test($(this).not("img").text());
            });

            blocked_threads.each(function () {
                $(this).find(".post-body").addClass("word-block-blur");
            });
        }
    }
}

// Function to handle blocked posts in inbox
function blurBlockedWordsInbox(blocked_words) {
    if (window.location.href.startsWith("https://www.vlr.gg/inbox")) {
        for (var word in blocked_words) {
            if (blocked_words[word] === "Posts" || blocked_words[word] === "Both") {
                var regex = new RegExp("\\b" + word + "\\b", "i");

                var blocked_threads = $(".wf-card").filter(function () {
                    return regex.test($(this).not("img").text());
                });

                blocked_threads.each(function () {
                    $(this).find("a:eq(1)").after("contains blocked words (hover over to unblur)");
                    $(this).find("p").addClass("word-block-blur");
                });
            }
        }
    }
}
