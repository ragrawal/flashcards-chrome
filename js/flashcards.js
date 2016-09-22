// global variables
console.log("Within Flashcards");

var keyboardNav = true;
text = document.body.innerHTML;
text = text.replace(/^<pre.*>/, '').replace(/<\/pre>$/,''); //Aggressively strip HTML.


// render page with the template
function renderTemplate(){
    $.get(chrome.extension.getURL("template.html"), function(page){
        document.body.innerHTML = page;

    });
}


function randomize(parent){

    var elems = $(parent).children();
    while (elems.length) {
        $(parent).append(elems.splice(Math.floor(Math.random() * elems.length), 1)[0]);
    };
}

function sort(parent){
  
    var elems = $(parent).children();
    var keyToElem = {};
    var keys = [];
    $.each(elems, function(idx, elem){
        var key = $(elem).text();
        keyToElem[key] = elem;
        keys.push(key);
    });
    $.each(keys.sort().reverse(), function(idx, key){
        console.log(key);
        var elem = keyToElem[key];
        $(elem).detach().prependTo(parent);
    });
}


function populateCards(){

    var headElement = document.getElementsByTagName("head")[0];
    var css = ["bootstrap.min.css"
                , "bootstrap-select.min.css"
                , "flipclock.css"
                , "flashcards.css"                
            ];
    for(i=0; i<css.length; i+=1){
        var styleTag = document.createElement("link");
        styleTag.rel="stylesheet";
        styleTag.type="text/css";
        styleTag.href=chrome.extension.getURL("css/" + css[i]);
        headElement.appendChild(styleTag);
    };

    var converter = new showdown.Converter({
        literalMidWordUnderscores: true, 
        extensions: ['prettify']
    });
                
    var numCards = 0
    var tokens = text.split(/^##\s/m);
    console.log(tokens.length);

    $.each(tokens, function(secNo, section){

        if(secNo == 0){
            $("#page-heading").text(section.replace("#", "").trim());
            return true;
        }

        var chunks = section.split('\n');
        var arr = [chunks.shift(), chunks.join('\n')];
        var heading = arr[0];
        var body = arr[1];

          // $("#cards").append('<div class="col-md-3"><a href="#" data-toggle="modal" data-target="#card' + secNo + '" class="thumbnail well card-thumbnail"><h3>' + heading + '</h3></a></div>');
        $("#cards").append('<li class="col-sm-4 col-md-3 col-lg-3"><a href="#" data-toggle="modal" data-target="#card' + secNo + '" class="thumbnail name well"><h4>' + heading + '</h4></a></li>');                                            

        $("body").append('<div class="modal fade" id="card' + secNo + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h1 class="modal-title">' + heading + '</h1></div><div class="modal-body"><div class="card-content">' + converter.makeHtml(body) + '</div></div></div></div></div>');


        numCards += 1;

    });

    var js = [ "jquery.js"
                , "bootstrap.min.js", "bootstrap-select.min.js"
                , "bootstrap-select.min.js"
                , "list.js", "list.fuzzysearch.js"
                , "flipclock.min.js"
                ]
    for(i=0; i<js.length; i+=1){
        var scriptTag = document.createElement("script");
        scriptTag.type = "text/javascript"
        scriptTag.src=chrome.extension.getURL("js/" + js[i]);
        headElement.appendChild(scriptTag);
    }

  //       , "vendor/showdown-1.4.2/dist/showdown.js" , "vendor/showdown-1.4.2/dist/showdown-prettify.min.js"


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




    plugins = [ ListFuzzySearch() ];

    var cardsList = new List('cards-list', { 
      valueNames: ['name'], 
      plugins: plugins 
    });

    $("#cards li a").bind('click', function(obj){
        $("#cards li a.active").removeClass("active");
        $(this).addClass("active");
    });

    $("#card-shuffle").bind('click', function(obj){
        console.log("calling randomize");
        randomize("#cards");
    })

    $("#card-sort").bind('click', function(obj){
        sort("#cards");
    })

    $('#card-search').keyup(function() {
      cardsList.search($(this).val());
    });

    $("#cards li:first-child a").addClass("active");


    $('input:text').bind('focus', function (event) {
        keyboardNav = false;
    }).bind('blur', function (event) {
        keyboardNav = true;
    }).bind('keyup', function(event){
        if (event.keyCode == 13) {
            event.preventDefault();                        
            keyboardNav = true;
            $(this).blur();
            if($("#cards li").length > 0) {
                $("#cards li:first-child a").addClass("active");
            };
        };
    });

    if (window == top) {
        window.addEventListener('keyup', doKeyPress, false); //add the keyboard handler
    }
}

/*
Returns card for which modal window is open
*/
function getCurrentCard(){
    var openCard = null;
    $(".modal").each(function(){
      if (
           ($(this).data('bs.modal') || {isShown: false}).isShown == true)
      {
        openCard = this;
        return false;
      }
    });
    return openCard;

}

/*
Opens card with an active class
*/
function openCard(always) {
    var currentCard = getCurrentCard();
    if (currentCard != null){
        $(currentCard).modal('hide');                
    };
    if(always == true){
        // var clock = $('.flipclock').FlipClock(10, {
        //             clockFace: 'Counter',
        //             countdown: true
        //         });

        //         setTimeout(function() {
        //             setInterval(function() {
        //                 clock.decrement();
        //             }, 1000);
        //         });
        $($("#cards li a.active").data('target')).modal('show');
    };
    
};

function closeCard(){
    var elem = getCurrentCard();
    if(elem != null){
        $(elem).modal('hide');   
    };
    return elem;
}







function doKeyPress(e){
    if (keyboardNav == false){
        return ;
    }

    var currentCard = getCurrentCard();
    // Use j to go forward
    // console.log(e.which);

    //use up arrow key to go previous row
    if (e.which == 38) {
        var elem = $("#cards li a.active");
        if (elem.length > 0){
            var parent = elem.parent();
            for(i=0; i<4; i+=1){
                if(parent != null ){
                    parent = parent.prev();
                }else{
                    break;
                }
            }
            if(parent != null ){
                elem.removeClass("active");
                parent.find("a").addClass("active");
            }
        }
        openCard(always=(currentCard != null));

    }
    else if (e.which == 40){
        var elem = $("#cards li a.active");
        if (elem.length > 0){
            var parent = elem.parent();
            for(i=0; i<4; i+=1){
                if(parent != null ){
                    parent = parent.next();
                }else{
                    break;
                }
            }
            if(parent != null ){
                elem.removeClass("active");
                parent.find("a").addClass("active");
            }
        }
        openCard(always=(currentCard != null));
    }
    // use right arrow key to go next
    else if (e.which == 39) {
        var elem = $("#cards li a.active");
        if (elem.length == 0){
            $("#cards li:first-child a").addClass("active");
        }
        else if (elem.parent().is(':last-child')){
            elem.removeClass("active");
            $("#cards li:first-child a").addClass("active");

        }
        else{
            elem.removeClass("active");
            elem.parent().next().find("a").addClass("active");
        }
        openCard(always=(currentCard != null));
        
    }
    //Use left arrow key to go back
    else if(e.which == 37){

        var elem = $("#cards li a.active");
        if (elem.length == 0){
            $("#cards li:last-child a").addClass("active");
        }
        else if (elem.parent().is(':first-child')){
            elem.removeClass("active");
            $("#cards li:last-child a").addClass("active");

        }
        else{
            elem.removeClass("active");
            elem.parent().prev().find("a").addClass("active");
        }
        openCard(always=(currentCard != null));
    }
    // Use o to open
    else if (e.which == 79){
        openCard(always=true);
    }
    // use esc to close modal box
    else if (e.keyCode === 27){
        if(currentCard != null){
            $(currentCard).modal('hide');   
        }
    }
    // use / to activate search box
    else if (e.which == 191){
        closeCard();
        $("#card-search").focus();
    }
    // use s to shuffle cards
    else if (e.which == 83){
        $("#cards").randomize();
    }
                        
};

console.log("Running flashcards")
renderTemplate();



chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {

                clearInterval(readyStateCheckInterval);

                populateCards();


                $('#card-search').bind('focus', function (event) {
                    keyboardNav = false;
                })
                .bind('blur', function (event) {
                    keyboardNav = true;
                })
                .bind('keyup', function(event){
                    if (event.keyCode == 13) {
                        event.preventDefault();                        
                        keyboardNav = true;
                        $(this).blur();
                        if($("#cards li").length > 0) {
                            $("#cards li:first-child a").addClass("active");
                        };
                    };
                });

                $('.selectpicker').selectpicker({
                  style: 'btn-default',
                  size: 4
                });

                $('.modal')
                    .on('show.bs.modal', function() {
                        var wait = parseInt($(".selectpicker option:selected").val())
                        var modalElem = $(this);
                        if(wait > 0){
                            var body = $(this).find('.modal-body');
                            
                            //hide content
                            var content = $(body).children('.card-content');
                            
                            // add flipclick
                            $(content).before('<div class="pull-right"><div class="flipclock"></div></div>');
                            var flipclock = $(body).find('.flipclock');


                            
                            
                            var clock = new FlipClock($(flipclock), wait, {
                                clockFace: 'Counter',
                                countdown: true,
                                autoStart: true,
                                callbacks: {
                                    create: function(){
                                        $(content).hide();
                                    },
                                    stop: function() {
                                        console.log('STOPPED');
                                        $(content).show();
                                        $(flipclock).remove();
                                    }
                                }
                            });

                        }
                    })
                    .on('hide.bs.modal', function(){
                        var clock = $(this).find('.flipclock');
                        if(clock != null ){
                            $(clock).remove();
                        }
                    });
        };      
    }, 10);
});






