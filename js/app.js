/* komunikacja z API będzie wymagała adresu URL i nagłówków 
(każdy użytkownik ma inne wartości nagłówków). Ustawmy więc zmienne, 
z których będziemy korzystać przy komunikacji z serwerem: */

var baseUrl = "https://cors-anywhere.herokuapp.com/https://kodilla.com/pl/bootcamp-api";
var myHeaders = {
  'X-Client-Id': '4092',
  'X-Auth-Token': 'dfc61c6e2fa6dde5771215ae31c3d51b'
};

/* X-Client-Id: 4092
X-Auth-Token: dfc61c6e2fa6dde5771215ae31c3d51b */ 

/* Każde zapytanie, które wykonamy, będzie musiało mieć w sobie 
nagłówki (myHeaders).
Nagłówek Content-Type jest potrzebny do zakomunikowania serwerowi, 
że dane wysłane są w formacie JSON. Jeśli zabraknie takiej informacji, 
to serwer nie będzie potrafił obsłużyć naszego zapytania. 
Musimy użyć metody GET, a endpoint to /board. Ok, dodajmy więc funkcję 
odpytującą serwer o zasób tablicy. Powinno to wyglądać w następujący 
sposób:*/

fetch(baseUrl + '/board', { headers: myHeaders })
  .then(function(resp) {
    return resp.json();
  })
  .then(function(resp) {
    setupColumns(resp.columns);
  });

/* Po odebraniu odpowiedzi możemy przejść do tworzenia kolumn, stąd 
funkcja setupColumns(response.columns).
UWAGA: skąd wiadomo, że response.columns kryje w sobie jakieś informacje? 
Po pierwsze, mamy dokumentację, a poza tym zawsze możemy skorzystać 
z narzędzi developerskich i sprawdzić, jak to wygląda w Network. 
=== Tworzenie kolumn ===
Przejdźmy teraz do implementacji funkcji setupColumns(). 
To, co funkcja musi wykonać, to stworzenie tylu kolumn, ile dostaliśmy 
w odpowiedzi z serwera, następnie zaś każdą z nich musi przypiąć do tablicy 
(tej, którą widzimy na stronie).
Zacznijmy od stworzenia znajomej już konstrukcji forEach().
Oznacza ona, że dla każdego elementu (kolumny) znajdującej się w tablicy 
kolumn ma się wykonać pewna funkcja. Ta funkcja, jak już sobie powiedzieliśmy, 
musi stworzyć kolumnę i dodać ją do tablicy:*/

/* Zauważ, że tworzenie naszej kolumny jest trochę inne, niż było do tej pory. 
Do jej stworzenia potrzebujemy dwóch parametrów: ID i name.
Potrzebujemy ID dlatego, że jest tworzone za nas przez serwer za każdym razem, 
gdy tworzymy nowy element. Nie musimy więc generować losowego ID tak jak do tej pory. 
Oznacza to, że możemy całkowicie pozbyć się funkcji randomString(). Do kosza! */

/* === Karty w kolumnie ===
Mamy utworzone kolumny, teraz potrzebujemy jeszcze kart. Informację do nich również 
dostajemy w odpowiedzi z endpointa /board. Dopiszmy funkcję, która w taki sam sposób, 
jak ustawiała kolumny, ustawi nam karty. Oczywiście w odpowiednie kolumny! */

function setupColumns(columns) {
  columns.forEach(function (column) {
		var col = new Column(column.id, column.name);
    board.addColumn(col);
    setupCards(col, column.cards);
  });
}

/* Przejdźmy do implementacji funkcji setupCards(). Do funkcji przekazujemy kolumnę, 
do której mają zostać przyczepione karty, które należy stworzyć.
Teraz musimy, podobnie jak w przypadku funkcji setupColumns(), przeiterować 
po wszystkich kartach, utworzyć je i dodać do odpowiedniej kolumny: */

function setupCards(col, cards) {
	cards.forEach(function (card) {
    var cardObj = new Card(card.id, card.name);
  	col.addCard(cardObj);
	});
}

function generateTemplate(name, data, basicElement) {
  var template = document.getElementById(name).innerHTML;
  var element = document.createElement(basicElement || "div");
  element.classList.add("column-wrapper");

  Mustache.parse(template);
  element.innerHTML = Mustache.render(template, data);

  return element;
}


/* Zauważ, że tworzenie nowej karty (new Card()) znowu jest rozszerzone o kolejne 
parametry. Wynika to z tego, że tworząc nowe obiekty musimy dopasować się do odpowiedzi 
serwera.

Ostatnim elementem jest dodanie karty do kolumny za pomocą metody createCard(), którą 
tworzyliśmy w module 11 (można ją znaleźć w pliku Column.js).

To koniec modyfikowania pliku App.js. Są tutaj jednak pewne zmiany, których trzeba 
dokonać w plikach Card.js i Column.js. Przejdźmy najpierw do pliku Column.js. 

===================================================================================== */

/* 
// Piszą: do kosza z nią, więc ją wyszarzam:
function randomString() {
	var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ'.split();
	var str = '', i;
	for (i = 0; i < 10; i++) {
	  str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
} */

