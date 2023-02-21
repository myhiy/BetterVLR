$(document).ready(function () {
    if ($('.match-header-vs-note').length < 1)
        return;

    $("head").prepend("<link rel='stylesheet' type='text/css' href='https://www.vlr.gg/css/base/pages/team_stats_vlr.css'>");
    $(`<div class="wf-label" style="margin: 22px 0 0 0;" id="maps_winrate">Maps winrate percentage</div>
    <div style="display: flex;" id="maps_winrate_table">
    <div class="wf-card mod-dark mod-first match-histories" id="maps_winrate_table1"></div>
    <div class="wf-card mod-dark match-histories" id="maps_winrate_table2"></div>
    </div>`).insertAfter('div.col:nth-child(3) > div:nth-child(10)');

    let team1 = $('a.match-header-link.wf-link-hover.mod-1').attr('href');
    let team2 = $('a.match-header-link.wf-link-hover.mod-2').attr('href');
    [team1, team2].forEach(function (team, index) {
        $.get('https://www.vlr.gg/team/stats/' + team.substring(6), function (data) {
            let table = $(data).find('.wf-table').parent('.mod-table');
            table.find('.mod-def').remove();
            table.find('.mod-atk').remove();
            table.find('.mod-mini').remove();
            table.find('.mod-center').remove();
            table.find('.map-games-toggle').parent('.mod-supercell').remove();
            while (table.find('tr').find('td.mod-supercell:nth-child(3)').length > 0)
                table.find('tr').find('td.mod-supercell:nth-child(3)').remove();
            table.find('.mod-toggle').remove();
            table.find('tr').each(function (index, row) {
                $(row).addClass('maps_perc_row');
                $(row).attr('row_index', index);
            });
            $('#maps_winrate_table' + (index + 1)).prepend(table.html());
        });
    });

    // Define a function that does something with the elements
    function change_colors() {
        $(".maps_perc_row").find(".mod-supercell").next().each(function () {
            var text = $(this).text().trim();
            var match = text.match(/\d+\.?\d*%/);
            var value = match ? parseFloat(match[0].replace("%", "")) : NaN;
            if (!isNaN(value)) {
                if (value >= 0 && value <= 45) {
                    $(this).css("color", "#f66f7a");
                } else if (value >= 55 && value <= 100) {
                    $(this).css("color", "#60c377");
                }
            }
        });
    }

    // Set an interval to run the function every 100 milliseconds and store it in a variable
    var interval = setInterval(change_colors, 100);

    // Set a timeout to clear the interval after 5 seconds
    setTimeout(function () {
        clearInterval(interval);
    }, 5000);
});
