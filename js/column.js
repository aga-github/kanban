/* Zacznijmy od samej klasy Column. W funkcji konstruującej musimy dodać jeszcze jeden 
parametr przed name — parametr id. 
Id nie będzie już generowane losowo, tylko przez serwer, więc musimy podmienić 
ustawianie wartości początkowej id. Ustawmy też wartość domyślną dla nazwy kolumny, 
jeśli będzie pusta: */

/* było:
function Column(name) {
  	var self = this;
  	this.id = randomString();
  	this.name = name; */
  	
// po zmianach jest:  	
  	
  	function Column(id, name) {
  	var self = this;  
    this.id = id;
    this.name = name || 'No name given';
  
  	this.element = generateTemplate('column-template', { name: this.name, id: this.id });
  	
  	this.element.querySelector('.column').addEventListener('click', function (event) {
	    if (event.target.classList.contains('btn-delete')) {
	      	self.removeColumn();
	    }   
	    
  if (event.target.classList.contains('add-card')) {
  var cardName = prompt("Enter the name of the card");
  event.preventDefault();
  
  var data = new FormData();
data.append('name', cardName);
data.append('bootcamp_kanban_column_id', self.id);

fetch(baseUrl + '/card', {
    method: 'POST',
    headers: myHeaders,
    body: data,
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(resp) {
    var card = new Card(resp.id, cardName);
    self.addCard(card);
  });
}
  });
}




/* Operacje, które możemy wykonać w obrębie kolumny, to dodanie nowej karty 
lub usunięcie kolumny.*/
/* W celu usunięcia kolumny należy wysłać zapytanie metodą DELETE na endpoint 
/column/{id_kolumny}.
Dodajmy tę funkcjonalność do prototypu Column do metody removeColumn: */
/* Rzeczą, na którą należy zwrócić uwagę, jest dobranie adresu URL. 
Usuwamy kolumnę, która ma określony id. Użycie funkcji w bloku .then() 
spowodowało utratę kontekstu, stąd self. Dopiero po uzyskaniu potwierdzenia 
z serwera, że element został usunięty, możemy usunąć go również z widoku. 
Stąd użycie metody self.element.parentNode.removeChild(self.element);. */


Column.prototype = {
	addCard: function(card) {
	  this.element.querySelector('ul').appendChild(card.element);
	},
	removeColumn: function() {
  var self = this;
  fetch(baseUrl + '/column/' + self.id, { method: 'DELETE', headers: myHeaders })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      self.element.parentNode.removeChild(self.element);
    })
	}
};


/* === Dodawanie kolumny === 
Wróć znowu na górę strony do function Column(id, name).
Do tej pory nasza funkcja Column wyglądała tak: 

this.element.querySelector('.column').addEventListener('click', function (event) {
  if (event.target.classList.contains('btn-delete')) {
      self.removeColumn();
  }

  if (event.target.classList.contains('add-card')) {
      self.addCard(new Card(prompt("Enter the name of the card")));
  }
}); 

Nazwę karty musimy wydzielić do osobnej zmiennej. Będzie nam to potrzebne 
do wykonania zapytania do serwera przy tworzeniu nowego zasobu.
Zróbmy to w następujący sposób:

if (event.target.classList.contains('add-card')) {
  var cardName = prompt("Enter the name of the card");
  event.preventDefault();
  self.addCard(new Card(cardName));
}
Kolejnym krokiem będzie wykonanie zapytania do serwera. Spójrzmy na dokumentację:

POST /card
------------------------------
Request:
name: string - the name of the card we create
bootcamp_kanban_column_id: int - the id of the column to which the card belongs
------------------------------
Response:
{
   id: int
}
Jak widzisz, musimy wykonać zapytanie POST na endpointa /card, do tego w ciele zapytania musimy wysłać dane potrzebne do stworzenia nowej karty: name i bootcamp_kanban_column_id. W odpowiedzi dostajemy id utworzonej kolumny.

Napiszmy sobie to zapytanie:

if (event.target.classList.contains('add-card')) {
  var cardName = prompt("Enter the name of the card");
  event.preventDefault();

  fetch(baseUrl + '/card', {
      method: 'POST',
      body: {
        //body query
      }
    })
    .then(function(res) {
      return res.json();
    })
    .then(function() {
      //create a new client side card
    });

  self.addCard(new Card(cardName));
}
Mamy nie do końca sformułowane zapytanie. Musimy dodać do niego dane, które wysyłamy, i uzupełnić funkcję, która ma się wykonać po utworzeniu nowej kolumny na serwerze.

Spójrzmy:

var data = new FormData();
data.append('name', cardName);
data.append('bootcamp_kanban_column_id', self.id);

fetch(baseUrl + '/card', {
    method: 'POST',
    headers: myHeaders,
    body: data,
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(resp) {
    var card = new Card(resp.id, cardName);
    self.addCard(card);
  });
Dodaliśmy dwa parametry name i bootcamp_kanban_column_id (zgodnie z dokumentacją). Znowu tracimy kontekst przy użyciu funkcji w metodzie .then(), więc musimy skorzystać ze zmiennej self.

Warto zauważyć również pojawienie się nowej konstrukcji var data = new FormData();. Jest to wbudowany w przeglądarkę interfejs dostarczający nam możliwość tworzenia par klucz-wartość, reprezentujących pola formularza. Tak przygotowany formularz wysyłamy do naszego serwera.

W funkcji, która ma się wykonać po poprawnym zapytaniu i utworzeniu nowej kolumny, tworzymy nową kartę i dodajemy ją do kolumny. Zwróć uwagę, że ID potrzebne do utworzenia karty pobieramy z odpowiedzi serwera.

Skończyliśmy modyfikację pliku Column.js. Możemy teraz zabrać się za plik Card.js, który też musimy nieco zmodyfikować.
*/



