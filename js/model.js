//===================================================
// DEFINE DATA MODEL AND ASSOCIATED UTILITY FUNCTIONS
//=====================================================

/**
* Object: Card
*/
function Card(index, question, answer){
    this._originalIdx = index
    this._question = question;
    this._answer = answer;

   	this.answer = function(){
   		return(this._answer);
   	}

   	this.question = function(){
   		return(this._question);
   	}

   	this.origianlIdx = function(){
   		return this._originalIdx;
   	}
}

/**
* Object: Deck
*/
function Deck(name){
    this._name=name;
    this._cards = [];
    this._counter = 0;

    this.name = function(){
    	return(this._name);
    }

    this.size  = function(){
    	return(this._counter);
    }



    /**
    * add a new card to the deck
    * @param {question} str - title of the card
    * @param {answer} str - answer for the card
    */

    this.addCard = function(question, answer){
        card = new Card(this._counter, question, answer);
        this._counter+= 1;
        this._cards.push(card)
    }



    this.order = function(choice){
    	
        if(choice=='random'){
            var j, x, i;
            for (i = this._counter; i; i--) {
                j = Math.floor(Math.random() * i);
                x = this._cards[i - 1];
                this._cards[i - 1] = this._cards[j];
                this._cards[j] = x;
            };
        }
        else if (choice == 'reset'){
            this._cards.sort(function(a, b){
                if(a.origianlIdx() < b.origianlIdx()) return -1;
                if(a.origianlIdx() > b.origianlIdx()) return 1;
                return 0;
            });
        }
        else if (choice == 'alphanumeric'){
            this._cards.sort(function(a, b){
                if(a.question() < b.question()) return -1;
                if(a.question() > b.question()) return 1;
                return 0;
            });
        }
    };

    this.get = function(idx){
    	return this._cards[idx];
    }

}

/**
* Parses input string into series of decks
*/
function parse(infile){
    
    var decks = [];
    var counter = -1;
    var question = null;
    var answer = "";
    $.each(infile.split("\n"), function(lineNo, line){
    	if (line.startsWith("# ")){
            decks.push(new Deck(line.replace("#", "").trim()));

            counter += 1;
        }
        else if(line.startsWith("## ")){
            if (question != null && question.length > 0){
                decks[counter].addCard(question, answer.trim());
            }
            question = line.replace('##', '').trim();
            answer = "";            
        }else{
            answer += line + "\n"
        }
    });

    if(question != null & question.length > 0){
        decks[counter].addCard(question, answer);
    }

    return decks;
    
}
