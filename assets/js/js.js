// javascript for the image browsing app

var app = {
    // ajax variables that are important
    initialize : function() {
        this.searchterm = "cats";
        this.animalArray = ["cats", "dogs", "rabbits", "mongooses", "koalas", "manatees", "narwhals", "reindeer"];
        this.numberResults = 0;
        this.buttonCreation(this.animalArray);  
    },

    // Functions
    buttonCreation : function(array) {
        // Create buttons for the values in the searchArray.
        for(var i = 0; i < array.length ; i++) {
            var buttondiv = $("<button>");
            buttondiv.addClass("btn btn-dark mx-2 my-1 button");
            buttondiv.text(array[i]);

            $("#buttoncontainer").append(buttondiv);
        }

        this.buttonListener();
    },

    imagepull : function() {
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?q=" + 
                this.searchterm + "&api_key=dc6zaTOxFJmzC&limit=10",
            method: "GET"
        }).then( function(response) {
            console.log(response);
            var data = response.data;

            for (var image = 0; image < data.length; image++) {
                // container div
                var containerdiv = $("<div>");
                containerdiv.addClass("card border-secondary cardcontainer");

                // image div
                var img = $("<img>");
                img.addClass("card-img-top p-2 border-secondary image");
                img.attr("src", data[image].images.fixed_height_still.url)
                img.attr("state", "still")
                img.attr("animated", data[image].images.fixed_height.url)
                img.attr("still", data[image].images.fixed_height_still.url)

                var cardbody = $("<div>");
                cardbody.addClass("card-body")

                var title = $("<h5>");
                title.addClass("card-title");
                title.html(data[image].title);

                cardbody.append(title);
                containerdiv.append(img, cardbody);

                // problem: cards due things top down, then left right. Images should be inserted so all 10 images are viewable immediately.
                if(app.numberResults === 0) {
                    $("#randompulldiv").prepend(containerdiv)
                }
                // else if(image === 0) {
                //     $("#randompulldiv").prepend(containerdiv);
                //     console.log("test0");
                // }
                else if(image <= 3) {
                    console.log("first 3")
                    // var insertfirst = Math.floor(app.numberResults / 3) * 2 + 1
                    var insertfirst = app.numberResults - 3 * app.numberResults / 10 + 1;
                    console.log(insertfirst);
                    containerdiv.insertBefore($(".cardcontainer:nth-child(" + insertfirst + ")"));
                }
                else if(image <= 6) {
                    console.log(Math.floor(app.numberResults / 3) * 2 + 1);
                    console.log("second 3")
                    var insertsecond = app.numberResults - 6 * app.numberResults / 10 + 1;
                    console.log(insertsecond);
                    containerdiv.insertBefore($(".cardcontainer:nth-child(" + insertsecond + ")"));
                }
                else{
                    console.log($(".cardcontainer:nth-child(1)"));
                    console.log("last 3")
                    containerdiv.insertBefore($(".cardcontainer:nth-child(" + 1 + ")"));
                }

                // $("#randompulldiv").prepend(containerdiv)
            }
            app.gifListener();
            app.numberResults += 10;
        })
    },

    buttonListener : function() {
        app.buttonListenerVariable = $(".button").on("click", function() {

            app.searchterm = $(this).text();
            app.imagepull()
        })
    },

    gifListener : function() {
        // console.log("confirmed")
        app.gifListenerVariable = $(".image").on("click", function() {
            var state = $(this).attr("state");
            if(state === "still") {
                $(this).attr("src", $(this).attr("animated"))
                $(this).attr("state", "animated");
            }
            else {
                $(this).attr("src", $(this).attr("still"))
                $(this).attr("state", "still");
            }
        });
    }
}

app.initialize();
app.imagepull();



//  "https://api.giphy.com/v1/gifs/search?q=" + person + "&api_key=dc6zaTOxFJmzC&limit=10"


// <div class="card border-secondary">
//     <img class="card-img-top p-2 border-secondary" src="C:\Users\Calvin2\Desktop\Pixels\fantasyenemycreatures_windows\FantasyEnemyCreatures\Minotaur\Gifs\128x80Minotaur_Attack.gif" alt="Pokemon Hangman">
//     <div class="card-body">
//         <h5 class="card-title">Pokemon Hangman</h5>
//         <p class="card-text">Pokemon hangman game using vanilla js and bootstrap. Uses functional programming.</p>
//     </div>
// </div>