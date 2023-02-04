//SENTINELS LOGO
$("img[src*='owcdn.net/img/62875027c8e06.png']").css("border-radius", "4px");


//TOOLTIPS
$(document).ready(function () {
    tippy("[title]", {
        theme: "translucent",
        content: (reference) => reference.getAttribute("title"),
    });

    $("[title]").attr("title", "");
});


//OP (ORIGINAL POSTER) BADGE
var OP = $(".post-header-author").first().text();

if ($(".thread-header").is(":visible")) {
    $(".post-header-author:contains('" + OP + "')").after('<span class="badge-pill" title="Original Poster">OP</span>');
}


//EMBED IMAGE LINKS
let imageLinks = 'a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]';
//embed images in posts
$(document).ready(function () {
    $.each($('.post-body').find(imageLinks), function (index, element) {
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

        if (tweetUrl.indexOf('twitter.com') !== -1 && tweetUrl.indexOf('/status/') !== -1) {
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


//VCT HEADER DROPDOWN
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


//BETTERVLR VERSIONS UNDER RECENT DISCUSSIONS
$(".js-home-threads").after(`<a href="https://github.com/myhiy/BetterVLR" target="_blank" class="wf-label mod-sidebar">BetterVLR</a>
<div class="wf-card mod-dark mod-sidebar better-vlr-sidebar">
    <a href="https://www.vlr.gg/169891/bettervlr-update" class="wf-module-item mod-disc" style="box-shadow: inset 0 0 20px #da626c;">
        <div class="module-item-title">BetterVLR Update</div>
        <div class="module-item-count">0.0.3</div>
    </a>
    <a href="https://www.vlr.gg/169520/bettervlr-update" class="wf-module-item mod-disc" style="box-shadow: inset 0 0 20px #da626c;">
        <div class="module-item-title">BetterVLR Update</div>
        <div class="module-item-count">0.0.2</div>
    </a>
    <a href="https://www.vlr.gg/169218/bettervlr" class="wf-module-item mod-disc" style="box-shadow: inset 0 0 20px #da626c;">
        <div class="module-item-title">BetterVLR</div>
        <div class="module-item-count">RELEASE</div>
    </a>
</div>`);
$(".better-vlr-sidebar > .wf-module-item:first").addClass("mod-first");
