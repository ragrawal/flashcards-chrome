//===================================================
// DEFINE VIEW RELATED FUNCTIONS
//=====================================================

function vDeck(deck){
    this._deck = deck;
    this._curIdx = 0;

    /**
    * Returns card at the given index number 
    */
    this.get = function(idx){
        return $("#cards li a.thumbnail[data-idx=" + idx + "]");
    }

    /**
    * Renders all the cards
    */

    this.render = function(choice){
        
        this._deck.order(choice);

        this._curIdx = 0;
        
        // Update title
        $("#page-heading").text(this._deck.name());


        // remove existing elements and render cards
        var container = $("#cards");        
        container.empty();
        for(i=0; i<this._deck.size(); i+=1){
            var card = this._deck.get(i);
            var vCard = ""
            vCard += '<li class="col-sm-4 col-md-3 col-lg-3">';
            vCard += '<a href="#" data-toggle="modal" class="thumbnail name" data-idx=' + i + '>';
            vCard += '<h4 class="card-title">' + card.question() + '</h4>';
            vCard += '</a></li>';
            container.append(vCard);                                            
        }
        
        //highlight first card
        this.select(this._curIdx);
    };

    /**
    * Highlights a card
    */
    this.select = function(id){
        this.get(this._curIdx).removeClass('active');
        this._curIdx = id;
        this.get(this._curIdx).addClass('active');
    }

    /**
    * Opens a particular card
    */
    this.open = function(){

    }


}






/**
* Render Deck
*/
function renderDeck(deck){
    
}

