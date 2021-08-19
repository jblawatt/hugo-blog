+++
title = "Hugo Blog (Deployment) auf einem Uberspace"
date = "2016-10-08"
tags = ["uberspace"]
languages = ["bash"]
lang = "de"
+++

Die Umbauten an meiner kleinen Website hier sind im Gegensatz zu meinen
Post relativ hoch frequentiert. Aktuell benutze ich als Blog Engine den
Go basierten Static-Site-Generator [Hugo](http://gohugo.io).

An dieser Stelle möchte ich einmal beschreiben, wie ich das Deployment 
des Blogs beim Hoster [Uberspace](http://www.uberspace.de)
eingerichtet habe.

Das Setup sieht so aus, dass ich Quelltext, also die Rohdaten meines Blogs
in einem Git Repository versioniere. Dieses Repository liegt bei [Github](http://www.github.com/).
Sobald ein Artikel fertiggestellt ist oder andere Änderungen veröffentlicht
werden sollen, pushe ich das Repository auf meinen Uberspace.
Mit Hilfe eines Post-Receive Hooks, wird dann auf dem Server automatisch das 
Deployment ausgelöst.
Deployment bedeutet in diesem Fall das Auschecken der letzten Änderungen aus 
dem Branch `master` in das Projektverzeicnnis, auf das wiederum der Hugo Server
hört und die Änderungen direkt neu aufbereitet.

Im Folgenden gehe ich auf die einzelnen Schritte nochmal detailierter ein.

## HUGO Blog erstellen
Bevor wir unseren Blog auf dem Uberspace Server deployen können, müssen wir 
ihn erstmal erstellen. Da die Engine in Google Programmiersprache [Go](http://www.golang.org)
müssen wir uns die nötigen Abhängigkeiten und das SDK auf unserem Rechner
installieren. Hierfür existiert eine recht gute Anleitung auf [URL](////).

```bash
$ hugo init hugo-blog
```

## Git Repository einrichten
Nachdem der Blog erstellt wurde und wir unseren ersten Beitrag geschrieben haben, 
müssen wir dafür sorgen, dass in unserem Blogverzeichnis ein Git Repostitory 
initialisiert wird. So können alle Änderungen verfolgt und ggf. einfach zurück
genommen werden. Außerdem können wir später die Funktionalitäten von Git nutzen
unsere Inhalte auf dem Uberspace zu bekommen.

Um das Git Repository zu erstellen, müssen wir folgende Befehle auf der
Kommandozeie ausführen:

Zu Begin initialisieren wir das Repostitory: 
```bash
$ git init
```

Im Anschluss fügen wir alle Dateien aus unserem Verzeichnis zum Repository hinzu:
```bash
$ git add .
```

Anschließen sagen wir dem Repository mit folgenden Befehl das wir die vorgenommenen
Änderungen festschreiben und sichern wollen.
```bash
$ git commit -am "Initialer Commit dieses Hugo Blogs"
```

Ich habe mein Repository neben der Version auf meinem lokalen Rechner zusätzlich
auf Github liegen. So sind die Inhalte nocheinmal zusätzlich gesichert und ich
kann darüber hinaus meine Inhalte von jedem Rechner mit Texteditor und Git 
bearbeiten oder sogar die Online-Editierfunkton von Github nutzen.
Das ist allerdings optional.

Wenn ihr also einen Github Account habt und dort ein entsprechendes Repostitory
angelegt habt, könnt ich es mit folgendem Befehl zu der Konfiguration eures 
lokalen Repositories hinzufügen. 
```bash
$ git remote add origin http://github.com/USERNAME/hugo-blog.git
$ git push origin master
```

## Git Remote für den Uberspace einrichten
Nachdem wir auf unserem lokalen Rechner alles soweit eingerichtet haben begeben
wir uns per SSH auf unseren Uberspace.

Hier erstellen wir zwei Verzeichnisse: `$HOME/repositories/hugo-blog` und `$HOME/projects/hugo-blog`. 

In ersterem liegt unsere Server-Version unseres Git Repositories, dass wir 
erstmal noch initialisieren müssen, damit später unsere Daten hierhin übertragen
werden können:
```bash
mkdir -p ~/repositories/hugo-blog
cd ~/Repositories/hugo-blog
git init --bare
```

So, das Repository ist soweit angelegt. Jetzt stellen wir in unserer lokalen
Version die Verbindung her:
```bash
$ git remote add uberspace ssh://USERNAME@SERVERNAME.uberspace.de/home/USERNAME/repos/hugo-blog.git
```

Mit dem Befehl `$ git push uberspace master` könnten wir unseren Blog jetzt auf
den Uberspace synchronisieren. Dort würde aber nichts weiter passieren. 
Wir müssen erst noch die folgenden Schritte zu Enden führen. 

## Post-Receive Hook auf dem Uberspace einrichten
Sobald Änderungen auf dem Server ankommen, sollen diese auch direkt
veröffentlicht werden. Damit dies automatisch passieren kann, nutzen wir die
Hook Funktionen unseres Repositories auf dem Server.

Wir legen also die Datei `$HOME/repositories/hugo-blog/hooks/post-receive` mit
dem folgenden Inhalt an:
```bash
#!/bin/sh
git --work-tree=/home/USERNAME/projects/hugo-blog --git-dir=$GIT_DIR checkout -f
```
Nachdem wir dann noch dafür gesorgt haben, dass diese Datei auch ausgeführt werden 
kann (`$ chmod +x post-receive`), werden alle unsere Änderungen direkt nach dem 
Eintreffen auf dem Server in unser Projektverzeichnis "entspackt".

## Hugo auf dem Uberspace installieren
So, fast geschafft. Die Quelldaten des Blogs sind auf dem Server und alles
wir automatisch in das richtige Verzeichnis geschoben. Jetzt widmen wir uns
der Hugo Blog Engine. Die muss ja auch erstmal auf den Server gelangen.

```bash
$ export GOPATH=$HOME/Go
$ # Die aktuelle Entwicklerversion
$ go get github.com/spf13/hugo
$ # Oder die stabile Version zum jetzigen Zeitpunkt
$ go get gopkg.in/spf13/hugo.v0.17 
```

## Uberspace Service einrichten
```bash
$ test -d ~/service || uberspace-setup-svcscan
```

```bash
$ uberspace-setup-service hugo-blog $HOME/Go/bin/hugo serve --watch -pXXXXX --bind="0.0.0.0" --appandPort=false --baseurl=http://BENUTZERNAME.SERVERNAME.uberspace.de
```

* `--source` legt fest, in welchem Verzeichnis der Quelltext für die Generierung deines Blogs liegt. In unserem Fall das Verzeichnis `$HOME/projcets/hugo-blog`.
* `--watch` sorgt dafür, dass die Hugo das Quellverzeichnis überwacht und jede Änderung sofort übernimmt.
* `-p/--port` legt den Port fest unter dem unser Blog auf dem Server zu erreichen ist.
* `--bind` gibt an an welches Interface sich der Server binden soll.
* `--appendPort` legt fest, ob der Port mit an die BasisURL angehängt werden soll. Das ist in unserem Fall nicht nötig.
* `--baseurl` ...

## Uberspace .htaccess anpassen
Jetzt läuft unser Blog. Leider kann aber noch niemand kann darauf zugreifen und unsere
Veröffentlichungen lesen. Wir müssen dem, auf dem Uberspace laufenden Webserver,
noch mitteilen, dass alle Anfragen die an diesen geleitet werden, an unseren
Hugo Server Prozess weitergeleitet werden. 

Hierfür nutzen wir eine Datei namens `.htaccess` im Verzeichnis `~/html`.

```bash
RewriteMode On
RewriteRule http://127.0.0.1:XXXXX/$1 []
```

Jetzt können wir unseren Blog endlich unter folgender Adresse besuchen:
http://BENUTZERNAME.SERVERNAME.uberspace.de/
