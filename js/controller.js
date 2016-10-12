// Initialize Global Variables
text = document.body.innerHTML.replace(/^<pre.*>/, '').replace(/<\/pre>$/,''); 
var deck = null;
var deckId = 0;
var keyboardNav = true;
var questionContainer = null;
var converter = new showdown.Converter({
    literalMidWordUnderscores: true, 
    extensions: ['prettify', 'table']
});




function initializeView(choice){
    decks[deckId].order(choice);
    vdeck = new vDeck(decks[deckId]);
    vdeck.render();
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
                        , "https://fonts.googleapis.com/css?family=Open+Sans:400,700"
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
            decks = parse(text);
            deckId = 0;
            vdeck = new vDeck(decks[deckId]);
            vdeck.render('reset');

            // bind interactions
            $(".btn-sort").bind('click', function(){
                vdeck.render($(this).data('choice'));
            })

        };      
    }, 10);
});


// Load template
$.get(chrome.extension.getURL("template.html"), function(page){
    document.body.innerHTML = page;
});







