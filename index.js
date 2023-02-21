// Get the username from the header link
var username = $(".header-nav-item.mod-user").attr("href").split("/user/")[1];


// Sentinels logo
$("img[src*='owcdn.net/img/62875027c8e06.png']").css("border-radius", "3px");


// Add tooltips
$(document).ready(function () {
    tippy("[title]", {
        theme: "translucent",
        content: (reference) => reference.getAttribute("title"),
    });

    $("[title]").attr("title", "");
});


// Add an OP badge to the original poster of a thread
var OP = $(".post-header-author").first().text();

if ($(".thread-header").is(":visible")) {
    $(".post-header-author:contains('" + OP + "')").after(`<span class="badge-pill" title="Original Poster">OP</span>`);
}


// Define the image links to look for
var image_links = 'a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]';
// Embed images in posts after the link
$(document).ready(function () {
    $.each($('.post-body').find(image_links), function (index, element) {
        var img_src = $(this).attr('href');
        $(this).parent().after(`<img src="${img_src}" href="${img_src}" style="border-radius: 5px; max-width: 500px;"/>`);
    });
});
// Add a lightbox to the images
$(document).ready(function () {
    $('.post-body img').magnificPopup({
        type: 'image',
        showCloseBtn: false
    });
});


// Embed tweet/twitter links in posts
$('.post-body').each(function () {
    var post_body = $(this);
    post_body.find('a').each(function () {
        var link = $(this);
        var tweet_url = link.attr('href');

        if (tweet_url.indexOf('twitter.com') !== -1 && tweet_url.indexOf('/status/') !== -1) {
            $.ajax({
                url: 'https://noembed.com/embed?url=' + tweet_url,
                dataType: 'json',
                success: function (data) {
                    link.replaceWith(data.html);
                }
            });
        }
    });
});


// Add a VCT dropdown to the header
$(".header-nav-item.mod-stats.mod-vlr").next().after(`<a class="header-nav-item mod-stats mod-vct" style="position: relative;"> VCT </a>
<div class="header-div"></div>`);

tippy('.header-nav-item.mod-stats.mod-vct', {
    content: `<a href="https://www.vlr.gg/vct-2023"><img class="vct2023" src="https://i.imgur.com/2dqrmN2.png"></a>
    <a href="https://www.vlr.gg/vct-2022"><img class="vct2022" src="https://i.imgur.com/wiQInjN.png"></a>
    <a href="https://www.vlr.gg/vct-2021"><img class="vct2021" src="https://i.imgur.com/bgkt9iS.png"></a>`,
    allowHTML: true,
    interactive: true,
    placement: "bottom",
    interactiveBorder: 20,
    hideOnClick: false
});


$.get("https://snippet.host/wfrgud/raw", function (data) {
    $(".js-home-threads").after(data);
    $(".bettervlr-unread").each(function () {
        var version = $(this).text().replace(/\s+/g, " ").trim();
        var changelog_read = JSON.parse(localStorage.getItem("changelog_read")) || {};
        localStorage.setItem("changelog_read", JSON.stringify(changelog_read));
        if (changelog_read[version]) {
            $(this).removeClass("bettervlr-unread");
        }
        else {
            $(this).on("click", function () {
                $(this).removeClass("bettervlr-unread");
                changelog_read[version] = "read";
                localStorage.setItem("changelog_read", JSON.stringify(changelog_read));
            });
        }
    });
});





if (window.location.href === "https://www.vlr.gg/settings") {
    $(document).ready(function () {
        // Add buttons
        var buttons = $(`<div id="button-wrapper">
        <button id="vlr-button">VLR</button>
        <button id="better-vlr-button">BetterVLR</button>
        <button id="blocked-users-button">Blocked Users</button>
        <button id="saved-posts-button">Saved Posts</button>
        </div>`);
        $('form:last').before(buttons);

        // Add test div
        var bettervlr_settings = $('<div id="bettervlr-settings" style="display:none;">Test1</div>');
        var blocked_users_settings = $(`<div class="wf-card mod-form mod-dark" id="blocked-users-settings" style="display:none;"><form>
         <div class="form-section" style="margin-top: 0;">Block Users</div><div style="display: flex; justify-content: space-between;">
           <input type="text" id="user-to-block" placeholder="USER TO BLOCK">
           <div id="block-btn" class="btn mod-action" style="background-color: #d04e59; width: 50px; margin-right: 570px; text-align: center;">Block</div>
         </div>
        
         <ul id="blocked_users">
        
         </ul></form>
         </div>`);
        var saved_posts_settings = $('<div id="saved-posts-settings" style="display:none;">Test3</div>');
        $('form:last').after(bettervlr_settings, blocked_users_settings, saved_posts_settings);

        // Button click handlers
        $('#vlr-button').on('click', function () {
            $('form:last').show();
            $('#bettervlr-settings, #blocked-users-settings, #saved-posts-settings').hide();
        });
        $('#better-vlr-button').on('click', function () {
            $('form:last, #blocked-users-settings, #saved-posts-settings').hide();
            $('#bettervlr-settings').show();
        });
        $('#blocked-users-button').on('click', function () {
            $('form:last, #bettervlr-settings, #saved-posts-settings').hide();
            $('#blocked-users-settings').show();
        });
        $('#saved-posts-button').on('click', function () {
            $('form:last, #bettervlr-settings, #blocked-users-settings').hide();
            $('#saved-posts-settings').show();
        });
    });
}


// When the form is submitted
$(document).on("submit", "#block-btn", function (event) {
    // Prevent the page from reloading
    event.preventDefault();
});