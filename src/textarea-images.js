// Insert file picker icon
$(".post-editor-header-action[title=Spoiler]").after(`
<label class="post-editor-header-action" title="File Picker">
    <i class="fa fa-picture-o"></i>
    <input id="file-upload" type="file" multiple accept="image/*" style="display: none;">
</label>`);

// Upload options for inline attachment
const upload_options = {
    uploadUrl: "https://api.imgur.com/3/image",
    jsonFieldName: "data.link",
    uploadFieldName: "image",
    progressText: "[UPLOADING FILE]" + " ",
    urlText: "{filename}",
    errorText: "[ERROR UPLOADING FILE]" + " ",
    extraHeaders: {
        "Authorization": "Client-ID b234bda60e00570"
    },
    onFileUploadResponse: function (xhr) {
        var result = JSON.parse(xhr.responseText);
        if (result && result.data && result.data.link) {
            var filename = result.data.link + " ";
            var newValue;
            if (typeof this.settings.urlText === "function") {
                newValue = this.settings.urlText.call(this, filename, result);
            } else {
                newValue = this.settings.urlText.replace(this.filenameTag, filename);
            }
            var text = this.editor.getValue().replace(this.lastValue, newValue);
            this.editor.setValue(text);
            this.settings.onFileUploaded.call(this, filename);
        }
    },
    onFileUploadError: function () {
        var text = this.editor.getValue().replace(this.lastValue, upload_options.errorText);
        this.editor.setValue(text);
    }
};

// Make inline attachment work on dynamically generated textarea's
$(document).on("focus", ".post-editor-text", function () {
    var textarea = $(this);

    if (!textarea.data("inlineattachment")) {
        textarea.inlineattachment(upload_options);
        textarea.data("inlineattachment", true);
    }
});

// Inline attachment for file picker
$(document).on("change", "#file-upload", function () {
    var object = this;
    var progress_text = upload_options.progressText;
    var error_text = upload_options.errorText;
    var textarea = $(".post-editor-text:focus")[0];

    var form_data = new FormData();
    for (var i = 0; i < this.files.length; i++) {
        inlineAttachment.util.insertTextAtCursor(textarea, progress_text);
        form_data.append(upload_options.uploadFieldName, this.files[i]);

        $.ajax({
            url: upload_options.uploadUrl,
            type: "POST",
            headers: upload_options.extraHeaders,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (result) {
                var filename = result.data.link + " ";
                var text = $(textarea).val().replace(progress_text, filename);
                $(textarea).val(text);
            },
            error: function () {
                var text = $(textarea).val().replace(progress_text, error_text);
                $(textarea).val(text);
            }
        });
    }
});
