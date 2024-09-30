function toggleVisibility() {
    if ($("#selectTopicBox").hasClass("d-none")) {
        $(".container-fluid")[0].style.paddingTop = '100px';
        $("#chatBox").addClass("d-none");
        $("#selectTopicBox").removeClass("d-none");
    } else {
        $(".container-fluid")[0].style.paddingTop = '50px';
        $("#selectTopicBox").addClass("d-none");
        $("#chatBox").removeClass("d-none");
        msgBoxScrollBottom();
    }
}

function msgBoxScrollBottom() {
    $("#msgBox").animate({
        scrollTop: $("#msgBox").prop('scrollHeight')
    }, 10);
}

function addMsgBot(text) {
    var html = `<div class="direct-chat-msg">
            <div class="direct-chat-infos clearfix">

            </div>
            <div class="direct-chat-img text-center">
                <i class="fa fa-robot"></i>
            </div>
            <div class="direct-chat-text" style="margin-right: 70px">
                ` + text + `
            </div>
        </div>`
    $("#msgBox").append(html);
    msgBoxScrollBottom();
}

function addMsgUser(text) {
    var html = `<div class="direct-chat-msg right">
                        <div class="direct-chat-infos clearfix">

                        </div>
                        <div class="direct-chat-img text-center">
                            <i class="fa fa-user"></i>
                        </div>
                        <div class="direct-chat-text" style="margin-left: 70px">
                            ` + text + `
                        </div>
                    </div>`
    $("#msgBox").append(html);
    msgBoxScrollBottom();
}


$("#selectTopicForm").submit(function(e) {
    var mode = $(".custom-select option:selected").text()
    window.mode = mode
    question()
    e.preventDefault();
    toggleVisibility();
});

$("#msgSend").submit(function(e) {
    e.preventDefault();
    ans = $("#message").val()
    addMsgUser(ans);
    var html = `<div id="response-box" class="direct-chat-msg"><div class="direct-chat-infos clearfix"></div>
                                        <div class="direct-chat-img text-center">
                                            <i class="fa fa-robot"></i>
                                        </div>
                                                                                                                            <div id="loading" class="direct-chat-text" style="margin-right: 70px">
                                                                                        <i class="fa fa-solid fa-spinner fa-spin fa-lg"></i>
                                                                                    </div>
                                    </div>`
    $("#msgBox").append(html);
    answer(ans)
    $("#msgSend-box").remove()
    msgBoxScrollBottom();
})

$("#backToSelectTopicBox").click(function() {
    location.reload()
})

function question() {
    fetch('http://127.0.0.1:5000/question?topic=' + window.mode)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            window.question = data
            postQuestion(data)
        })
}


function postQuestion(question) {
    $("#question-box #loading").remove()
    var questionElement = `<div id="#loading" class="direct-chat-text" style="margin-right: 70px">` + question + `</div>`
    $("#question-box").append(questionElement)
}

function answer(ans) {
    fetch('http://127.0.0.1:5000/answer?answer=' + ans + "&" + "question=" + window.question)
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            res = JSON.parse(data)
            if (res["Correct"] == "No" || res["Correct"] == "no" ||  res["Correct"] == "NO"){
                $(".direct-chat-primary .right>.direct-chat-text ").addClass("bg-danger").addClass("border-danger")
                changeAfterBorderLeftColorToRed()
//                toggleConfetti();
            }
            if (res["Correct"] == "Yes" || res["Correct"] == "yes" ||  res["Correct"] == "YES"){
                $(".direct-chat-primary .right>.direct-chat-text ").addClass("bg-success").addClass("border-success")
                changeAfterBorderLeftColorToGreen()
            }
            postResponse(res["evaluation"])
            var html = `<div id="response-box" class="direct-chat-msg"><div class="direct-chat-infos clearfix"></div>
                                        <div class="direct-chat-img text-center">
                                            <i class="fa fa-robot"></i>
                                        </div>
                                        <div class="direct-chat-text" style="margin-right: 70px">
                                              Accuracy : ` + res["Accuracy"] + `
                                        </div>
                                    </div>`
            $("#msgBox").append(html);
        })
}

function postResponse(response) {
     var html = `
                                        <div class="direct-chat-text" style="margin-right: 70px">
                                              ` + response + `
                                        </div>`
    $("#response-box #loading").remove()
    $("#response-box").append(html)
}

function applyPseudoElementStyles(styleContent) {

        var style = $('#pseudo-element-styles');
        if (style.length === 0) {

            style = $('<style id="pseudo-element-styles">');
            $('head').append(style);
        }


        style.text(styleContent);
    }


    function changeAfterBorderLeftColorToRed() {
        var redStyle = `
            .direct-chat-primary .right>.direct-chat-text::after, .direct-chat-primary .right>.direct-chat-text::before {
                border-left: 5px solid red;
            }
        `;
        applyPseudoElementStyles(redStyle);
    }


    function changeAfterBorderLeftColorToGreen() {
        var greenStyle = `
            .direct-chat-primary .right>.direct-chat-text::after, .direct-chat-primary .right>.direct-chat-text::before {
                border-left: 5px solid green;
            }
        `;
        applyPseudoElementStyles(greenStyle);
    }


