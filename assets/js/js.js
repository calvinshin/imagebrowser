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

    // triggered on the input being pressed
    inputFunction : function() {
        if($("input").val().trim() != "") {
            // Update the input as a value; set it as a local variable
            var input = $("input").val().trim();
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
        }
        else{
            $("input").val("");
        }
    },

    // Functions
    buttonArray : function(array) {
        // Create buttons for the values in the searchArray.
        for(var i = 0; i < array.length ; i++) {
            this.buttonCreation(array[i])
        }
    },

    buttonCreation : function(value) {
        var buttondiv = $("<button>");
        buttondiv.addClass("btn btn-dark mx-2 my-1 button");

        var textdiv = $("<div>");
        textdiv.addClass("text")
        textdiv.text(value);

        var closediv = $("<div>");
        closediv.text("x");
        closediv.addClass("close");

        buttondiv.append(textdiv, closediv)

        $("#buttoncontainer").prepend(buttondiv);

        this.buttonListener();
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

        // use this to check the ajax and see its current state
        var jaxNumber = 0;

        // disable the use of the listeners;
        $(".button").attr("disabled", true);
        $("#add").off("click");
        $("#input").off("keypress");


        for(var random = 0; random < 10; random++) {
            $.ajax({
                url: "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + 
                    this.searchterm,
                method: "GET"
            }).then( function(response) {
                var data = response.data;

                // Trigger the card creator function
                app.cardCreator(data);

                jaxNumber += 1;
                if(jaxNumber === 10) {
                    app.allListeners();
                    // // turn back on the listeners
                    // app.gifListener();
                    // $(".button").attr("disabled", false);
                    // app.inputListener();
                    // app.favoriteListener();
                    // app.copyListener();
                }

            });
        }

    },

    cardCreator : function(data) {
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
        cardbody.addClass("card-body row")

        // card details, currently has title.
        var title = $("<h5>");
        title.addClass("card-title col-9 m-0");
        title.html(data.title);


        var buttondiv = $("<div>");
        buttondiv.addClass("col-3 m-0 p-0")

        // Add a heart for like
        var hearti = $("<i>");
        hearti.addClass("btn btn-outline-danger btn-sm btn-block fas fa-heart m-0 pz-0")

        // Add a copy for copying the url
        var copyi = $("<i>");
        copyi.addClass("btn btn-outline-primary btn-sm btn-block fas fa-link m-0 pz-0")
        copyi.attr("link", data.fixed_height_small_url)

        // Add a link to go to Giphy page (navigate, go to)

        buttondiv.append(hearti, copyi);
        cardbody.append(title, buttondiv);
        containerdiv.append(img, cardbody);

        $(randompulldiv).append(containerdiv);
    },

    allListeners : function() {
        // turn back on the listeners
        this.gifListener();
        $(".button").attr("disabled", false);
        this.inputListener();
        this.favoriteListener();
        this.closeFavoriteListener();
        this.copyListener();
    },

    buttonListener : function() {
        $(".button").off("click");
        app.buttonListenerVariable = $(".button").on("click", function() {
            console.log($(this).children(".text").text())
            app.searchterm = $(this).children(".text").text();
            app.imagepull();
            $("#sidebarheader").select();
        })
    },

    // Listens to the input from the text field
    inputListener : function() {
        // Triggers the inputFunction on the add button
        $("#add").on("click", app.inputFunction)

        // Pressing enter or alt will tigger the inputFunction
        $("#input").on("keypress", newInput)

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
    },

    // Listens for any favorite clicks
    favoriteListener : function() {
        $(".fa-heart").off("click");
        app.favoriteListenerVariable = $(".fa-heart").on("click", function () {
            // Create a copy of the entire div
            var favorite = $(this).parent().parent().parent().clone();
            // Add a new class for the container to have a margin top of 2
            favorite.addClass("mt-2");
            // prepend the image to the favorite
            $("#sidebarimage").prepend(favorite);

            // Change the heart to a X
            var favoriteButton = favorite.find(".fa-heart");
            favoriteButton.removeClass("fa-heart btn-outline-danger");
            favoriteButton.addClass("fa-times-circle btn-outline-dark")

            console.log(favorite);

            // Change the function of the X to a new listener; closeFavoriteListener.

            app.allListeners();
        });
    },

    closeFavoriteListener : function() {
        $(".fa-times-circle").off("click");
        app.closeFavoritesListenerVariable = $(".fa-times-circle").on("click", function () {
            $(this).parent().parent().parent().remove();
            app.allListeners();
        });
    },

    // listens for any copy clicks
    copyListener : function() {
        $(".fa-link").off("click");
        app.copyListenerVariable = $(".fa-link").on("click", function() {
            // Create an input that will instantaneously be created to copy the value
            var copydiv = $("<input>");
            // Add the text of the attribute link
            copydiv.val($(this).attr("link"));
            copydiv.attr("id", "uniquecopy");
            // append the child to select and copy the text
            $("#sidebar").append(copydiv);
            $("#uniquecopy").addClass("test")
            $("#uniquecopy").select();
            
            document.execCommand("copy");
            // remove the copy so there is no trace
            copydiv.remove();

            // Replace the classes fa-link -> fa-check && btn-outline-primary -> btn-outline-success
            $(this).removeClass("fa-link btn-outline-primary");
            $(this).addClass("fa-check btn-outline-success");
            var intervalDiv = $(this);
            
            // set interval to undo the class changes;
            setTimeout(function() {
                intervalDiv.addClass("fa-link btn-outline-primary");
                intervalDiv.removeClass("fa-check btn-outline-success");
            }, 1000)
        })
    },
}

app.initialize();