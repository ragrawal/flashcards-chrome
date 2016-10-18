


function doKeyPress(e){
    
    if (keyboardNav == false){
        return ;
    }

    //use up arrow key to go previous row
    if (e.which == 38) {
        e.preventDefault(); 
        vdeck.up();
    }
    //use down arrow key to go to next row
    else if (e.which == 40){
        e.preventDefault(); 
        vdeck.down();
    }
    // use right arrow key to go next
    else if (e.which == 39) {
        e.preventDefault(); 
        vdeck.next();
    }
    //Use left arrow key to go back
    else if(e.which == 37){
      e.preventDefault(); 
      vdeck.prev();
    }
    // Use o to open
    else if (e.which == 79){
      vdeck.open(null);
    }
    // use esc to close modal box
    else if (e.keyCode === 27){
      e.preventDefault(); 
      vdeck.close();
    }
    // use / to activate search box
    else if (e.which == 191){
      e.preventDefault(); 
      // vdeck.close();
      $("#card-search").focus();
    }
};


chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            //
            // Add Static Resources
            //
            var headElement = document.getElementsByTagName("head")[0];

            // add CSS 
            var css = ["css/bootstrap.min.css"
                        , "css/bootstrap-select.min.css"
                        , "css/flipclock.css"
                        , "css/flashcards.css"
                        , "css/font.css"
                    ];
            for(i=0; i<css.length; i+=1){
                var styleTag = document.createElement("link");
                styleTag.rel="stylesheet";
                styleTag.type="text/css";
                styleTag.href=chrome.extension.getURL(css[i]);
                headElement.appendChild(styleTag);
            };

            // add javascript
            var config = document.createElement("script");
            config.type = "text/x-mathjax-config";
            config.innerHTML = 'MathJax.Hub.Config({' + 
                    'extensions: ["tex2jax.js"],' + 
                    'jax: ["input/TeX", "output/HTML-CSS"],' + 
                    'tex2jax: {inlineMath: [["$","$"], ["\\(","\\)"]]},' + 
                    'processEscapes: true'+
                    '});'
            headElement.appendChild(config);

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
            headElement.appendChild(script);


            // Parse Markdown File and Render 
            decks = parse(text, converter);
            deckId = 0;
            vdeck = new vDeck(decks[deckId]);
            vdeck.render('reset');

            // bind interactions
            $(".btn-sort").bind('click', function(){
                vdeck.sort($(this).data('choice'));
            });


            // bind actions to search box
            $('#card-search').bind('focus', function (event) {
                keyboardNav = false;
            }).bind('blur', function (event) {
                keyboardNav = true;
            }).bind('keyup', function(event){
                vdeck.search($(this).val());
                if (event.keyCode == 13) {
                    event.preventDefault();                        
                    keyboardNav = true;
                    $(this).blur();
                    vdeck.select(1);
                };
            });

            $(".question-prev").bind('click', function(e){
                e.preventDefault(); 
                vdeck.prev();
            });
            $(".question-next").bind('click', function(e){
                e.preventDefault();
                vdeck.next();
            });

            //add the keyboard handler
            if (window == top) {
                window.addEventListener('keyup', doKeyPress, false); 
            }            

        };      
    }, 10);
});


// Initialize Global Variables
if(document.body.innerHTML.startsWith('<!-- MARKDOWN DECK -->') == false){
    text = document.body.innerHTML.replace(/^<pre.*>/, '').replace(/<\/pre>$/,''); 
    var deck = null;
    var deckId = 0;
    var keyboardNav = true;
    var questionContainer = null;
    var converter = new showdown.Converter({
        literalMidWordUnderscores: true, 
        extensions: ['prettify', 'table']
    });
    // Load template
    $.get(chrome.extension.getURL("template.html"), function(page){
        document.body.innerHTML = page;
    });
}
else{
    alert('Markdown Deck is already loaded.');
}








