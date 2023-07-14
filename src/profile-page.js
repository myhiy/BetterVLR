if (window.location.href.startsWith("https://www.vlr.gg/user/")) {
    $(".post-body").each(function () {
        // Get the existing href value
        var current_href = $(this).parent().find("a:first").attr("href");

        // Get the text of the element
        var text = $(this).text().trim();
        var encoded_text = encodeURIComponent(text);

        $(this).find(".emoji").each(function () {
            var emoji = $(this).attr("alt");
            encoded_text = encoded_text + emoji;
        });

        // Get the author from the #profile-header element
        var author = $("#profile-header").text().trim();
        var encoded_author = encodeURIComponent(author);

        // Generate the new href value by appending query parameters for author and text
        var new_href = current_href + "?author=" + encoded_author + "&text=" + encoded_text;

        // Set the new href value
        $(this).after(`<a style="font-size: 12px; font-weight: 500; position: absolute; right: 20px;">GO TO COMMENT</a>`);

        $(this).next().attr("href", new_href);

        console.log(encoded_text);
    });
}

$(document).ready(function () {
    // Get the query parameters from the URL
    const current_url = window.location.search;
    const query = new URLSearchParams(current_url);
    const author = decodeURIComponent(query.get("author"));
    const text = decodeURIComponent(query.get("text"));

    // Find the .post-body element that contains the query text and author
    const post_body = $(".post-body").filter(function () {
        return $(this).text().trim() === text && $(this).parent().find(".post-header-author").text().trim() === author;
    });

    // Check if a matching .post-body element was found
    if (post_body.length > 0) {
        // Get the ID of the corresponding post-anchor
        const anchor = post_body.parent().find(".post-anchor").attr("id");

        // Remove the query parameters from the URL
        const url = window.location.href.replace(current_url, "");

        // Set the URL to the current URL without the query parameters and anchor to the corresponding post-anchor
        window.location.href = url + "#" + anchor;
    }
});
