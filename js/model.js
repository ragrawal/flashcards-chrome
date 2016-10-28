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

    this.get = function(idx){
    	return this._cards[idx];
    }

}

/**
* Parses input string into series of decks
*/
function parse(infile, converter){
    
    var decks = [];
    var counter = -1;
    var question = null;
    var answer = "";
    var codeBlock = false;
    $.each(infile.split("\n"), function(lineNo, line){
    	if (!codeBlock && line.startsWith("# ")){
            decks.push(new Deck(line.replace("#", "").trim()));
            counter += 1;
        }
        else if(!codeBlock && line.startsWith("## ")){
            if (question != null && question.length > 0){
                text = converter.makeHtml(answer.trim());
                decks[counter].addCard(question, text);
            }
            question = line.replace('##', '').trim();
            answer = "";            
        }
        else if (line.startsWith("```")){
            console.log("Found code Block");
            codeBlock = !codeBlock;
            console.log(codeBlock);
            answer += line + "\n";
        }
        else{
            answer += line + "\n"
        }
    });

    if(question != null & question.length > 0){
        obj = converter.makeHtml(answer.trim());
        decks[counter].addCard(question, obj);
    }

    return decks;
    
}
