// javascript for the image browsing app

var app = {
    // ajax variables that are important
    initialize : function() {
        this.searchterm = "cats";
        this.animalArray = ["cats", "dogs", "rabbits", "mongooses", "koalas", "manatees", "narwhals", "reindeer"];
        this.numberResults = 0;
        this.jaxNumber = 0;

        // Starts the button creation
        this.buttonArray(this.animalArray);
        this.inputListener();
    },

    inputFunction : function() {
        // Update the input as a value; set it as a local variable
        var input = $("input").val();
        // clear the input on the screen
        $("input").val("");

        // If the search term is new, add it to the array.
        if(this.animalArray.indexOf(input) === -1) {
            this.animalArray.push(input);
            this.buttonCreation(input)
        }

        // Update the searchterm with the input and do an image pull.
        // Should not hinder user from intended search of image.
        this.searchterm = input;
        this.imagepull();
    },

    // Functions
    buttonArray : function(array) {
        // Create buttons for the values in the searchArray.
        for(var i = 0; i < array.length ; i++) {
            this.buttonCreation(array[i])
        }

        this.buttonListener();
    },

    buttonCreation : function(value) {
        var buttondiv = $("<button>");
        buttondiv.addClass("btn btn-dark mx-2 my-1 button");
        buttondiv.text(value);

        $("#buttoncontainer").prepend(buttondiv);
    },

    imagepull : function() {
        // Wrap all 10 into a container
        imageContainer = $("<div>");
        imageContainer.addClass("container");

        // Add a header to this container
        imageHeader = $("<h2>");
        imageHeader.text(this.searchterm);

        // Create a new div that houses all the images and is a randompulldiv class, no longer id
        randompulldiv = $("<div>");
        randompulldiv.addClass("card-columns card-spacing randompulldiv");

        imageContainer.append(imageHeader, randompulldiv);
        $("#massivecontainer").prepend(imageContainer);

        this.jaxNumber = 0;

        for(var random = 0; random < 10; random++) {
            $.ajax({
                url: "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + 
                    this.searchterm,
                method: "GET"
            }).then( function(response) {
                var data = response.data;
                // container div
                var containerdiv = $("<div>");
                containerdiv.addClass("card border-secondary cardcontainer");

                // image div
                var img = $("<img>");
                img.addClass("card-img-top p-2 border-secondary image");
                img.attr("src", data.fixed_height_small_still_url);
                img.attr("state", "still");
                img.attr("animated", data.fixed_height_small_url);
                img.attr("still", data.fixed_height_small_still_url);

                // card body
                var cardbody = $("<div>");
                cardbody.addClass("card-body")

                // card details, currently has title.
                var title = $("<h5>");
                title.addClass("card-title");
                title.html(data.title);

                // Add a rating of the title

                // Add a heart for the image card

                cardbody.append(title);
                containerdiv.append(img, cardbody);

                $(randompulldiv).append(containerdiv);


                app.jaxNumber += 1;
                if(app.jaxNumber === 10) {

                    app.gifListener();
                }

            });
        }

    },

    buttonListener : function() {
        $(".button").off("click");
        app.buttonListenerVariable = $(".button").on("click", function() {

            app.searchterm = $(this).text();
            app.imagepull();
        })
    },

    inputListener : function() {
        $("#add").click(app.inputFunction)

        $("#input").keypress(newInput)

        function newInput(key) {
            if(key.keyCode === 13 && !(key.altKey)) {
                app.inputFunction();
            }
        }
    },

    gifListener : function() {
        $(".image").off("click");
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