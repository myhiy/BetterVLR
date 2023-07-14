import { delegate, roundArrow } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/translucent.css";
import "tippy.js/dist/svg-arrow.css";
import "magnific-popup/dist/jquery.magnific-popup.js";
import "magnific-popup/dist/magnific-popup.css";
import "inline-attachment/src/inline-attachment.js"
import "inline-attachment/src/jquery.inline-attachment.js"
import "./map-win-percentage.js";
import "./settings.js";
import "./embed-links.js";
import "./user-block.js";
import "./settings-options.js";
import "./emojis.js";
import "./search.js";
import "./past-players.js";
import "./profile-page.js";
import "./textarea-images.js";
import "./polls.js";


// ANCHOR OP badge
const original_poster = $(".post-header-author").first().text();

if ($(".thread-header").is(":visible")) {
    $(`.post-header-author:contains(${original_poster})`).after(`<div class="badge-pill" title="Original Poster">OP</div>`);
}


// ANCHOR Add tooltips to specified elements
$(".thread-item-header-title, .select2-selection__rendered").removeAttr("title");

delegate(document.body, {
    target: `[title]:not([title=""]):not(iframe)`,
    content: (reference) => {
        const title = reference.getAttribute("title");
        reference.setAttribute("title", "");
        return title;
    },
    theme: "translucent",
    arrow: roundArrow,
    allowHTML: true
});


// ANCHOR Highlight hovered teams in the bracket
$(".bracket-item-team-name").hover(function () {
    const team_name = $(this).text().trim();
    if (team_name !== "") {
        $(`.bracket-item-team-name:contains("${team_name}")`).parent().css({
            "background-color": "steelblue",
            "color": "#333",
            "font-weight": "700",
        });
    }
}, function () {
    const team_name = $(this).text().trim();
    if (team_name !== "") {
        $(`.bracket-item-team-name:contains("${team_name}")`).parent().css({
            "background-color": "",
            "color": "",
            "font-weight": "",
        });
    }
});


// ANCHOR Show BetterVLR changelog under recent discussions
$.get("https://snippet.host/wfrgud/raw", function (data) {
    $(".js-home-threads").after(data);
    $(".bettervlr-unread").each(function () {
        const version = $(this).text().replace(/\s+/g, " ").trim();
        const changelog_read = JSON.parse(localStorage.getItem("changelog_read")) || {};
        if (changelog_read[version]) {
            $(this).removeClass("bettervlr-unread");
        } else {
            $(this).on("click", function () {
                $(this).removeClass("bettervlr-unread");
                changelog_read[version] = "read";
                localStorage.setItem("changelog_read", JSON.stringify(changelog_read));
            });
        }
    });
});


// ANCHOR Search flairs and make them bigger on hover
if (window.location.href.startsWith("https://www.vlr.gg/settings/flair")) {
    $(".form-label:first").before(`<input id="flairs" type="text" placeholder="Search...">`);

    $("input#flairs").on("input", function () {
        var text = $(this).val().trim().toLowerCase();
        $(".form-label:not(:last)").next().children().filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(text) > -1)
        });

        $(".form-label").each(function () {
            if ($(this).next().children().children(":visible").length < 1) {
                $(this).hide();
                $(this).next().css("margin-bottom", "0px");
            } else {
                $(this).show();
                $(this).next().css("margin-bottom", "10px");
            }
        });
    });

    $("label").each(function () {
        var src = $(this).find("img").attr("src");
        $(this).attr("title", `<img src="${src}" style="width: 100%; max-width: 100px;">`);
    });
}


// ANCHOR Magnific Popup defaults
$.extend(true, $.magnificPopup.defaults, {
    tClose: "",
    gallery: {
        tPrev: "",
        tNext: ""
    }
});


// ANCHOR Sort posts
$(".btn.mod-page.mod-to-bottom").parent().prev().css({ "flex": "1", "white-space": "nowrap" }).append(`
<div class="wf-label comments-label" style="margin-right: 12px; padding: 0;">Sort by:</div>
<select id="sort-posts" style="margin: 0px; min-width: 0px;">
    <option value="default">Default</option>
    <option value="upvotes">Upvotes</option>
    <option value="comments">Comments</option>
</select>`);

if (window.location.search.includes("?view=linear")) {
    $(`#sort-posts option[value="comments"]`).remove();
}

$("#sort-posts").change(function () {
    var selected_option = $(this).val();
    var posts_container = $(".post-container");
    var posts = posts_container.find(".threading:not(.threading .threading):not(:first)");

    // sort posts based on the selected option
    if (selected_option === "upvotes") {
        posts.sort(function (a, b) {
            var upvotes_a = parseInt($(a).find(".post-frag-count").text().trim());
            var upvotes_b = parseInt($(b).find(".post-frag-count").text().trim());
            return upvotes_b - upvotes_a;
        });
    } else if (selected_option === "comments") {
        posts.sort(function (a, b) {
            var comments_a = $(a).find(".threading").length;
            var comments_b = $(b).find(".threading").length;
            return comments_b - comments_a;
        });
    } else if (selected_option === "default") {
        location.reload();
    }

    // reorder posts in the container
    posts.detach().appendTo(posts_container);
});
