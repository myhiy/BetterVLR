//SOURCE: https://greasyfork.org/en/scripts/436447-maps-winrate-percentage-for-vlr-gg-match-page
function showMapsPercentage() {
    if ($('.match-header-vs-note').length < 1)
        return;

    $(
        `<link rel="stylesheet" href="https://www.vlr.gg/css/base/pages/team_stats_vlr.css?v=2" type="text/css" />
        <link rel="stylesheet" href="https://www.vlr.gg/css/base/pages/dark.css?v=2" type="text/css" />
       <link rel="stylesheet" href="https://www.vlr.gg/css/base/pages/team.css?v=26" type="text/css" />
       <link rel="stylesheet" href="https://www.vlr.gg/css/base/pages/r/team.css?v=6" type="text/css" />
       <div class="wf-label" style="margin: 22px 0 0 0;" id="maps_winrate">Maps winrate percentage</div>
       <div style="display: flex;" id="maps_winrate_table">
         <div class="wf-card mod-dark mod-first match-histories" id="maps_winrate_table1"></div>
         <div class="wf-card mod-dark match-histories" id="maps_winrate_table2"></div>
       </div>`
    ).insertAfter('div.col:nth-child(3) > div:nth-child(10)');

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
            })

            $('#maps_winrate_table' + (index + 1)).prepend(table.html());
        });
    });

    window.setInterval(function () {
        $('.maps_perc_row').each(function (index, row) {
            let row_index = $(row).attr('row_index');
            let sibling = $('.maps_perc_row[row_index=' + row_index + ']').not(row);
            let perc_this = $(row).find('td:nth-child(2) > div:nth-child(1) > div:nth-child(1)').html(),
                perc_sibl = sibling.find('td:nth-child(2) > div:nth-child(1) > div:nth-child(1)').html();

            $(row).find('.mod-first').removeClass('mod-highlight');
            sibling.find('.mod-first').removeClass('mod-highlight');

            if (parseInt(perc_this) < parseInt(perc_sibl))
                sibling.find('.mod-first').addClass('mod-highlight');
            if (parseInt(perc_this) > parseInt(perc_sibl))
                $(row).find('.mod-first').addClass('mod-highlight');
        });
    }, 1000);
}

$(document).ready(function () {
    showMapsPercentage();
});
