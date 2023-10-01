// Function to generate a single trophy item HTML
function generateTrophyItemHTML(trophy) {
    const default_image = "https://i.imgur.com/GKATx36.png";
    const trophy_image = trophy.image ? trophy.image : default_image;

    return `
    <a class="wf-nav-item" href="${trophy.link}" style="padding: 5px">
        <div class="wf-nav-item-title">
            <img src="${trophy_image}" height="36" width="36" style="object-fit: cover;" title="${trophy.event}"></img>
        </div>
    </a>`;
}

// Function to generate trophy container HTML
function insertTrophies(selector, trophies_HTML) {
    const trophies_container = `
    <div class="wf-nav trophies">
        ${trophies_HTML}
    </div>`;

    $(selector).after(trophies_container);

    $(".trophies > a:first").addClass("mod-first");
}

const url = window.location.href;
if (url.includes("/team/")) {
    $.getJSON("https://json.link/6zoXT2JZBV.json", function (data) {
        const team_and_id = url.split("/").slice(-2).join("/");

        const trophies_data = data.trophies.filter(trophy => trophy.id + "/" + trophy.team.toLowerCase() === team_and_id);
        const trophies_HTML = trophies_data.map(generateTrophyItemHTML).join("");

        if (trophies_HTML) {
            insertTrophies(".team-header", trophies_HTML);
        }
    });
} else if (url.includes("/player/")) {
    $.getJSON("https://json.link/6zoXT2JZBV.json", function (data) {
        const player_and_id = url.split("/").slice(-2).join("/");

        const trophies_data = data.trophies.filter(trophy => trophy.players.some(player => player.id + "/" + player.alias.toLowerCase() === player_and_id));
        const trophies_HTML = trophies_data.map(generateTrophyItemHTML).join("");

        if (trophies_HTML) {
            insertTrophies(".player-header", trophies_HTML);
        }
    });
}
