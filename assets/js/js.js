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
            var data = response.data;

            for (var image = 0; image < data.length; image++) {
                var containerdiv = $("<div>");
                containerdiv.addClass("card border-secondary");

                var img = $("<img>");
                img.addClass("card-img-top p-2 border-secondary");
                img.attr("src", data[image].images.fixed_height.url)

                var cardbody = $("<div>");
                cardbody.addClass("card-body")

                    var title = $("<h5>");
                    title.addClass("card-title");
                    title.html(data[image].title);

                    cardbody.append(title);

                containerdiv.append(img, cardbody);

                $("#randompulldiv").prepend(containerdiv)
            }
        })
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