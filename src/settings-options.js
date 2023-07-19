// Function to hide or show elements based on checkbox values
function applySettings() {
    var settings = JSON.parse(localStorage.getItem("settings")) || {};
    var hide_flags = settings.hide_flags;
    var hide_stars = settings.hide_stars;
    var esports_mode = settings.esports_mode;
    var sticky_header = settings.sticky_header;
    var hide_match_comments = settings.hide_match_comments;
    var hide_live_streams = settings.hide_live_streams;
    var hide_stickied_threads = settings.hide_stickied_threads;
    var hide_recent_discussions = settings.hide_recent_discussions;
    var imgur_proxy = settings.imgur_proxy;


    if (hide_flags) {
        $(".post-header-flag").hide();
        $(".post-header-num").css("margin-right", "6px");
    }

    if (hide_stars) {
        $(".post-header-stars").hide();
    }

    if (esports_mode) {
        $(".js-home-stickied").replaceWith($(".js-home-matches-completed"));
        $(".js-home-threads").hide();
        $(".js-home-events").find("h1:contains(completed)").next().addBack().insertAfter(".js-home-matches-upcoming");
    }

    if (sticky_header) {
        $(".header").css({
            "position": "sticky",
            "top": "0"
        });
    }

    if (hide_match_comments && ($(".match-header").length)) {
        $(".post-container, form:has(.post-editor)").prev().addBack().hide();
    }

    if (hide_live_streams) {
        $(".js-home-streams .mod-sidebar:not(:has(.mod-color))").not("h1").hide();
    }

    if (hide_stickied_threads) {
        $(".js-home-stickied").hide();
    }

    if (hide_recent_discussions) {
        $(".js-home-threads").hide();
    }

    if (imgur_proxy) {
        setTimeout(function () {
            $("img").each(function () {
                var src = $(this).attr("src");
                if (src.includes("imgur.com")) {
                    var proxy_src = src.replace("imgur.com", "imgurp.com");
                    $(this).attr("src", proxy_src);

                    var href = $(this).attr("href");
                    if (href) {
                        $(this).attr("href", proxy_src);
                    }
                }
            });
        }, 0);
    }
}

// Function to save checkbox value in localstorage
function saveCheckboxValue(checkbox_id) {
    var settings = JSON.parse(localStorage.getItem("settings")) || {};
    settings[checkbox_id] = $("#" + checkbox_id).is(":checked");
    localStorage.setItem("settings", JSON.stringify(settings));

    applySettings(); // Update visibility after saving checkbox value
}

// Function to load checkbox values from localstorage
function loadCheckboxValues() {
    var settings = JSON.parse(localStorage.getItem("settings")) || {};
    $("#hide_flags").prop("checked", settings.hide_flags);
    $("#hide_stars").prop("checked", settings.hide_stars);
    $("#esports_mode").prop("checked", settings.esports_mode);
    $("#sticky_header").prop("checked", settings.sticky_header);
    $("#match_comments").prop("checked", settings.hide_match_comments);
    $("#live_streams").prop("checked", settings.hide_live_streams);
    $("#stickied_threads").prop("checked", settings.hide_stickied_threads);
    $("#recent_discussions").prop("checked", settings.hide_recent_discussions);
    $("#imgur_proxy").prop("checked", settings.imgur_proxy);
}

// Event listener for checkboxes
$(`.wf-card input[type="checkbox"]`).on("change", function () {
    var checkbox_id = $(this).attr("id");
    saveCheckboxValue(checkbox_id);
});

// Load checkbox values from localstorage
$(document).ready(function () {
    loadCheckboxValues();
    applySettings();
});
