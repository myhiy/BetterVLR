$(".js-home-matches-upcoming").css("margin-top", "0px");
$(".js-home-matches-upcoming").prev().before(`<div id="regions-filter" class="btn wf-card">REGIONS</div>`);

$(".js-home-events").css("margin-top", "0px");
$(".js-home-events").prev().before(`<div id="events-filter" class="btn wf-card">EVENTS</div>`);

$("#regions-filter").after(`
<div id="regions-filter-content" class="wf-card">
    <label class="btn">
        <input id="americas" type="checkbox" checked>
        <span>AMERICAS</span>
    </label>
    <label class="btn">
        <input id="emea" type="checkbox" checked>
        <span>EMEA</span>
    </label>
    <label class="btn">
        <input id="pacific" type="checkbox" checked>
        <span>PACIFIC</span>
    </label>
    <label class="btn">
        <input id="china" type="checkbox" checked>
        <span>CHINA</span>
    </label>
</div>`);

$("#events-filter").after(`
<div id="events-filter-content" class="wf-card">
    <label class="btn">
        <input id="vct" type="checkbox" checked>
        <span>VCT</span>
    </label>
    <label class="btn">
        <input id="vcl" type="checkbox" checked>
        <span>VCL</span>
    </label>
    <label class="btn">
        <input id="gc" type="checkbox" checked>
        <span>GC</span>
    </label>
</div>`);


$(document).on("click", "#regions-filter", function () {
    if ($("#regions-filter-content").is(":visible")) {
        $(this).css("border-radius", "3px");
        $("#regions-filter-content").slideUp();
    } else {
        $(this).css("border-radius", "3px 3px 0 0");
        $("#regions-filter-content").slideDown();
    }
});

$(document).on("click", "#events-filter", function () {
    if ($("#events-filter-content").is(":visible")) {
        $(this).css("border-radius", "3px");
        $("#events-filter-content").slideUp();
    } else {
        $(this).css("border-radius", "3px 3px 0 0");
        $("#events-filter-content").slideDown();
    }
});


$(document).ready(function () {
    function filterRegions(checkbox, country_codes) {
        const country_selectors = country_codes.map(code => `.flag.mod-${code}`).join(",");

        checkbox.on("change", function () {
            const match_selector = $(".wf-module-item.mod-match");

            match_selector.each(function () {
                const flag = $(this).find(country_selectors);
                if (flag.length > 0) {
                    $(this).css("display", checkbox.is(":checked") ? "block" : "none");
                }
            });
        });
    }

    // Call the function for each checkbox with specified country codes
    filterRegions($("#americas"), ["us"]);
    filterRegions($("#emea"), ["eu"]);
    filterRegions($("#pacific"), ["kr"]);
    filterRegions($("#china"), ["cn"]);
});


$(document).ready(function () {
    function filterEvents(checkbox, event_name) {
        checkbox.on("change", function () {
            // Hide .wf-module-item.event-item elements that include the specified text
            $(".wf-module-item.event-item").each(function () {
                const event_text = $(this).find(".event-item-name").text();
                if (event_text.includes(event_name)) {
                    $(this).css("display", checkbox.is(":checked") ? "flex" : "none");

                    // Get the href attribute of the matching event and hide related .wf-module-item.mod-match elements
                    let href_to_hide = $(this).attr("href");
                    // Text after last "/"
                    href_to_hide = href_to_hide.split("/").pop();
                    // Hide .wf-module-item.mod-match elements that include the href of hidden events
                    $(`.wf-module-item.mod-match[href*="${href_to_hide}"]`).each(function () {
                        $(this).css("display", checkbox.is(":checked") ? "block" : "none");
                    });
                }
            });
        });
    }

    // Call the function for each checkbox with its specified text
    filterEvents($("#vct"), "VCT");
    filterEvents($("#vcl"), "VCL");
    filterEvents($("#gc"), "GC");
});
