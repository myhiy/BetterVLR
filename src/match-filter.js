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
    // https://gist.github.com/richjenks/15b75f1960bc3321e295
    filterRegions($("#americas"), [
        "as", "ai", "ag", "ar", "aw", "bs", "bb", "bz", "bm", "bo", "bq", "br",
        "io", "ca", "ky", "cl", "co", "cr", "cu", "cw", "dm", "do", "ec", "sv",
        "fk", "fo", "gf", "pf", "tf", "gd", "gp", "gu", "gt", "gg", "gy", "ht",
        "hm", "hn", "jm", "je", "ki", "kv", "kr", "mq", "mx", "ms", "nc", "ni",
        "nu", "nf", "mp", "pa", "pg", "py", "pe", "pn", "pr", "bl", "kn", "lc",
        "mf", "pm", "vc", "ws", "sx", "sr", "tk", "to", "tt", "tc", "tv", "um",
        "us", "uy", "vg", "vi", "wf"
    ]);
    filterRegions($("#emea"), [
        "eu", "af", "ax", "al", "dz", "ad", "ao", "aq", "ag", "ar", "am", "at",
        "az", "bh", "bd", "by", "be", "bj", "bm", "bt", "ba", "bw", "bv", "br",
        "bn", "bg", "bf", "bi", "cv", "kh", "cm", "ca", "cf", "td", "cx", "cc",
        "co", "km", "cd", "cg", "ck", "hr", "cy", "cz", "dk", "dj", "ec", "eg",
        "gq", "er", "ee", "et", "fk", "fo", "fi", "fr", "ga", "gm", "ge", "de",
        "gh", "gi", "gr", "gl", "gn", "gw", "hk", "hu", "is", "in", "ir", "iq",
        "ie", "im", "il", "it", "jp", "jo", "kz", "ke", "kw", "kg", "la", "lv",
        "lb", "ls", "lr", "ly", "li", "lt", "lu", "mo", "mk", "mg", "mw", "my",
        "mv", "ml", "mt", "mh", "mq", "mr", "mu", "yt", "mx", "fm", "md", "mc",
        "mn", "me", "ms", "ma", "mz", "mm", "na", "nr", "np", "nl", "nc", "nz",
        "ni", "ne", "ng", "nu", "nf", "mp", "no", "om", "pk", "pw", "ps", "pa",
        "pg", "py", "pe", "ph", "pn", "ws", "sm", "st", "sa", "sn", "rs", "sc",
        "sl", "sg", "sx", "sk", "si", "sb", "so", "za", "gs", "ss", "es", "lk",
        "sd", "sj", "sz", "se", "ch", "sy", "tw", "tj", "tz", "th", "tl", "tg",
        "tk", "to", "tn", "tr", "tm", "tv", "ug", "ua", "ae", "gb", "eh", "ye",
        "zm", "zw"
    ]);
    filterRegions($("#pacific"), [
        "as", "au", "bd", "bn", "kh", "cx", "cc", "ck", "fj", "pf", "gu", "hk",
        "in", "id", "jp", "ki", "kv", "kr", "la", "my", "mv", "mh", "fm", "mn",
        "mm", "nr", "np", "nc", "nz", "nu", "nf", "mp", "pk", "pw", "ps", "pa",
        "pg", "ph", "pn", "ws", "sg", "sb", "gs", "tw", "tj", "th", "tl", "tk",
        "to", "tv", "vu", "vn", "wf"
    ]);
    filterRegions($("#china"), [
        "cn"
    ]);
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
