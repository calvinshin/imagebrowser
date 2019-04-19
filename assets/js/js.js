// javascript for the image browsing app

var app = {
    // ajax variables that are important
    initialize : function() {
        this.searchterm = "cat";
        this.animalArray = JSON.parse(localStorage.getItem("searchArray"));
        if(!Array.isArray(this.animalArray)) {
            this.animalArray = ["cat", "dog", "rabbit", "mongoose", "koala", "manatee", "narwhal", "reindeer"];
        };
        this.numberResults = 0;
        this.jaxNumber = 0;
        this.favoriteArray = JSON.parse(localStorage.getItem("favoriteArray"));
        if(!Array.isArray(this.favoriteArray)) {
            this.favoriteArray = [
                {fixed_height_small_still_url : "assets/other/playgif.gif",
                fixed_height_small_url : "assets/other/playgif.gif",
                title : "click a gif to play it"},
                {fixed_height_small_still_url : "assets/other/instructions.gif",
                fixed_height_small_url : "assets/other/instructions.gif",
                title : "click a button to get started"}
                ];
        };

        this.localStorageFavoriteCreation();

        // Starts the button creation
        this.buttonArray(this.animalArray);
        this.allListeners();
    },

    localStorageFavoriteCreation : function() {
        // Starts the favorite list with previously created items
        var randompulldiv = $("<div>");
        randompulldiv.addClass("randompulldiv")
        $("#massivecontainer").append(randompulldiv);

        // Creates a card in the regular massivecontainer div
        for(var i = 0; i < this.favoriteArray.length; i++) {
            this.cardCreator(this.favoriteArray[i]);
        }

        // use the favoritecreator for each card in this randompulldiv
        // this array is not a jquery item, so cannot use jquery on it; must use vanilla
        var testarray = $(".cardcontainer");

        for(var j = 0; j < testarray.length; j++) {
            testarray[j].classList.add("mt-2");
            $("#sidebarimage").prepend(testarray[j]);

            // Change the heart to a X
            var favoriteButton = $(".cardcontainer").find(".fa-heart");
            favoriteButton.removeClass("fa-heart btn-outline-danger");
            favoriteButton.addClass("fa-times-circle btn-outline-dark");
        }

        // remove the randompulldiv
        randompulldiv.remove();
    },
    
    // triggered on the input being pressed
    inputFunction : function() {
        if($("#input").val().trim() != "") {
            $("#mainwindow").animate({scrollTop : 0}, 500);
            // Update the input as a value; set it as a local variable
            var input = $("#input").val().trim().toLowerCase();
            // clear the input on the screen
            $("#input").val("");

            // If the search term is new, add it to the array.
            if(app.animalArray.indexOf(input) === -1) {
                // push this to localstorage; due to the prepend of the buttons, push is usable. If items were appended, an unshift would be used instead
                app.animalArray.push(input);
                localStorage.setItem("searchArray", JSON.stringify(app.animalArray));

                // Create a new button
                app.buttonCreation(input);
            }

            // Update the searchterm with the input and do an image pull.
            // Should not hinder user from intended search of image.
            app.searchterm = input;
            app.imagepull();
        }
        else{
            $("input").val("");
        }
    },

    // Functions
    buttonArray : function(array) {
        // Create buttons for the values in the searchArray.
        localStorage.setItem("searchArray", JSON.stringify(this.animalArray));

        for(var i = 0; i < array.length ; i++) {
            this.buttonCreation(array[i]);
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

        buttondiv.append(textdiv, closediv);

        $("#buttoncontainer").prepend(buttondiv);

        this.buttonListener();
    },

    imagepull : function() {
        // Wrap all 10 into a container
        var imageContainer = $("<div>");
        imageContainer.addClass("container");

        // Add a header to this container
        var imageHeader = $("<h2>");
        imageHeader.text(this.searchterm);

        // Create a new div that houses all the images and is a randompulldiv class, no longer id
        var randompulldiv = $("<div>");
        randompulldiv.addClass("card-columns card-spacing randompulldiv");

        imageContainer.append(imageHeader, randompulldiv);
        $("#massivecontainer").prepend(imageContainer);

        // use this to check the ajax and see its current state
        var jaxNumber = 0;

        // disable the use of the listeners while the function is running;
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
        img.attr("alt", data.title);

        // card body
        var cardbody = $("<div>");
        cardbody.addClass("card-body row")

        // card details, currently has title.
        var title = $("<h5>");
        title.addClass("card-title col-9 m-0");
        title.html(data.title);


        var buttondiv = $("<div>");
        buttondiv.addClass("col-3 m-0 p-0");

        // Add a heart for like
        var hearti = $("<i>");
        hearti.addClass("btn btn-outline-danger btn-sm btn-block fas fa-heart m-0 pz-0");

        // Add a copy for copying the url
        var copyi = $("<i>");
        copyi.addClass("btn btn-outline-primary btn-sm btn-block fas fa-link m-0 pz-0");
        copyi.attr("link", data.fixed_height_small_url);

        buttondiv.append(hearti, copyi);
        cardbody.append(title, buttondiv);
        containerdiv.append(img, cardbody);

        $(".randompulldiv:first").append(containerdiv);
    },

    // Given some card, create a copy of the card into favorites. Need this separate to recreate favorites on reload.
    favoriteCreator : function(card) {
        // Add a new class for the container to have a margin top of 2
        card.addClass("mt-2");
        // prepend the image to the favorite
        $("#sidebarimage").prepend(card);

        // Change the heart to a X on the clone
        var favoriteButton = card.find(".fa-heart");
        favoriteButton.removeClass("fa-heart btn-outline-danger");
        favoriteButton.addClass("fa-times-circle btn-outline-dark");

        // Change the function of the X to a new listener; closeFavoriteListener.
        app.allListeners();
    },

    // an object that creates an object for localStorage. Required for both adding and removing favorites.
    favoriteObjectCreator : function(favorite, isAdd) {
        // Create a starter to pull all the content for the localStorage object
        var favoriteArrayStarter = favorite.children(".image")[0];

        // Create an object to push into localStorage
        var favoriteObject = {
            fixed_height_small_still_url : favoriteArrayStarter.getAttribute("still"),
            fixed_height_small_url : favoriteArrayStarter.getAttribute("animated"),
            title : favoriteArrayStarter.alt,
        };

        if(isAdd === 1) {
            // push the object into the favoriteArray
            this.favoriteArray.push(favoriteObject);
            localStorage.setItem("favoriteArray", JSON.stringify(app.favoriteArray));
        }
        else {
            this.favoriteArray.splice(this.favoriteArray.indexOf(favoriteObject), 1);
            localStorage.setItem("favoriteArray", JSON.stringify(app.favoriteArray));
        }
    },

    allListeners : function() {
        // turn back on the listeners
        this.gifListener();
        $(".button").attr("disabled", false);
        this.inputListener();
        this.favoriteListener();
        this.closeFavoriteListener();
        this.copyListener();
        this.closeButtonListener();
    },

    buttonListener : function() {
        $(".button").off("click");
        // now doesn't trigger on the entire button, just on the text.
        app.buttonListenerVariable = $(".button").on("click", ":not(.close)", function() {
            // console.log("test");
            app.searchterm = $(this).text();
            app.imagepull();
            $("#sidebarheader").select();
        })
    },

    closeButtonListener : function() {
        $(".close").off("click");
        app.closeButtonVariable = $(".close").on("click", function() {
            // remove the item from the array app.animalArray
            var removedItem = $(this).parent().children(".text").text();
            app.animalArray.splice(app.animalArray.indexOf(removedItem), 1);

            // Update the localstorage array
            localStorage.setItem("searchArray", JSON.stringify(app.animalArray));

            // remove the button
            $(this).parent().remove();
        });
    },

    // Listens to the input from the text field
    inputListener : function() {
        // Triggers the inputFunction on the add button
        $("#add").on("click", app.inputFunction);

        // Pressing enter or alt will tigger the inputFunction
        $("#input").on("keypress", newInput);

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
                $(this).attr("src", $(this).attr("animated"));
                $(this).attr("state", "animated");
            }
            else {
                $(this).attr("src", $(this).attr("still"));
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
            var isAdd = 1;

            $("#sidebar").animate({scrollTop : 0}, 500);

            app.favoriteObjectCreator(favorite, isAdd);

            app.favoriteCreator(favorite);
        });
    },

    closeFavoriteListener : function() {
        $(".fa-times-circle").off("click");
        app.closeFavoritesListenerVariable = $(".fa-times-circle").on("click", function () {
            var favorite = $(this).parent().parent().parent().clone();
            var isAdd = 0;

            app.favoriteObjectCreator(favorite, isAdd);

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
            $("#uniquecopy").addClass("test");
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