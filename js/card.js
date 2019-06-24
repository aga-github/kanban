/* Tutaj, podobnie jak w pliku Column.js, musimy zmodyfikować 
funkcję konstruującą. Usuwamy description i wpisujemy id i name. 
Musimy nanieść te zmiany ze względu na odpowiedź, którą dostajemy 
z serwera: 
function Card(id, name) {
}
Zmodyfikujmy też ustawianie początkowych wartości atrybutów. 
Metoda randomString() jest już usunięta, więc nie potrzebujemy jej, 
a this.description podmieniamy na name:

this.id = id;
this.name = name || 'No name given';
Jest jeszcze jedno miejsce, w którym musimy zmienić description 
na name — w funkcji generateTemplate().
Należy zmienić:
generateTemplate('card-template', { description: this.description }, 'li');
na:
generateTemplate('card-template', { description: this.name }, 'li');
*/


// KLASA KANBAN CARD
function Card(id, name) {
var self = this; 
  
this.id = id;
this.name = name || 'No name given';

  	this.element = generateTemplate('card-template', { description: this.name }, 'li');

  	this.element.querySelector('.card').addEventListener('click', function (event) {
    	event.stopPropagation();

    	if (event.target.classList.contains('btn-delete')) {
      		self.removeCard();
    	}
  	});
}

Card.prototype = {
    removeCard: function() {
  var self = this;

  fetch(baseUrl + '/card/' + self.id, { method: 'DELETE', headers: myHeaders })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      self.element.parentNode.removeChild(self.element);
    });
}
};


/* Usuwanie karty
Jedyną czynnością, którą możemy wykonać w kontekście karty, 
jest jej usunięcie. 
Zmodyfikujmy tę funkcję, aby mogła wysyłać zapytanie o usunięcie zasobu. 
Spójrzmy na dokumentację:

DELETE /card/{id}
------------------------------
Request:
{id}: int - id card we want to remove
------------------------------
Response:
{
   id: int
}

W celu usunięcia karty z serwera należy wysłać zapytanie metodą 
DELETE na endpointa /card/{id_karty}. Analogicznie do poprzednich metod 
użyjemy do tego fetcha:

removeCard: function() {
  var self = this;

  fetch(baseUrl + '/card/' + self.id, { method: 'DELETE', headers: myHeaders })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      self.element.parentNode.removeChild(self.element);
    })
}
*/