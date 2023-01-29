//SENTINELS LOGO
$("img[src*='owcdn.net/img/62875027c8e06.png']").css("border-radius", "4px");


//OP (ORIGINAL POSTER) BADGE
var OP = $(".post-header-author").first().text();

if ($(".thread-header").is(":visible")) {
    $(".post-header-author:contains('" + OP + "')").after('<span class="badge-pill" title="Original Poster">OP</span>');
}


//TOOLTIPS
tippy("[title]", {
    theme: "translucent",
    content: (reference) => reference.getAttribute("title"),
});

$("[title]").attr("title", "");


//EMBED IMAGE LINKS
let imageLinks = $('.post-body').find('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]');

$(document).ready(function () {
    $.each($('.post-body').find('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]'), function (index, element) {
        var imgSrc = $(this).attr('href');
        $(this).parent().after('<img src="' + imgSrc + '" href="' + imgSrc + '" style="border-radius: 5px; max-width: 500px;"/>');
    });
});
//image lightbox
$(document).ready(function () {
    $('.post-body img').magnificPopup({
        type: 'image',
        showCloseBtn: false
    });
});


//EMBED TWEETS/TWITTER LINKS
$('.post-body').each(function () {
    var $postBody = $(this);

    $postBody.find('a').each(function () {
        var $link = $(this);
        var tweetUrl = $link.attr('href');

        if (tweetUrl.indexOf('twitter.com') !== -1) {
            $.ajax({
                url: 'https://noembed.com/embed?url=' + tweetUrl,
                dataType: 'json',
                success: function (data) {
                    $link.replaceWith(data.html);
                }
            });
        }
    });
});