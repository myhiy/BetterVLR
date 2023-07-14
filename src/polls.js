// Insert polls button
$(".post-editor-header-action[title=Spoiler]").after(`<li class="post-editor-header-action polls-button" title="Polls"><i class="fa fa-pie-chart"></i></li>`);

// Open polls popup
$(document).on("click", ".polls-button", function () {
    $.magnificPopup.open({
        items: {
            src: `
            <div class="polls-popup wf-card">
                <form id="polls">
                    <div>
                        <label>Title</label>
                        <input id="poll-title" placeholder="Type your question here" type="text" required />
                    </div>
                    <div class="answer-options">
                        <label>Answer Options</label>
                        <input placeholder="Option 1" type="text" required />
                        <input placeholder="Option 2" type="text" required />
                        <button type="button" id="add-option" class="btn">Add Option</button>
                    </div>
                    <button class="btn mod-action">Create</button>
                </form>
            </div>`,
            type: "inline"
        }
    });
});

// Add new options to the poll
$(document).on("click", "#add-option", function () {
    var answer_options = $(".answer-options");
    var last_option = answer_options.children("input:last");

    var option_count = answer_options.children("input").length + 1;

    var new_option = $(`<input type="text">`).attr("placeholder", "Option " + option_count);

    new_option.insertAfter(last_option);
});

// Create the poll
$(document).on("submit", "#polls", function (event) {
    event.preventDefault();

    var poll_title = $("#poll-title").val();

    var answer_options = [];
    $(".answer-options input").each(function () {
        var option = $(this).val();
        if (option.trim() !== "") {
            answer_options.push({
                type: "text",
                value: option
            });
        }
    });

    $.ajax({
        url: "https://api.strawpoll.com/v3/polls",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            title: poll_title,
            poll_options: answer_options,
            poll_config: {
                allow_comments: false
            }
        }),
        success: function (response) {
            var textarea = $("textarea:focus")[0];
            inlineAttachment.util.insertTextAtCursor(textarea, response.url + " ");
        },
        error: function (error) {
            var textarea = $("textarea:focus")[0];
            inlineAttachment.util.insertTextAtCursor(textarea, "[ERROR CREATING POLL]" + " ");
            console.error("Error creating poll:", error);
        }
    });

    // Close the popup
    $.magnificPopup.close();
});


// Embed the poll
$(`.post-body a[href*="strawpoll.com"]`).each(function () {
    const link = $(this).attr("href");
    var poll_id = link.match(/strawpoll\.com\/([a-zA-Z0-9]+)/);

    if (poll_id !== null) {
        poll_id = poll_id[1];
        const html = $(`
        <div class="strawpoll-embed" id="strawpoll_${poll_id}">
            <iframe title="StrawPoll Embed" id="strawpoll_iframe_${poll_id}" src="https://strawpoll.com/embed/${poll_id}"></iframe>
            <script async src="https://cdn.strawpoll.com/dist/widgets.js" charset="utf-8"></script>
        </div>`);

        html.css({
            "height": "480px",
            "max-width": "640px",
            "width": "100%",
            "display": "flex",
            "flex-direction": "column",
        });

        html.children().css({
            "display": "block",
            "flex-grow": "1",
        });

        html.children().attr({
            "frameborder": "0",
            "scrolling": "no",
            "allowfullscreen": "",
            "allowtransparency": "",
        });

        $(this).parent().append(html);
    }
});
