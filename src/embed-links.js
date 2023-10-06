import { parseTwemojis } from "./emojis.js";

const post_images = ".post-image, .tweet-pic";
$(document).one("click", post_images, function () {
    $(".post-body").each(function () {
        $(this).find(post_images).magnificPopup({
            type: "image",
            showCloseBtn: false,
            gallery: {
                enabled: true,
                navigateByImgClick: false
            }
        });
    });
    // open clicked image
    $(this).trigger("click");
});


// convert image links to embedded images in posts
$(".post-body").find("a").each(function () {
    const img_src = this.href;
    $(this).parent().append(`<img class="post-image" style="display:none" src="${img_src}" href="${img_src}" onload="$(this).show();">`);
});

// twitter
const twitter = `.post-body a[href*="twitter.com"], .post-body a[href*="x.com"]`

function formatDate(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM"; //AM or PM
    hours = hours % 12;
    hours = hours ? hours : 12;
    const month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = month_names[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + ampm + " · " + month + " " + day + ", " + year;
}

function getBestVideoVariant(variants) {
    // Choose the best video variant
    let best_variant = null;
    let highest_bitrate = 0;

    for (let i = 0; i < variants.length; i++) {
        let variant = variants[i];
        if (variant.bitrate && variant.bitrate > highest_bitrate) {
            highest_bitrate = variant.bitrate;
            best_variant = variant;
        }
    }

    return best_variant;
}

$(twitter).each(function () {
    const tweet_link = this.href;
    const tweet_id = tweet_link.match(/\/status\/(\d+)/);
    if (tweet_id) {
        $(this).after(`<div class="custom-embed placeholder twitter"></div>`);
    }

    $(twitter).css("margin-bottom", "0px");
});

// Check if cached data exists
function getCachedTweet(key) {
    const cached_tweet = sessionStorage.getItem(key);
    if (cached_tweet) {
        const { tweet_data } = JSON.parse(cached_tweet);
        return tweet_data;
    }
    return null;
}

// Cache data
function cacheTweet(key, tweet_data) {
    const cache_object = { tweet_data };
    sessionStorage.setItem(key, JSON.stringify(cache_object));
}

$(twitter).each(function () {
    const anchor_tag = this;
    const tweet_link = this.href;
    const tweet_id = tweet_link.match(/\/status\/(\d+)/);
    if (tweet_id) {
        const cache_key = `twitter_cache_${tweet_id[1]}`;
        const cached_tweet = getCachedTweet(cache_key);

        if (cached_tweet) {
            // Use cached data
            renderTweet(cached_tweet, anchor_tag);
        } else {
            $.ajax({
                url: "https://muddy-brook-3061.fly.dev/" + tweet_id[1],
                type: "POST",
                success: function (response) {
                    const tweet_data = response.tweet;
                    // Cache the fetched data
                    cacheTweet(cache_key, tweet_data);
                    renderTweet(tweet_data, anchor_tag);
                },
                error: function (error) {
                    console.error("Error fetching tweet data", error);
                }
            });
        }
    }
});

function renderTweet(tweet, anchor_tag) {
    if (tweet.all.__typename === "TweetTombstone") {
        //Tweet not found
        const tweet_embed = `
        <div class="custom-embed twitter">
            <div class="tweet-content">
                <p class="tweet-text">Hmm...this page doesn't exist. Try searching for something else.</p>
                </div>
            </div>
        </div>`;
        $(anchor_tag).next().replaceWith(tweet_embed);
        return;
    }

    const checkmark = {
        blue: `<svg class="checkmark" viewBox="0 0 22 22" aria-label="Verified account" role="img" data-testid="icon-verified"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="rgb(29, 155, 240)"></path></g></svg>`,
        business: `<svg class="checkmark" viewBox="0 0 22 22" aria-label="Verified account" role="img" data-testid="icon-verified"><g><linearGradient gradientUnits="userSpaceOnUse" id="1-a" x1="4.411" x2="18.083" y1="2.495" y2="21.508"><stop offset="0" stop-color="#f4e72a"></stop><stop offset=".539" stop-color="#cd8105"></stop><stop offset=".68" stop-color="#cb7b00"></stop><stop offset="1" stop-color="#f4ec26"></stop><stop offset="1" stop-color="#f4e72a"></stop></linearGradient><linearGradient gradientUnits="userSpaceOnUse" id="1-b" x1="5.355" x2="16.361" y1="3.395" y2="19.133"><stop offset="0" stop-color="#f9e87f"></stop><stop offset=".406" stop-color="#e2b719"></stop><stop offset=".989" stop-color="#e2b719"></stop></linearGradient><g clip-rule="evenodd" fill-rule="evenodd"><path d="M13.324 3.848L11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575l3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill="url(#1-a)"></path><path d="M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill="url(#1-b)"></path><path d="M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z" fill="#d18800"></path></g></g></svg>`
    };

    let verified = "";
    if (tweet.all.user.verified_type === "Business") {
        verified = checkmark.business;
    } else {
        verified = checkmark.blue;
    }

    let media = "";
    if (tweet.images.length === 1) {
        media = `<img class="tweet-pic" src="${tweet.images[0]}" href="${tweet.images[0]}" alt="Tweet Image">`;
    } else if (tweet.images.length > 1) {
        media = `<div class="tweet-image-grid">`;
        tweet.images.forEach(image => {
            media += `<img class="tweet-pic grid" src="${image}" href="${image}" alt="Tweet Image">`;
        });
        media += `</div>`;
    }

    // Handle video embedding and image aspect ratio
    if (tweet.video && tweet.all.video.contentType != "gif") {
        media = `
        <div class="embed-video">
            <img src="${tweet.images}">
            <div class="embed-video-actions">
                <div class="center-content">
                    <i class="icon fa fa-play-circle fa-5x" aria-hidden="true"></i>
                </div>
            </div>
        </div>`;
    } else if (tweet.video && tweet.all.video.contentType === "gif") {
        media = `<video loop autoplay muted><source src="${tweet.video[0].src}" type="video/mp4"></video>`;
    }

    let card = "";
    if (tweet.all.card) {
        card = `
            <div class="tweet-card">
                <img src="${tweet.all.card.binding_values.thumbnail_image.image_value.url}">
                <div>
                    <p>${tweet.all.card.binding_values.vanity_url.string_value}</p>
                    <h1>${tweet.all.card.binding_values.title.string_value}</h1>
                    <p>${tweet.all.card.binding_values.description.string_value}</p>
                </div>
            </div>`;
    }

    let quoted = "";
    if (tweet.all.quoted_tweet) {
        // Handle quoted tweet
        const quote_link = `https://twitter.com/${tweet.all.quoted_tweet.user.screen_name}/status/${tweet.all.quoted_tweet.id_str}`;
        quoted = `
        <div class="tweet-quote">
            <a href="${quote_link}" target="_blank">
                <img class="profile-pic quote" src="${tweet.all.quoted_tweet.user.profile_image_url_https}" alt="Avatar">
                <h1>${tweet.all.quoted_tweet.user.name}</h1>
                <p>@${tweet.all.quoted_tweet.user.screen_name}</p>
                <p>·</p>
                <p>${formatDate(new Date(tweet.all.quoted_tweet.created_at))}</p>
            </a>
            <a href="${quote_link}" target="_blank">
                ${tweet.all.quoted_tweet.text ? `<p>${tweet.all.quoted_tweet.text}</p>` : ""}
            </a>
            ${tweet.all.quoted_tweet.mediaDetails ? `<img src="${tweet.all.quoted_tweet.mediaDetails[0].media_url_https}">` : ""}
        </div>`;
    }

    const tweet_embed = `
        <div class="custom-embed twitter">
            <div class="user-info">
                <img class="profile-pic" src="${tweet.avatar}" alt="Avatar">
                <div>
                    <h1 class="name">${tweet.name} ${verified}</h1>
                    <h1 class="username">@${tweet.username}</h1>
                </div>
            </div>
            <div class="tweet-content">
                <p class="tweet-text">${tweet.text}</p>
                <div>${media} ${card} ${quoted}</div>
                <p class="timestamp">${formatDate(new Date(tweet.all.created_at))}</p>
                <div class="tweet-footer">
                    <div>
                        <i class="fa fa-comment-o" aria-hidden="true"></i>
                        <p class="replies">${tweet.replies}</p>
                    </div>
                    <div>
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                        <p class="likes">${tweet.likes}</p>
                    </div>
                </div>
            </div>
        </div>`;

    // Replace the placeholder with tweet
    $(anchor_tag).next().replaceWith(tweet_embed);

    // Render Twemojis
    parseTwemojis(".tweet-text, .user-info");

    //video
    $(anchor_tag).next().find(".embed-video").one("click", function () {
        const video = getBestVideoVariant(tweet.all.mediaDetails[0].video_info.variants);
        $(this).html(`<video controls autoplay><source src="${video.url}" type="video/mp4"></video>`);
    });

    //aspect-ratio
    if (tweet.images.length === 2) {
        $(anchor_tag).next().find(".tweet-pic").css("aspect-ratio", "0.875 / 1");
    }

    if (tweet.images.length === 3) {
        $(anchor_tag).next().find(".tweet-pic:first").css("aspect-ratio", "0.882353 / 1");
        $(anchor_tag).next().find(".tweet-pic:first").css("grid-area", "span 2 / span 1 / span 2 / span 1");
        $(anchor_tag).next().find(".tweet-pic").not(":first").css("aspect-ratio", "1.78571 / 1");
    }

    if (tweet.images.length === 4) {
        $(anchor_tag).next().find(".tweet-pic").css("aspect-ratio", "2/1");
    }

    //not working
    if (tweet.all.display_text_range[1] > 279) {
        console.log("280");
        $(".tweet-text").append(" " + `<a href="${anchor_tag.href}" target="_blank">Show More</a>`);
    }
}

// youtube
const yt = `.post-body a[href*="youtube.com"], .post-body a[href*="youtu.be"]`

$(yt).each(function () {
    const video = this.href;
    const id = video.match(/v=([^&]+)/);
    const id_share = video.match(/youtu\.be\/([^?]+)/);
    const id_shorts = video.match(/shorts\/([^?]+)/);

    if (id || id_share || id_shorts) {
        $(this).after(`<div class="custom-embed placeholder yt"></div>`);
    }

    $(yt).css("margin-bottom", "0px");
});

$(yt).each(function () {
    const link = this;
    const video = this.href;
    const id = video.match(/v=([^&]+)/);
    const id_share = video.match(/youtu\.be\/([^?]+)/);
    const id_shorts = video.match(/shorts\/([^&]+)/);

    if (id || id_share || id_shorts) {
        const video_id = id ? id[1] : id_share[1];
        const url = "https://youtube.com/oembed?url=https://www.youtube.com/watch?v=" + video_id;
        const image = `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`;
        $.ajax({
            url: url,
            success: function (data) {
                const yt_embed = `
                <div class="custom-embed yt">
                    <div class="user-info">
                        <div>
                            <h1 class="name"><a href="${data.author_url}">${data.author_name}</a></h1>
                            <br/>
                            <h1 class="name"><a href="${video}">${data.title}</a></h1>
                        </div>
                    </div>
                    <div class="embed-video">
                        <img src="${image}">
                        <div class="embed-video-actions">
                            <div class="center-content">
                                <i class="icon fa fa-play-circle fa-5x" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </div>`;

                $(link).next().replaceWith(yt_embed);

                $(link).next().find(".embed-video").one("click", function () {
                    $(this).html(`<iframe src="https://www.youtube.com/embed/${video_id}?autoplay=1" allowfullscreen></iframe>`);
                });
            },
            error: function (jqXHR) {
                // Check if the response status code is 401 (Unauthorized))
                if (jqXHR.status === 401) {
                    const yt_embed = `
                    <div class="custom-embed yt">
                        <div class="embed-video">
                            <iframe src="https://www.youtube.com/embed/${video_id}"></iframe>
                        </div>
                    </div>`;
                    $(link).next().replaceWith(yt_embed);
                }
            }
        });
    }
});
