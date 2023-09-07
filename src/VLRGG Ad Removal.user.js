// ==UserScript==
// @name         VLRGG Ad Removal
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ad removal for vlr.gg
// @author       github.com/tomazmpp
// @match        https://www.vlr.gg/*
// @icon         https://avatars.githubusercontent.com/u/94735704?v=4
// @grant        none
// ==/UserScript==

(function() {
const side = document.body.querySelector(".desktop-only");
const up = document.body.querySelector('[data-space="desktop_hero"]');
side.remove()
up.remove()
})();
