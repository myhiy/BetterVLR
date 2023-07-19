import twemoji from "twemoji";
import { createPopper } from "@popperjs/core";
import { Picker, SearchIndex } from "emoji-mart";

// https://popper.js.org/docs/v2/modifiers/community-modifiers/
const sameWidth = {
  name: "sameWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect: ({ state }) => {
    state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
  }
};

function parseTwemojis(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    twemoji.parse(element, { folder: "svg", ext: ".svg" });
  });

  // Enlarge if no text and less then 10 emojis next to each other
  $(selector).each(function () {
    if (!$(this).text().trim().length) {
      const emojis = $(this).find(".emoji");
      let consecutive_emojis = 0;

      emojis.each(function () {
        const next_element = $(this).next();

        if (next_element.hasClass("emoji")) {
          consecutive_emojis++;
        } else {
          consecutive_emojis = 0;
        }

        if (consecutive_emojis >= 10) {
          return false;
        }
      });

      if (consecutive_emojis < 10) {
        emojis.addClass("jumboable");
      }
    }
  });
}


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
// Fix spoiler button not working because of parseCustomEmojis
$(document).on("click", ".js-post-spoiler", function () {
  $(this).replaceWith($(this).contents());
});


// Convert emojis in posts
parseTwemojis(".post-body");
parseCustomEmojis(".post-body");

// Convert emojis in post preview
$(document).on("click", ".post-editor-header-preview", function () {
  const checkVisibility = () => {
    const preview = $(".post-preview");
    if (preview.is(":visible")) {
      parseTwemojis(".post-preview");
      parseCustomEmojis(".post-body");
    } else {
      setTimeout(checkVisibility, 0);
    }
  };

  checkVisibility();
});

function getTheme() {
  if ($(".js-dark-switch .on").is(":visible")) { return "dark" } else { return "light" }
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
    togglePicker();
    $.magnificPopup.open({
      items: {
        src: `
        <div class="request-emoji-popup wf-card">
          <h2>Request Custom Emojis</h2>
          <p>To request a custom emoji, please join our Discord server or open a GitHub issue.</p>
          <div>
            <a class="btn mod-action" href="https://discord.gg/SqN4aY6aFE" target="_blank" onclick="$.magnificPopup.close();">
              <svg width="24" height="24" viewBox="0 -28.5 256 256" xmlns="http://www.w3.org/2000/svg">
                <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" fill="white" />
              </svg>DISCORD</a>
            <a class="btn mod-action" href="https://github.com/myhiy/BetterVLR" target="_blank" onclick="$.magnificPopup.close();">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.296997 12 0.296997Z" fill="white"></path>
              </svg>GITHUB</a>
          </div>
        </div>`,
        type: "inline"
      }
    });
  }
});


// Emoji suggestions
$.getJSON("https://snippet.host/sgyddt/raw", function (custom) {

  const emoji_suggestions = $("<div>", {
    id: "emoji-suggestions",
  });

  $(emoji_suggestions).appendTo("body");

  const textarea = $(".post-editor-text");
  emoji_suggestions.css("visibility", "hidden");

  let popper = null;

  const custom_emojis = custom.flatMap(category => category.emojis.map(emoji => ({
    id: emoji.id,
    replacement: `<img class="emoji" alt=":${emoji.id}:" src="${emoji.skins[0].src}">`
  })));

  async function search(value) {
    const search_results = await SearchIndex.search(value);

    if (search_results) {
      if (!search_results.length) {
        emoji_suggestions.css("visibility", "hidden");
      } else {
        emoji_suggestions.css("visibility", "visible");
        const emojis = search_results.map((e) => ({
          id: e.id,
          native: e.skins[0].native,
        }));

        const limited_emojis = emojis.slice(0, 5); // Limit the emojis to 5
        const emojis_html = limited_emojis.map((emoji) => `
        <span class="emoji-preview">${emoji.native || getReplacement(emoji.id)} :${emoji.id}:</span>`).join(" ");

        // Parse the emojis using Twemoji
        const parsed_emojis_html = twemoji.parse(emojis_html, {
          folder: "svg",
          ext: ".svg"
        });

        emoji_suggestions.html(parsed_emojis_html);
        emoji_suggestions.find(".emoji-preview:first").addClass("selected"); // Select the first emoji by default


      }
    }
  }

  function getReplacement(emojiId) {
    const custom_emoji = custom_emojis.find((emoji) => emoji.id === emojiId);
    return custom_emoji ? custom_emoji.replacement : "undefined";
  }

  // Show emoji suggestions after colons
  $(document).on("input", textarea, (event) => {
    const value = event.target.value;
    const regex = /:(\S+)$/;
    const match = value.match(regex);

    if (match) {
      const search_value = match[1];
      search(search_value);

      setTimeout(() => {
        popper = createPopper(event.target.parentNode, emoji_suggestions[0], {
          placement: "top",
          modifiers: [{ name: "offset", options: { offset: [0, 5], } }, sameWidth]
        });
      }, 0);
    } else {
      emoji_suggestions.css("visibility", "hidden");
    }
  });
});


// Navigate emoji suggestions through arrow keys
$(document).on("keydown", ".post-editor-text", function (event) {
  const emoji_suggestions = $("#emoji-suggestions");
  const emoji_preview = $(".emoji-preview");
  let current_index = emoji_preview.filter(".selected").index();

  if (emoji_suggestions.css("visibility") === "visible") {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      current_index = (current_index - 1 + emoji_preview.length) % emoji_preview.length;
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      current_index = (current_index + 1) % emoji_preview.length;
      // Insert on enter and tab
    } else if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      const selected_emoji = emoji_preview.eq(current_index).find("img").attr("alt");
      const textarea_value = $(".post-editor-text:focus").val();
      const regex = /:(\S+)$/;
      const match = textarea_value.match(regex);
      if (match) {
        const new_value = textarea_value.replace(regex, selected_emoji + " ");
        $(".post-editor-text:focus").val(new_value);
        emoji_suggestions.css("visibility", "hidden");
      }
    }
  }

  emoji_preview.removeClass("selected");
  emoji_preview.eq(current_index).addClass("selected");
});

// Insert emoji suggestion on click
$(document).on("mousedown", ".emoji-preview", function (event) {
  const emoji_suggestions = $("#emoji-suggestions");
  const emoji_preview = $(this);

  if (emoji_suggestions.css("visibility") === "visible") {
    event.preventDefault();
    const selected_emoji = emoji_preview.find("img").attr("alt");
    const textarea_value = $(".post-editor-text:focus").val();
    const regex = /:(\s+)$/;
    const match = textarea_value.match(regex);
    if (match) {
      const new_value = textarea_value.replace(regex, selected_emoji + " ");
      $(".post-editor-text:focus").val(new_value);
      emoji_suggestions.css("visibility", "hidden");
    }
  }
});
