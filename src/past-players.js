$(".wf-label.mod-large:contains(Current	Roster)").addClass("active").after(`<h2 class="wf-label mod-large">Past Players</h2>`);
$(".wf-label.mod-large:contains(Current	Roster)").next().addBack().wrapAll(`<div class="rosters">`);

var current_roster = $(".rosters").next().html();

$("body").on("click", ".rosters > h2", function () {
  $(".rosters > h2").removeClass("active");
  $(this).addClass("active");

  if ($(this).text() === "Past Players") {
    $(this).parent().next().html(`<div id="past-players">${current_roster}</div>`);

    // Extract team ID and name from the current URL
    var url = window.location.href;
    var team_id = url.match(/team\/(\d+)\//)[1];
    var team_name = url.match(/team\/\d+\/([^/]+)/)[1];

    // Construct the modified URL for the AJAX request
    var transactions_url = `https://www.vlr.gg/team/transactions/${team_id}/${team_name}`;

    // Make the AJAX request
    $.ajax({
      url: transactions_url,
      method: "GET",
      success: function (response) {
        var players = `
        <div class="wf-module-label" style="margin-bottom: 12px;">players</div>
        <div style="display: flex; flex-wrap: wrap;">`;

        var staff = `
        <div class="wf-module-label" style="margin-bottom: 12px;">staff</div>
        <div style="display: flex; flex-wrap: wrap;">`;

        $(response).find(".txn-item").each(function () {
          var role = $(this).find("td:nth-child(5)").text().trim();

          if ((role === "Player" || role === "Stand-in") && $(this).children(".txn-item-action").hasClass("mod-leave")) {
            var href = $(this).find("td:nth-child(4) > div > a").attr("href");
            var name = $(this).find("td:nth-child(4) > div > a").text().trim();
            var real_name = $(this).find("td:nth-child(4) > div > .ge-text-light").text().trim();
            var flag = $(this).find("td:nth-child(3) > .flag").attr("class");

            players += `
            <div class="team-roster-item">
              <a href="${href}" style="display: flex;">
                <div class="team-roster-item-img">
                  <img src="https://www.vlr.gg/img/base/ph/sil.png">
                </div>
                <div class="team-roster-item-name">
                  <div class="team-roster-item-name-alias">
                    <i class="${flag}" style="vertical-align: -4px;"></i>${name} </div>
                  <div class="team-roster-item-name-real">${real_name}</div>
                  <div class="wf-tag mod-light team-roster-item-name-role">${role}</div>
                </div>
              </a>
            </div>`;

          } else if ($(this).children(".txn-item-action").hasClass("mod-leave")) {
            var href = $(this).find("td:nth-child(4) > div > a").attr("href");
            var name = $(this).find("td:nth-child(4) > div > a").text().trim();
            var real_name = $(this).find("td:nth-child(4) > div > .ge-text-light").text().trim();
            var flag = $(this).find("td:nth-child(3) > .flag").attr("class");

            staff += `
            <div class="team-roster-item">
              <a href="${href}" style="display: flex;">
                <div class="team-roster-item-img">
                  <img src="https://www.vlr.gg/img/base/ph/sil.png">
                </div>
                <div class="team-roster-item-name">
                  <div class="team-roster-item-name-alias">
                    <i class="${flag}" style="vertical-align: -4px;"></i>${name} </div>
                  <div class="team-roster-item-name-real">${real_name}</div>
                  <div class="wf-tag mod-light team-roster-item-name-role">${role}</div>
                </div>
              </a>
            </div>`;
          }
        });

        players = players + "</div>";
        staff = staff + "</div>";

        var past_players = players + staff;

        // Append the modified HTML to the #past-players element
        $("#past-players").html(past_players);
      },
      error: function (error) {
        console.log("Error:", error);
      }
    });
  } else {
    $(this).parent().next().html(current_roster);
  }
});
