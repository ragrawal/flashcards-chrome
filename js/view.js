//===================================================
// DEFINE VIEW RELATED FUNCTIONS
//=====================================================

function vDeck(deck){
    this._deck = deck;
    this._curIdx = 1;

    var vcard = '<li class="col-sm-4 col-md-3 col-lg-3">';
    vcard += '<a href="#" data-toggle="modal" class="thumbnail">';
    vcard += '<h4 class="card-title question"></h4>';
    vcard += '<input type="hidden" class="originalIdx"></input>'
    vcard += '<div class="answer" style="display:none"></input>'
    vcard += '</a></li>';

    this._listSearch =  new List('cards-list', { 
        valueNames: ['question', 'originalIdx', 'answer'], 
        item: vcard,
        plugins: [ ListFuzzySearch() ] 
    });

    this._container = $("#cards");
    this._modal = $("#showcard");


    /**
    * Returns card at the given index number 
    */
    this.get = function(idx){
        return this._container.children('li:nth-child(' + idx + ')').find('a');
    }

    /**
    * Highlights a card
    */
    this.select = function(id){

        // Change Selection
        if(id > 0 && id <= this._deck.size()){
            this.get(this._curIdx).removeClass('active');
            this._curIdx = id;
            this.get(this._curIdx).addClass('active');
        }

        // Open Answer Window
        if(this._modal.hasClass('in')){
            // this._modal.modal('hide');
            this.open(id);
        }
    }

    /**
    * Renders all the cards
    */

    this.render = function(choice){
        
        this._curIdx = 1;
        this._state = null;
        
        // Update title
        $("#page-heading").text(this._deck.name());

        // remove existing elements and render cards
        this._container.empty();
        for(i=0; i<this._deck.size(); i+=1){
            var card = this._deck.get(i);
            this._listSearch.add({
                question: card.question(), 
                originalIdx: card.origianlIdx(),
                answer: card.answer()
            });
        }

        var viewObj = this;

        this._container.on('click', 'li a', function(){
            var idx = $(this).parents('li').index() + 1;
            viewObj.select(idx);
            viewObj.open(idx);
        });





        //highlight first card
        this.select(this._curIdx);
    };


    /**
    * move selection 
    */
    this.down = function(){
        this.select(this._curIdx + 4);
    }

    this.up = function(){
        this.select(this._curIdx - 4);
    }

    this.next = function(){
        console.log('called next');
        this.select(this._curIdx + 1);
    }

    this.prev = function(){
        this.select(this._curIdx - 1);
    }


    this.search = function(query){
        this._listSearch.search(query);
    }

    this.sort = function(choice){
        if (choice == 'reset'){
            this._listSearch.sort('originalIdx');
        }
        else if (choice == 'alphanumeric'){
            this._listSearch.sort('question');
        }
        else if (choice == 'random'){
            var elems = this._container.children();
            while (elems.length) {
                this._container.append(elems.splice(Math.floor(Math.random() * elems.length), 1)[0]);
            };
        }
    }

    this.open = function(idx){
        if (idx == null){
            idx = this._curIdx
        }

        var parent = this.get(idx).parents('li');
        var prev = this.get(idx -1).find('.question');
        var next = this.get(idx + 1).find('.question');

        this._modal.find('.question').html(parent.find('.question').html());
        this._modal.find('.modal-body').html(parent.find('.answer').html());
        this._modal.find('.question-prev').html(prev.html());
        this._modal.find('.question-next').html(next.html());
        this._modal.modal('show');
    }


}






/**
* Render Deck
*/
function renderDeck(deck){
    
}

