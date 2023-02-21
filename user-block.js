// When the document is ready
$(document).ready(function () {
    // Check if there is a blocked users list in the local storage
    if (localStorage.getItem("blocked_users")) {
        // Get the list from the local storage
        var blocked_users = JSON.parse(localStorage.getItem("blocked_users"));

        // Render the list
        renderList(blocked_users);
    }
});

// When the block button is clicked
$(document).on("click", "#block-btn", function (event) {
    // Prevent the page from reloading
    event.preventDefault();
    // Get the value of the text box
    var user_to_block = $("#user-to-block").val();

    // Check if the user is not empty, not a whitespace string, and not the same as the current user
    if (user_to_block && user_to_block.trim() && user_to_block !== username) {
        // Write the user to the local storage under the blocked_users key
        var blocked_users = JSON.parse(localStorage.getItem("blocked_users")) || {};
        blocked_users[user_to_block] = "blocked";
        localStorage.setItem("blocked_users", JSON.stringify(blocked_users));

        // Clear the text box
        $("#user-to-block").val("");

        // Render the list again
        renderList(blocked_users);
    } else {
        // Show an error message
        alert("Invalid user to block");
    }
});

// When the page loads
$(document).ready(function () {
    // Get the list of blocked users from the local storage
    var blocked_users = JSON.parse(localStorage.getItem("blocked_users")) || {};

    // Store the list in the local storage
    localStorage.setItem("blocked_users", JSON.stringify(blocked_users));

    // Render the list
    renderList(blocked_users);
});

// When an unblock button is clicked
$(document).on("click", ".unblock-btn", function () {
    // Get the user from the data attribute
    var user_to_unblock = $(this).data("user");

    // Remove the user from the local storage
    var blocked_users = JSON.parse(localStorage.getItem("blocked_users")) || {};
    delete blocked_users[user_to_unblock];
    localStorage.setItem("blocked_users", JSON.stringify(blocked_users));

    // Render the list again
    renderList(blocked_users);
});

// A function to render the list of blocked users
function renderList(blocked_users) {
    // Clear the list of blocked users
    $("#blocked_users").empty();

    // Loop through the blocked users
    for (var user in blocked_users) {
        // Create a list item with the user and an unblock button
        var listItem = $(`
            <li style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
            <a href="/user/${user}" class="">${user}</a>
            <button class="btn mod-action unblock-btn btn" data-user="${user}" style="background-color: #79c38a; width: 50px; margin-right: 570px;">Unblock</button>
            </li>`);

        // Append it to the list
        $("#blocked_users").append(listItem);
    }
}

// A function that changes the .post-header-author element with text saying "Blocked User"
function changePostHeaderAuthor(blockedCard) {
    // Get the .post-header-author element inside the card
    var postHeaderAuthor = blockedCard.find(".post-header-author");
    // Change the text of the element to "Blocked User"
    postHeaderAuthor.text("Blocked User");
}

// A function that creates a show post div element
function createShowPostDiv(originalMessage, postToggle) {
    // Create a div element with class .show-post and the text "Show Post"
    var showPostDiv = $("<div></div>").addClass("show-post").text("Show Post");
    // Add the CSS style to the div element
    showPostDiv.css({
        "background-color": "#da626c",
        "padding": "7px",
        "border-radius": "5px",
        "margin-left": "10px",
        "cursor": "pointer"
    });
    // Add a click event listener to the div that triggers a click event on the postToggle element
    showPostDiv.click(function () {
        postToggle.click();
        // Change the text of the div to "Hide Post" or "Show Post" depending on the current text of the div
        if (showPostDiv.text() === "Show Post") {
            showPostDiv.text("Hide Post");
        } else {
            showPostDiv.text("Show Post");
        }
    });
    // Return the show post div element
    return showPostDiv;
}

// A function that adds a div element on the header to show the original message of the blocked post
function addShowPostDiv(blockedCard) {
    // Get the .post-header-children element inside the card
    var postHeaderChildren = blockedCard.find(".post-header-children");
    // Get the original message element inside the card
    var originalMessage = blockedCard.find(".post-body");
    // Get the .js-post-toggle element inside the card
    var postToggle = blockedCard.find(".js-post-toggle");
    // Create a show post div element using the original message element and the postToggle element
    var showPostDiv = createShowPostDiv(originalMessage, postToggle);
    // Append the show post div element after the postHeaderChildren element
    postHeaderChildren.after(showPostDiv);
    // Add a click event listener to the postToggle element that changes the text of the showPostDiv element
    postToggle.click(function () {
        // Change the text of the showPostDiv element to "Hide Post" or "Show Post" depending on the visibility of the original message
        if (originalMessage.is(":hidden")) {
            showPostDiv.text("Show Post");
        } else {
            showPostDiv.text("Hide Post");
        }
    });
}

// A function that collapses every .wf-card containing blocked user and adds a div element to show the original message
function collapseBlockedCards(blocked_users) {
    // Loop through the blocked users
    for (var user in blocked_users) {
        // Find all the .wf-card elements that contain the user's name
        var blockedCards = $(`.wf-card:contains('${user}')`);
        // Loop through each blocked card
        blockedCards.each(function () {
            // Get the .js-post-toggle element inside the card
            var postToggle = $(this).find(".js-post-toggle");
            // Trigger a click event on the postToggle element to collapse the card
            postToggle.click();
            // Change the .post-header-author element with text saying "Blocked User"
            changePostHeaderAuthor($(this));
            // Add a div element on the header to show the original message of the blocked post
            addShowPostDiv($(this));
        });
    }
}

// When the document is ready
$(document).ready(function () {
    // Check if there is a blocked users list in the local storage
    if (localStorage.getItem("blocked_users")) {
        // Get the list from the local storage
        var blocked_users = JSON.parse(localStorage.getItem("blocked_users"));

        // Collapse the blocked cards
        collapseBlockedCards(blocked_users);
    }
});
