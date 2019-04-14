// javascript for the image browsing app

var app = {
    // ajax variables that are important
    initialize : function() {
        this.searchterm = "cats"
    },

    // Functions
    imagepull : function() {
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?q=" + this.searchterm + "&api_key=dc6zaTOxFJmzC&limit=10",
            method: "GET"
        }).then( function(response) {
            console.log(response);

            var results = response.data;

            for (var i = 0; i < results.length; i++) {
              var gifDiv = $("<div>");
  
              var rating = results[i].rating;
  
              var p = $("<p>").text("Rating: " + rating);
  
              var personImage = $("<img>");
              personImage.attr("src", results[i].images.fixed_height.url);
  
              gifDiv.prepend(p);
              gifDiv.prepend(personImage);
  
              $("#randompulldiv").prepend(gifDiv);
            }

            // 
        })
    }
}

app.initialize();
app.imagepull();

//  "https://api.giphy.com/v1/gifs/search?q=" + person + "&api_key=dc6zaTOxFJmzC&limit=10"