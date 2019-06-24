/* Ostatnim elementem naszej układanki jest tablica. 
Tutaj nie musimy już niczego specjalnie zmieniać. 
Możemy przejść od razu do modyfikowania funkcjonalności 
dodawania nowej kolumny.

Dodawanie kolumny
Spójrzmy na prawidłowy sposób dodania nowej kolumny:

==============================
POST /column
------------------------------
Request:
name: string - name of the column to create
------------------------------
Response:
{
   id: int
} 
Nasze zapytanie powinno zostać wykonane przy użyciu metody 
POST na endpoint /column. Ciało żądania powinno zawierać 
jedynie nazwę kolumny, którą chcemy utworzyć. Dodajmy obsługę 
zapytania w miejscu, gdzie była tworzona nowa kolumna 
(w nasłuchiwaniu na kliknięcie przycisku Dodaj kolumnę).

W taki sam sposób, jak tworzyliśmy nową kartę w kolumnie, 
musimy utworzyć nową kolumnę na tablicy. W danych, które 
wysyłamy do serwera, jest jedynie (jak już wspomnieliśmy) 
nazwa kolumny. - fragment kodu poniżej oznaczony >>> <<<
Samo jej tworzenie wykonujemy dopiero wtedy, gdy mamy pewność, 
że kolumna została poprawnie utworzona na serwerze. 
Dlatego musimy przenieść logikę odpowiadającą za tworzenie 
nowej kolumny do środka funkcji .then()
Zwróć uwagę, że tworzenie kolumny również rozbito na dwie części.
var column = new Column(response.id, columnName);
board.createColumn(column);
Najpierw tworzona jest kolumna przy użyciu id, które dostajemy 
w odpowiedzi z serwera oraz nazwy kolumny, o którą nas zapytano, 
a dopiero potem tworzymy kolumnę na tablicy.

*/

var board = {
    name: 'Tablica Kanban',
    addColumn: function(column) {
      this.element.appendChild(column.element);
      initSortable(column.id);
    },
    element: document.querySelector('#board .column-container')
};

function initSortable(id) {
  	var el = document.getElementById(id);
  	var sortable = Sortable.create(el, {
    	group: 'kanban',
    	sort: true
  	});
}

// >>> <<<
document.querySelector('#board .create-column').addEventListener('click', function() {
  var name = prompt('Enter a column name');
  var data = new FormData();

  data.append('name', name);

  fetch(baseUrl + '/column', {
      method: 'POST',
      headers: myHeaders,
      body: data,
    })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      var column = new Column(resp.id, name);
      board.addColumn(column);
    });
});
	
