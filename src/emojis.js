import twemoji from "twemoji";
import { createPopper } from "@popperjs/core";
import { Picker } from "emoji-mart";

// Twemojis
export function parseTwemojis(element) {
    const elements = document.querySelectorAll(element);
    for (let i = 0; i < elements.length; i++) {
        twemoji.parse(elements[i], {
            folder: "svg",
            ext: ".svg",
        });
    }
}
parseTwemojis(".post-body");


// Convert custom emoji shortcodes to emoji images
function parseCustomEmojis(selector) {
    $.getJSON("https://7tv.io/v3/emote-sets/64aa3859c7d082e76f7248c8", function (data) {
        $(selector).each(function () {
            var post_body = $(this);
            var html_content = post_body.html();

            data.emotes.forEach(function (emoji) {
                var regex = new RegExp(":" + emoji.name + ":", "g");
                html_content = html_content.replace(regex, `
                <img class="custom-emoji" draggable="false" src="${emoji.data.host.url}/1x.webp" alt=":${emoji.name}:" title=":${emoji.name}:">`);
            });

            post_body.html(html_content);
        });
    });
}
parseCustomEmojis(".post-body *");

// Convert emojis in post preview
$(document).on("click", ".post-editor-header-preview", function () {
    const checkVisibility = () => {
        const preview = $(".post-preview");
        if (preview.is(":visible")) {
            parseTwemojis(".post-preview");
            parseCustomEmojis(".post-preview *");
        } else {
            setTimeout(checkVisibility, 0);
        }
    };

    checkVisibility();
});


// Emoji Picker
function getTheme() {
    if ($("body").hasClass("ui-color-dark")) { return "dark" } else { return "light" }
}

// Add emoji picker button
const emoji_picker_button = `<li class="post-editor-header-action emoji-button" title="Emoji Picker"><i class="fa fa-smile-o"></i></li>`;
$(".post-editor-header-action[title=Spoiler]").after(emoji_picker_button);

$.getJSON("https://7tv.io/v3/emote-sets/64aa3859c7d082e76f7248c8", function (custom) {
    // Create the category object for custom emojis
    const custom_emojis = custom.emotes.map((emoji) => ({
        id: emoji.name,
        name: emoji.name,
        keywords: emoji.data.tags,
        skins: [{ src: `${emoji.data.host.url}/1x.webp` }],
    }));

    const custom_category = {
        id: "custom",
        name: "Custom",
        emojis: custom_emojis,
    };

    // Wrap the custom_category object in an array
    const custom_category_array = [custom_category];

    const picker_options = {
        set: "twitter",
        skinTonePosition: "search",
        theme: getTheme(),
        custom: custom_category_array,
        categories: ["frequent", "custom", "people", "nature", "foods", "activity", "places", "objects", "symbols", "flags"],
        onEmojiSelect: addEmoji,
        onClickOutside: closePicker,
        onAddCustomEmoji: requestEmoji
    }
    const picker = new Picker(picker_options);
    $("body").append(picker);

    let popper = null;
    let last_focused_textarea = null;

    // Handle post-editor focus event
    $(document).on("focus", ".post-editor-text", function () {
        last_focused_textarea = $(this);
    });

    $(document).on("click", ".emoji-button", togglePicker);

    function togglePicker() {
        if (popper) {
            popper.destroy();
            popper = null;

            $(picker).hide();
        } else {
            popper = createPopper(this, picker, {
                placement: "top",
                modifiers: [{ name: "offset", options: { offset: [0, 8], } }]
            });

            $(picker).show();

            const picker_input = picker.shadowRoot.querySelector("input");
            picker_input.value = "";
            picker_input.focus({ preventScroll: true });
        }
    }

    // Insert emoji into post-editor on select
    function addEmoji(emoji, event) {
        if (last_focused_textarea) {
            const textarea = last_focused_textarea;
            const text = textarea.val();
            const selection_start = textarea.prop("selectionStart");
            const selection_end = textarea.prop("selectionEnd");

            const textarea_new = `${text.substring(0, selection_start)}${emoji.native ? emoji.native : `:${emoji.id}:`} ${text.substring(selection_end)}`;
            textarea.val(textarea_new).trigger("focus");
        }

        if (event.shiftKey) {
            return; // Exit the function if shift key is held down
        }

        popper.destroy();
        popper = null;

        $(picker).hide();
    }

    // Hide picker when clicking outside of it
    function closePicker(event) {
        const is_emoji_button = event.target.closest(".emoji-button") !== null;

        if (popper && !is_emoji_button) {
            popper.destroy();
            popper = null;

            $(picker).hide();
        }
    }

    // Request custom emojis
    function requestEmoji() {
        //togglePicker(); NOT DEFINED
        $.magnificPopup.open({
            items: {
                src: `
            <div class="request-emoji-popup wf-card">
                <h2>Request Custom Emojis</h2>
                <p>To request a custom emoji, please join our Discord server or open a GitHub issue.</p>
                <div>
                    <a class="btn mod-action" href="https://discord.gg/SqN4aY6aFE" target="_blank" onclick="$.magnificPopup.close();">
                        <img src="https://www.vlr.gg/img/icons/social/discord.svg"/>DISCORD
                    </a>
                        <a class="btn mod-action" href="https://github.com/myhiy/BetterVLR" target="_blank" onclick="$.magnificPopup.close();">
                        <i class="fa fa-github" aria-hidden="true"></i>GITHUB
                    </a>
                </div>
            </div>`,
                type: "inline"
            }
        });
    }
});
