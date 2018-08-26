$(document).ready(function () {


    // saving articles
    $(document).on("click",".articles",function(){

        var artId = $(this).attr("data-id");
        
        console.log("click");

        $.ajax({
            method:"PUT",
            url:"/saved/"+artId,

        }).then((sArticle)=>{

            console.log(sArticle);

        })

        $(this).parent().parent().parent().remove()
        
    });




});
