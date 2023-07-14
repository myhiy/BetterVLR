import { quick_links, quick_links_popup, displayQuickLinksInSettings } from "./quick-links";

// Navbar
if (window.location.href.startsWith("https://www.vlr.gg/settings")) {
	const navbar = `
	<div class="wf-card mod-header mod-full">
		<div class="wf-nav">
			<a class="wf-nav-item mod-first" href="https://www.vlr.gg/settings">
				<div class="wf-nav-item-title">VLR</div>
			</a>
			<a class="wf-nav-item" href="https://www.vlr.gg/settings?bettervlr">
				<div class="wf-nav-item-title">BetterVLR</div>
			</a>
			<a class="wf-nav-item" href="https://www.vlr.gg/settings?blocked-users">
				<div class="wf-nav-item-title">Blocked Users</div>
			</a>
		</div>
	</div>`;

	$(".col-container").before(navbar);
}

// Navbar active class
$(document).ready(function () {
	const current_page = window.location.href;

	$(".wf-nav-item").each(function () {
		const href = $(this).attr("href");
		if (current_page === href) {
			$(this).addClass("mod-active");
		}
	});
});

// BetterVLR
const display = `
<div class="wf-card mod-form mod-dark">
	<div class="form-section" style="margin-top: 0;">Display</div>
	<div class="form-label">Threads</div>
	<div style="margin-bottom: 5px;">
		<input type="checkbox" id="hide_flags">
		<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Flags</span>
	</div>
	<div style="margin-bottom: 5px;">
		<input type="checkbox" id="hide_stars">
		<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Stars</span>
	</div>
	<div class="form-label" style="margin-top: 15px;">General</div>
	<div style="margin-bottom: 5px;">
		<input type="checkbox" id="esports_mode">
		<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Esports Mode</span>
	</div>
	<div style="margin-bottom: 5px;">
		<input type="checkbox" id="sticky_header">
		<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Sticky Header</span>
	</div>
</div>`;

const discussions = `
<div class="wf-card mod-form mod-dark">
	<div class="form-section" style="margin-top: 0;">Discussion</div>
	<div style="margin-bottom: 5px;">
		<input type="checkbox" id="hide_match_comments">
		<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Match Comments</span>
	</div>
</div>`;

const sidebar = `
<div class="wf-card mod-form mod-dark">
	<div class="form-section" style="margin-top: 0;">Sidebar</div>
	<div class="form-hint">select which sidebar items to hide</div>
	<div class="form-label" style="margin-top: 15px;">Valorant</div>
	<div style="margin-bottom: 5px;">
		<input type="checkbox" id="hide_live_streams">
		<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Live Streams (unofficial ones only)</span>
	</div>
	<div class="form-label" style="margin-top: 15px;">General</div>
	<div style="margin-bottom: 5px;">
		<input type="checkbox" id="hide_stickied_threads">
		<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Stickied Threads</span>
	</div>
	<div style="margin-bottom: 5px;">
		<input type="checkbox" id="hide_recent_discussions">
		<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Recent Discussions</span>
	</div>
</div>`;

const misc = `
<div class="wf-card mod-form mod-dark">
	<div class="form-section" style="margin-top: 0;">Misc</div>
	<div style="margin-bottom: 5px;">
		<input type="checkbox" id="imgur_proxy">
		<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Imgur Proxy (enable this if imgur is blocked for you)</span>
	</div>
</div>`;

if (window.location.search === "?bettervlr") {
	$(".wf-card.mod-form").not("form .wf-card.mod-form").hide();
	const form = $("form:eq(1)");
	form.html(display + discussions + sidebar + quick_links + misc);
	$(".quick-links div:has(.fa-plus)").magnificPopup(quick_links_popup);
	displayQuickLinksInSettings();
}

// Blocked users
const blocked_users = `
<div class="wf-card mod-form mod-dark">
	<div class="form-section" style="margin: 0;">Block Users</div>
	<div style="display: flex; justify-content: space-between; padding: 15px 20px 15px 0; flex-wrap: wrap; gap: 5px;">
		<input type="text" id="user-to-block" placeholder="USER TO BLOCK" style="margin: 0px">
		<button id="block-btn" class="btn mod-action" style="background-color: #d04e59; width: 50px;">Block</button>
	</div>
	<ul id="blocked_users"></ul>
</div>`;

if (window.location.search === "?blocked-users") {
	$(".wf-card.mod-form").not("form .wf-card.mod-form").hide();
	const form = $("form:eq(1)");
	form.html(blocked_users);
}
