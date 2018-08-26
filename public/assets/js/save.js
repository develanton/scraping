$(document).ready(function () {

    var thisId = "";
    //selecting article by _id
    $(document).on("click", ".articles", function () {

        thisId = $(this).attr("data-id");
        //ajax to get the notes and render on modal
        console.log(thisId)
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            .then(function (data) {

                console.log(" this element: " + JSON.stringify(data));
                console.log(" this notes: " + JSON.stringify(data.note));

                //    selecting where to populate notes      
                var holder = $("#modaling");

                holder.html("");
                //  looping and populating notes
                data.map(element => {

                    console.log(element.body)
                    console.log(element._id);
                    holder.append(`<div class="uk-card uk-card-small uk-card-default uk-card-hover" data-id="${element._id}"><h4 class="uk-card-body uk-inline" style="width:400px;">${element.body}</h4><button class="note-close uk-button uk-button-danger uk-button-small" data-id="${element._id}"><b>X</b>
                   </button></div><br>`)

                });

            })

    })

    //Delete the corresponding note
    $(document).on("click", ".note-close", function () {
        console.log("deleting");
        var dltId = $(this).attr("data-id");
        console.log(dltId);


        $.ajax({
            method: "delete",
            url: "/notes/" + dltId
        }).then(function (data) {
            console.log("Deletion completed" + data);
        })
        $(this).parent().remove()
    })




    // Click summit button on the modal to save
    $("#testing").keyup((event) => {

        event.preventDefault();

        if (event.keyCode === 13) {
            $("#sendbutton").click()
        }


    })

    // Sending the users input value in the modal and without redirecting
    $("#sendbutton").on("click", function () {
        //preventing submit from button
        event.preventDefault();
        //getting user input value from DOM 
        var userInput = $('#testing').val();
        console.log(userInput);
        $.ajax({
            url: "/article/" + thisId,
            method: "POST",
            data: {
                title: thisId,
                body: userInput
            }
        }).then(function (data) {
            console.log("is this it: " + JSON.stringify(data));
            //printing to confirm save at the frontends console
            var holder = $("#modaling");

            holder.html("");

            //  looping and populating notes
            data.map(element => {

                console.log(element.body)
                console.log(element._id);
                holder.append(`<div class="uk-card uk-card-small uk-card-default uk-card-hover" data-id="${element._id}"><h4 class="uk-card-body uk-inline" style="width:400px;">${element.body}</h4><button class="note-close uk-button uk-button-danger uk-button-small" data-id="${element._id}"><b>X</b>
               </button></div><br>`)
            });
        })
        //clearing the modals user input for feedback
        $("#testing").val("");
    })


    $(document).on("click", ".delete-button", function () {

        var delArticle = $(this).attr("data-id");
        console.log("Article id: " + delArticle);


        $.ajax({
            method: "DELETE",
            url: "/delete/" + delArticle
        }).then(() => {
            console.log("Article deleted")
        });
        $(this).parent().parent().parent().remove();

    })


});