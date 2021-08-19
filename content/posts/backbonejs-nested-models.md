+++
title = "Backbone.js - Nested Models"
date = "2014-01-04"
tags = ["javascript"]
languages = ["javascript", "json"]
lang = "de"
+++

Die Abbildung von Backbone Models auf Basis einer REST Schnittstelle ist
ja relativ einfach. Problematisch wurde es aber bei mir, als ich
versuchte ein Model zu laden, dessen Attribute ebenfalls wieder Models
bzw. eine Collection enthielten.

LÃ¤sst man die Daten direkt von Backbone parsen, erhält man ein Attribut,
welches ein einfaches JavaScript Objekt oder ein Array aus diesen
enthält. Wie ich dieses Problem gelöst haben, möchte ich euch in einem
kleinen Beispiel erklären.

**Hier also zuerst die Ausgangslage:**

Die REST Schnittstelle liefert unter der Adresss /api/data/ folgende
Daten. Abgebildet werden zwei Personen. *Max Mustermann* hat zusätzlich
noch zwei Kinder, die im Attribut children enthalten sind. *Theresa
Test* hat keine Kinder.

``` json
[
  {
    "lastName": "Mustermann",
    "id": 1,
    "firstName": "Max",
    "children": [
      {
        "lastName": "Mustermann",
        "id": 2,
        "firstName": "Malte"
      },
      {
        "lastName": "Mustermann",
        "id": 3,
        "firstName": "Lena"
      }
    ]
  },
  {
    "lastName": "Test",
    "children": [],
    "id": 4,
    "fistName": "Theresa"
  }
]
```

Zu erst erstellen wir jetzt unser Backbone Model für die Person. An
dieser Stelle reicht uns erstmal die Minimalversion:

``` javascript
var Person = Backbone.Model.extend({});
```

Anschließend benötigen wir die Collection:

``` javascript
var PersonCollection = Backbone.Collection.extend({
    url: '/api/data/',
    model: Person
});
```

Erstellen wir jetzt eine neue PersonCollection funktioniert das Laden
der Daten für's erste. Nur enthält das Attribut children keine
PersonCollection, was aber unser Ziel ist:

``` javascript
var pc = new PersonCollection();
pc.fetch();

pc.at(0).get('children'); // Das erste Objekt laden und das Attribut children ansehen.
// >> [Object ]
```

Um dafür zu sorgen, dass in dem Attribut chidlren eine PersonCollection
landet, müssen wir selbst dafür sorgen, dass die Informationen auch als
solche erkannt und verarbeitet werden.

Aus diesem Grund muss die Methode parse der Person überschieben werden.

``` javascript
var Person = window.Person = Backbone.Model.extend({
    parse: function (resp) {

        // Hat der Response ein Attribute children.
        if (resp['children']) {

            // jeden Eintrag in children durchgehen und eine
            // Person erstellen und das Objekt parsen lassen.
            var children = _.map(resp['children'], function (child) {
                return new Person(child, {parse: true});
            });

    // aus der Liste der Personen eine PersonCollection erstellen
    // und dem Response zuweisen.
            resp['children'] = new PersonCollection(children);
        }

    // den Ã¼berarbeiteten Resposen zurÃ¼ckgeben.
        return resp;
     }
});
```

Mit dieser Erweiterung der Methode haben wir das gewünschte Ergebnis
erziehlt:

``` javascript
var pc = new PersonCollection();
pc.fetch();

pc.at(0).get('children'); // Das erste Objekt laden und das Attribut children ansehen.
// >>  {length: 2, models: Array[2], _byId: Object, constructor: function, url: "/api/data/"â¦}
```
