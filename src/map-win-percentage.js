$(document).ready(function () {
    if ($(".match-header").length) {
        $("head").prepend(`<link rel="stylesheet" type="text/css" href="https://www.vlr.gg/css/base/pages/team_stats_vlr.css">`);
        $(`<div class="wf-label" style="margin: 22px 0 0 0;" id="maps_winrate">Map winrate percentage</div>
        <div style="display: flex;" id="maps_winrate_table">
        <div class="wf-card mod-dark mod-first match-histories" id="maps_winrate_table1"></div>
        <div class="wf-card mod-dark match-histories" id="maps_winrate_table2"></div>
        </div>`).insertAfter(".wf-label:contains(Past Matches) + div");

        const team1 = $("a.match-header-link.wf-link-hover.mod-1").attr("href");
        const team2 = $("a.match-header-link.wf-link-hover.mod-2").attr("href");
        const teams = [team1, team2];

        teams.forEach(function (team, index) {
            if (team) { // Add null-check
                $.get("https://www.vlr.gg/team/stats/" + team.substring(6))
                    .done(function (data) {
                        const table = $(data).find(".wf-table").parent(".mod-table");
                        table.find(".mod-def").remove();
                        table.find(".mod-atk").remove();
                        table.find(".mod-mini").remove();
                        table.find(".mod-center").remove();
                        table.find(".map-games-toggle").parent(".mod-supercell").remove();
                        while (table.find("tr").find("td.mod-supercell:nth-child(3)").length)
                            table.find("tr").find("td.mod-supercell:nth-child(3)").remove();
                        table.find(".mod-toggle").remove();
                        table.find("tr").each(function (index, row) {
                            $(row).addClass("maps_perc_row");
                            $(row).attr("row_index", index);
                        });

                        // Replace http:// with https:// in image URLs
                        table.find("img").each(function () {
                            const src = $(this).attr("src");
                            if (src.startsWith("http://")) {
                                $(this).attr("src", src.replace("http://", "https://"));
                            }
                        });

                        $("#maps_winrate_table" + (index + 1)).prepend(table.html());
                    })
                    .fail(function () {
                        console.log(`BetterVLR: Team ${index + 1} is TBD`);
                    });
            } else {
                console.log(`BetterVLR: Team ${index + 1} is TBD`);
            }
        });
    }

    $(document).ajaxStop(function () {
        changeColors();
    });

    // Change win percentage colors
    function changeColors() {
        $(".maps_perc_row").find(".mod-supercell").next().each(function () {
            const text = $(this).text().trim();
            const value = parseFloat(text.replace("%", ""));
            if (!isNaN(value)) {
                if (value <= 45) {
                    $(this).css("color", "#f66f7a");
                } else if (value >= 55) {
                    $(this).css("color", "#60c377");
                }
            }
        });
    }
});
