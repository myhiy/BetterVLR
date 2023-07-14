// convert image links to embedded images in posts
const image_links = `a[href$=".jpg"], a[href*=".jpg?"], a[href$=".jpeg"], a[href*=".jpeg?"], a[href$=".png"], a[href*=".png?"], a[href$=".gif"], a[href*=".gif?"]`;

$(document).ready(function () {
    $(".post-body").find(image_links).each(function () {
        const img_src = $(this).attr("href");
        $(this).parent().append(`<img src="${img_src}" href="${img_src}" onerror="$(this).hide();">`);
    });
});


// Make image lightbox work for images in articles
$(".article-body > p > img").each(function () {
    const src = $(this).attr("src");
    $(this).attr("href", src);
});

// Image lightbox for articles
$(".article-body > p > img").magnificPopup({
    type: "image",
    showCloseBtn: false,
    gallery: {
        enabled: true,
        navigateByImgClick: false
    }
}).css("cursor", "pointer");

// Image lightbox for posts
setTimeout(() => {
    $(".post-body").each(function () {
        $(this).find("img:not(.emoji):not(.custom-emoji)").magnificPopup({
            type: "image",
            showCloseBtn: false,
            gallery: {
                enabled: true,
                navigateByImgClick: false
            }
        });
    });
}, 500);


// embed tweets and twitter links in posts
$(`.post-body a[href*="twitter.com"]`).each(function () {
    const link = $(this);
    let tweet_url = link.attr("href");
    tweet_url = tweet_url.split("/photo")[0];
    tweet_url = tweet_url.replace(/\/$/, "");

    $.ajax({
        url: `https://publish.twitter.com/oembed?url=${tweet_url}`,
        dataType: "jsonp",
        success: function (data) {
            const html = $(data.html).attr({ "data-theme": "dark", "data-width": "500", "data-tweet-limit": "1" });
            link.parent().append(html);
        }
    });
});

// embed imgur (not direct) links in posts
$(`.post-body a[href*="imgur.com"]`).not(image_links).each(function () {
    const link = $(this);
    const imgur_url = link.attr("href");

    $.ajax({
        url: `https://api.imgur.com/oembed?url=${imgur_url}`,
        data_type: "json",
        success: function (data) {
            const html = $(data.html);
            link.parent().append(html);
        }
    });
});

// embed twitch clips in posts
$(`.post-body a[href*="twitch.tv"]`).each(function () {
    const link = $(this);
    const clip_url = link.attr("href");
    let clip_id = clip_url.match(/clip\/([^/?]+)/) || clip_url.match(/clips\.twitch\.tv\/([^/?]+)/);

    if (clip_id !== null) {
        clip_id = clip_id[1];
        const html = $(`<iframe src="https://clips.twitch.tv/embed?clip=${clip_id}&parent=www.vlr.gg" allowfullscreen scrolling="no"</iframe>`);
        html.css({
            "width": "100%",
            "height": "100%",
            "max-width": "700px",
            "aspect-ratio": "16/9",
            "margin-top": "5px",
        });
        link.parent().append(html);
    }
});

// embed youtube links in posts
$(`.post-body a[href*="youtube.com"], .post-body a[href*="youtu.be"]`).each(function () {
    const link = $(this);
    const youtube_url = link.attr("href");

    $.ajax({
        url: `https://youtube.com/oembed?url=${youtube_url}`,
        data_type: "json",
        success: function (data) {
            const html = $(data.html);
            html.css({
                "width": "100%",
                "height": "100%",
                "max-width": "700px",
                "aspect-ratio": "16/9",
                "margin-top": "5px",
            });
            link.parent().append(html);
        }
    });
});
