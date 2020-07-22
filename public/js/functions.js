/* global */
$(document).ready(function(){
    /*Event when clicking on any favorite icon 
    icon swaps from empty to fill */
    $(".favoriteIcon").on("click", function(){
        
        let queryString = window.location.search;
        let urlParams   = new URLSearchParams(queryString);
        let keyword     = urlParams.get("keyword");

        let imageURL = $(this).prev().attr("src");

        if($(this).attr("src") == "img/favorite.png"){
            $(this).attr("src" ,"img/favorite_on.png");
            updateFavorite("add", imageURL, keyword);
        }
        else{
            $(this).attr("src", "img/favorite.png");
            updateFavorite("delete", imageURL, keyword);
        }
    }); //favoriteIcon
    
    function updateFavorite(action, imageURL, keyword){
        $.ajax({
            method: "get",
            url: "/api/updateFavorites",
            data : {
                "action": action,
                "imageURL":imageURL,
                "keyword":keyword
            },
            success: function(data, satus){
            }
        });//ajax
    }//updateFavorite
    
    //When clicking on any keyword link, 
//all corresponding images are displayed 
$(".keywordLink").on("click", function(){
                
  let keyword = $(this).html().trim();  
  $("#keywordSelected").val(keyword);
  $.ajax({
    method: "get",
       url: "/api/getFavorites",
      data: {
              "keyword": keyword
            },
    success: function(data, status) {

             $("#favorites").html("");
             let htmlString = "";
             data.forEach(function(row){
                htmlString += "<img class='image' src='"+row.imageURL+"' width='200' height='200'>";
                htmlString += "<img class='favoriteIcon' src='img/favorite_on.png' width='20'>";
                });
                  
           $("#favorites").append(htmlString);
        }
    });//ajax

});//keywordLink
//Event for dynamic content generated when clicking on a keyword    
$("#favorites").on("click", ".favoriteIcon", function(){
            
  let favorite = $(this).prev().attr("src");
        
  if ($(this).attr("src") == 'img/favorite.png') {
            $(this).attr("src","img/favorite_on.png");
     updateFavorite("add",favorite, $("#keywordSelected").val());
        } else {
            $(this).attr("src","img/favorite.png");
     updateFavorite("delete",favorite);
   }
});//.favoriteIcon

});