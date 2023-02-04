//Insert block users category in settings
$(".wf-card.mod-form:last").after(`<div class="wf-card mod-form mod-dark">
<div class="form-section" style="margin-top: 0;">Block Users</div><div style="display: flex; justify-content: space-between;">
  <input type="text" id="userToBlock" placeholder="USER TO BLOCK">
  <button id="blockBtn" class="btn mod-action" style="background-color: #d04e59; width: 50px; margin-right: 570px;">Block</button>
</div>

<ul id="blockedUsers">

</ul>
</div>`);


$(document).ready(function () {
    //Load blocked users from local storage
    var blockedUsers = JSON.parse(localStorage.getItem("blockedUsers")) || [];


    //Render the blocked users list
    renderBlockedUsers();


    //Handle block button click
    $("#blockBtn").click(function (e) {
        e.preventDefault();
        var userToBlock = $("#userToBlock").val();
        var username = $(".mod-user").attr("href").split("/")[2];
        if (userToBlock && userToBlock !== username) {
            if (blockedUsers.indexOf(userToBlock) == -1) {
                blockedUsers.push(userToBlock);
                localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));
                renderBlockedUsers();
                $("#userToBlock").val("");
            } else {
                //Prevent users from blocking the same person twice
                alert("This user is already blocked!");
            }
        } else {
            //Prevent users from blocking themselves
            alert("You can't block yourself!");
        }
    });


    //Handle unblock button click
    $(document).on("click", ".unblockBtn", function () {
        var userToUnblock = $(this).data("user");
        blockedUsers = blockedUsers.filter(function (user) {
            return user != userToUnblock;
        });
        localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));
        renderBlockedUsers();
    });


    function renderBlockedUsers() {
        $("#blockedUsers").empty();
        blockedUsers.forEach(function (user) {
            $("#blockedUsers").append(`
            <li style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
            <a href="/user/${user}" class="">${user}</a>
            <button class="btn mod-action unblockBtn btn" data-user="${user}" style="background-color: #79c38a; width: 50px; margin-right: 570px;">Unblock</button>
            </li>`);
        });
    }


    for (var i = 0; i < blockedUsers.length; i++) {
        var postBtns = `<div class="btn mod-action show-post" style="width: 45%; text-align: center; margin: 0px;">Show post</div>
        <div class="btn mod-action unblock-post" style="width: 45%; text-align: center; margin: 0px;">Unblock</div>`
        var postNumber = $(`.post-header:contains('${blockedUsers[i]}') > .post-header-num`).text();
        var postFooter = $(`.post-header:contains('${blockedUsers[i]}')`).next().next().html();
        var postId = $(`.post-header:contains('${blockedUsers[i]}')`).next().next().next().attr("data-post-id");
        var stars = `<div class="star mod-0"></div>`
        var originalPostHeader = $(`.post-header:contains('${blockedUsers[i]}')`).html()
        var originalPost = $(`.post-header:contains('${blockedUsers[i]}')`).next().html();

        //Hide blocked users posts
        $(`.post-header:contains('${blockedUsers[i]}')`).parent().replaceWith(`<div class="wf-card post">
        <div class="blocked-post-toggle post-toggle js-post-toggle noselect"></div>
        <div class="post-header noselect">
            <div class="post-header-num">${postNumber}</div>
            <i class="post-header-flag flag mod-unknown" title="Unknown"></i>
            <a class="post-header-author mod-vlr">Blocked User</a>
            <div class="post-header-stars">${stars}${stars}${stars}${stars}</div>
            <div class="post-header-children"></div>
        </div>
        <div class="post-header noselect blocked-post">${originalPostHeader}</div>
        <div class="post-block-buttons" style="margin: 20px; display: flex; justify-content: space-between;">${postBtns}</div>
        <div class="post-body blocked-post">${originalPost}</div>
        <div class="post-footer">${postFooter}</div>
        <div class="report-form" data-post-id="${postId}"></div>
        <div class="reply-form" data-post-id="${postId}"></div>
        </div>`);
    }

    //Handle show/hide post button click
    $(".show-post").click(function () {
        $(this).text($(this).text() == 'Hide Post' ? 'Show Post' : 'Hide Post');
        $(this).parent().prev().prev().toggle();
        $(this).parent().prev().toggleClass("blocked-post");
        $(this).parent().next().toggleClass("blocked-post");
    });

    //Handle unblock post button click
    $(".unblock-post").click(function () {
        var unblockPostUser = $(this).parent().prev().find(".post-header-author").text().trim();
        $(this).attr('data-user', unblockPostUser);
        var userToUnblock = $(this).data("user");
        blockedUsers = blockedUsers.filter(function (user) {
            return user != userToUnblock;
        });
        localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));
        renderBlockedUsers();
        location.reload();
    });

    //Dont make a block footer button for the user or for already blocked users
    $('.post-action.reply-btn').each(function () {
        var idk = $(this).attr("data-author-name");
        if ($(this).parent().text().indexOf("edit") == -1 && !$(this).closest('.post').find('.post-block-buttons').length) {
            $(this).before(`<a class="post-action block-btn" data-user="${idk}">block</a>
            <span class="post-action-div">•</span>`);
        }
    });

    // Handle footer block button click
    $(".post-action.block-btn").click(function () {
        var userToBlock = $(this).data("user");
        if (userToBlock) {
            blockedUsers.push(userToBlock);
            localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));
            renderBlockedUsers();
        }
        location.reload();
    });

    //Make blocked posts collapsable
    $(".blocked-post-toggle").click(function () {
        var e = $(this).closest(".threading").children(".threading"),
            t = $(this).closest(".post"),
            i = $(this).hasClass("mod-collapsed");
        if (e.toggle(), $(this).toggleClass("mod-collapsed"), t.toggleClass("mod-collapsed"), !i) {
            var n = e.find(".post").length,
                s = t.find(".post-header-children");
            s.html("(" + n + " children hidden)")
        }
    })
});
