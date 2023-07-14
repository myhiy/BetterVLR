// Get username from the header link
if ($(".mod-login").length === 0) {
    var username = $(".header-nav-item.mod-user").attr("href").split("/user/")[1];
}

$(document).ready(function () {
    // Check if there is a blocked users list in the local storage
    if (localStorage.getItem("blocked_users")) {
        // Get the list from the local storage
        var blocked_users = JSON.parse(localStorage.getItem("blocked_users"));

        // Render the list
        renderList(blocked_users);
        collapseBlockedCards(blocked_users);
    }
});

// When the block button is clicked
$(document).on("click", "#block-btn", function (event) {
    event.preventDefault();
    var userToBlock = $("#user-to-block").val().trim();

    $.ajax({
        url: `https://www.vlr.gg/user/${userToBlock}`,
        method: "GET",
        success: function (data) {
            if ($(data).find("#profile-header").length) {
                userToBlock = $(data).find("#profile-header").text().trim();
                var blockedUsers = JSON.parse(localStorage.getItem("blocked_users")) || {};
                var blocked = blockedUsers.hasOwnProperty(userToBlock);
                var self = userToBlock === username;

                if (blocked) {
                    alert("User already blocked");
                }
                else if (self) {
                    alert("You cant block yourself!");
                } else {
                    blockedUsers[userToBlock] = "blocked";
                    localStorage.setItem("blocked_users", JSON.stringify(blockedUsers));

                    $("#user-to-block").val("");
                    renderList(blockedUsers);
                }
            }
        },
        error: function () {
            alert("User doesn't exist");
        }
    });
});

// When the unblock button is clicked
$(document).on("click", ".unblock-btn", function () {
    var userToUnblock = $(this).data("user");

    var blockedUsers = JSON.parse(localStorage.getItem("blocked_users")) || {};
    delete blockedUsers[userToUnblock];
    localStorage.setItem("blocked_users", JSON.stringify(blockedUsers));

    renderList(blockedUsers);
});

// Function to render the list of blocked users
function renderList(blockedUsers) {
    var blockedUsersList = $("#blocked_users");
    blockedUsersList.empty();

    for (var user in blockedUsers) {
        var listItem = `
            <li class="wf-module-item" style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
                <a href="/user/${user}">${user}</a>
                <button class="btn mod-action unblock-btn btn" data-user="${user}" style="background-color: #79c38a; width: 50px;">Unblock</button>
            </li>`;
        blockedUsersList.append(listItem);
    }
}

// Function that collapses every .wf-card containing blocked user and adds a button to show the original message
function collapseBlockedCards(blockedUsers) {
    for (var user in blockedUsers) {
        var blockedCards = $(`.wf-card:contains('${user}')`);
        blockedCards.each(function () {
            var postToggle = $(this).find(".js-post-toggle");
            var originalAuthor = $(this).find(".post-header-author").text();
            postToggle.trigger("click");
            changePostHeaderAuthor($(this), originalAuthor);
            addShowPostDiv($(this), originalAuthor);
            $(this).parent().find(".post-header-flag").css("filter", "brightness(0)");
            $(this).parent().find(".post-header-author").text("Blocked User");
        });
    }
}

// Function that changes the .post-header-author element with the original authors username
function changePostHeaderAuthor(blockedCard, originalAuthor) {
    var postHeaderAuthor = blockedCard.find(".post-header-author");
    postHeaderAuthor.text(originalAuthor);
}

// Function that creates show post button
function createShowPostDiv(originalMessage, postToggle, originalAuthor) {
    var showPostDiv = $("<div></div>").addClass("show-post").text("Show Post");
    showPostDiv.css({
        "background-color": "#da626c",
        "padding": "7px",
        "border-radius": "5px",
        "margin-left": "10px",
        "cursor": "pointer"
    });
    showPostDiv.on("click", function () {
        postToggle.trigger("click");
        if (showPostDiv.text() === "Show Post") {
            showPostDiv.text("Hide Post");
            $(this).parent().find(".post-header-flag").css("filter", "brightness(1)");
            $(this).parent().find(".post-header-author").text(originalAuthor);
        } else {
            showPostDiv.text("Show Post");
            $(this).parent().find(".post-header-flag").css("filter", "brightness(0)");
            $(this).parent().find(".post-header-author").text("Blocked User");
        }
    });
    return showPostDiv;
}

// Function that adds the button to show original message
function addShowPostDiv(blockedCard, originalAuthor) {
    var postHeaderChildren = blockedCard.find(".post-header-children");
    var originalMessage = blockedCard.find(".post-body");
    var postToggle = blockedCard.find(".js-post-toggle");
    var showPostDiv = createShowPostDiv(originalMessage, postToggle, originalAuthor);
    postHeaderChildren.after(showPostDiv);
}
