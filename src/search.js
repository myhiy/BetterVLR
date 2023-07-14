$(".wf-card:contains(No matches were found for)").after(`
<div style="color: #666; text-transform: uppercase; font-size: 11px; padding-left: 21px;">
    <span id="possible-results-number"><i class="fa fa-spinner fa-spin"></i></span> possible results 
</div>
<div class="wf-card" style="margin-top: 15px;">
    <div id="possible-results"></div>
</div>`);

$(document).ajaxStop(function () {
    $(".wf-module-item").first().addClass("mod-first");
});

var query = $(".wf-card:contains(No matches were found for) > div > span").text();
query = query.replace(/ /g, "+").replace(".", "");

// Fetch data from the "threads" link
$.get("https://www.vlr.gg/search/threads/", { q: query }, function (data) {
    // Process the data and display the results in #series
    var results = $(data).find(".thread:contains(Matches)").map(function () {
        var href = $(this).find(".thread-item-header-title").attr("href");
        var title = $(this).find(".thread-item-header-title").text();
        var date = $(this).find(".date-eta").text();
        var full_date = $(this).find(".date-full").text().trim();
        var end = title.split("–");
        var teams = end[0].split("vs.");
        var team1 = teams[0].trim();
        var team2 = teams[1].trim();
        var logo1;
        var logo2;


        // Make an AJAX request to the search page for team logo
        $.ajax({
            url: "https://www.vlr.gg/search/",
            data: { q: team1, type: "teams" },
            async: false, // Ensure synchronous execution
            success: function (response) {
                // Extract the team logo image URL from the response
                logo1 = $(response).find(".wf-module-item.search-item img").attr("src");
            },
            error: function () {
                console.log("Error retrieving team logo image.");
            }
        });

        $.ajax({
            url: "https://www.vlr.gg/search/",
            data: { q: team2, type: "teams" },
            async: false, // Ensure synchronous execution
            success: function (response) {
                // Extract the team logo image URL from the response
                logo2 = $(response).find(".wf-module-item.search-item img").attr("src");
            },
            error: function () {
                console.log("Error retrieving team logo image.");
            }
        });


        return `
            <a href="${href}" class="wf-module-item search-item" style="padding: 20px; font-size: 12px;">
                <div style="display: flex; align-items: center; font-size: large; gap: 5px; font-family: auto;">
                    <img src="${logo1}" style="width: 30px;">
                    <span>VS</span>
                    <img src="${logo2}" style="width: 30px;">
                </div>
                <div style="margin-left: 20px;">
                    <div class="search-item-title">${title}</div>
                    <div class="search-item-desc">
                        <span style="font-style: italic;">${date} (${full_date})</span>
                    </div>
                </div>
            </a>`;
    }).get().join("");

    $("#possible-results").html(results);

    // Update the results count
    var possible_results_number = $(data).find(".thread:contains(Matches)").length;
    $("#possible-results-number").text(possible_results_number);
});
