+++
title = "VIM als Python IDE"
date = "2013-01-17"
tags = ["vim"]
languages = ["vim"]
+++

Es gibt einen Menge Anleitungen im Internet, wie man den Editor (G)Vim
in eine Entwicklungsumgebung werwandeln kann. Jetzt möchte ich mich in
die Liste der Authoren einreihen und meine Beschreibung und Erfahrungen
hier dokumentieren.

Ich weiß, dass es viele dieser Anleitungen im Internet git. Ich selbst
habe eine Menge davon gelesen. Doch ich muss sagen, dass Ich wirklich
einige davon lesen musste, dass ich alles wusste, was ich für mein
(g)vim Setup brauchte. Deshalb möchte ich an dieser Stelle gerne noch
meine eigene Anleitung veröffentlichen. Für alle, die es interessiert
und als Erinnerung für mich ;-).

![image](/images/gvim-as-ide.png?width=800&height=800)

Vim Setup
---------

Ich gehe davon aus, dass (g)vim bereits auf dem System installiert ist.
Ist dies nicht der Fall, kann er unter [vim.org](http://www.vim.org)
heruntergeladen werden.

Ist (g)vim erfolgreich installiert, sollte es die Konfigurationsdatei
.vimrc und den Ordner für die benutzerspezifische Konfiguration .vim im
Home-Verzeichnis geben.

### .vimrc

In der .vimrc kann man einige Einstellungen festlegen, denen man sich
die Arbeit mit vim erleichtern.

``` vim
	" Automatisches Neu-Laden des .vimrc nach dem Speichern
	autocmd! bufwritepost .vimrc source %

	" Mit F2 den Paste-Mode umschalten
	set pastemode=<F2>

	" aktivieren des syntaxhighlighting
	if has('syntax')
    	syntax on
	endif

	" den leader key auf das , setzten
	let mapleader=","

	" shortcuts für das ein- und ausrücken von markierten
	" textblöcken auf die größer und kleiner tasten mappen
	vnoremap < <gv
	vnoremap > >gv

	" markieren von unnötigen Leerzeichen (in rot)
	autocmd ColorScheme * highlight ExtraWhitespace ctermbg=red guibg=red
	au InsertLeave * match ExtraWhitespace /\s\+$/

	" festlegen des Farbschematas
	colors rdark

	filetype plugin indent on

	" Zeilennnummern anzeigen
	set number

	" die Breite des Dokuments auf 79 Zeichen setzten (z.B. für Python)
	set tw=79

	" kein automatischer Zeilenumbruch beim Anwendungsstart
	set nowrap

	" nicht automatisch umbrechen set fo-=t

	" Erweiterungen für das Einrücken
	set tabstop=4
	set softtabstop=4
	set shiftwidth=4
	set shiftround
	set expandtab

	" Anpassungen für die Suche
	set hlsearch
	set incsearch
	set ignorecase
	set smartcase

```

Plugins
-------

(g)vim ist ein sehr felxibler, modularer Editor, für den des eine Menge
Erweiterungen gibt. Zu finden sind diese u.a. unter
[vim.org](http://www.vim.org).

Zwei Plugins, die ich von Anfang an verwendet habe, Pathogen und
Powerline, möchte ich an dieser Stelle kurz vorstellen. Demnächst folgen
dann noch weitere Reviews.

### Pathogen

Pathogen ist eine Plugin, mit dem es nicht mehr erforderlich ist die
einzelnen Plugins, die man so installierne möchte, auf die vielen
unterschiedlichen Ordner in .vim aufzuteilen. Dies ist besonders
wichtig, wenn man ein Plugin wieder deinstallieren möchte.

Mit Pathogen erstellt man einen Ordner (autoload / bundle) in dem
ordnersepariert die einzelnen Plugins abgelegt werden. Anschließend
werden dann beim Start von vim die Plugins automatisch geladen.

``` bash
	$ mkdir -p ~/.vim/autoload ~/.vim/bundle
	$ curl -so ~/.vim/autoload/pathogen.vim https://raw.github.com/tpope/vim-pathogen/HEAD/autoload/pathogen.vim 
```

Nun muss man das Plugin in der .vimrc aktivieren.

``` vim
	call pathogen#infect()
```

Ab jetzt kann jedes Plugin einfach nach \~/.vim/bundle/PLUGIN\_NAME/
entpackt werden.

### powerline

Die Powerline ist eine Erweiterung, die zusätzliche Informationen zur
geöffneten Datei, dem Ornder, dem DVCS Branch, usw. anzeigt.

So sieht das Ergebnis dann aus:

![image](https://raw.github.com/Lokaltog/powerline/develop/docs/source/_static/img/pl-mode-normal.png)

![image](https://raw.github.com/Lokaltog/powerline/develop/docs/source/_static/img/pl-mode-insert.png)

![image](https://raw.github.com/Lokaltog/powerline/develop/docs/source/_static/img/pl-mode-replace.png)

![image](https://raw.github.com/Lokaltog/powerline/develop/docs/source/_static/img/pl-mode-visual.png)

*(Quelle: <https://github.com/Lokaltog/powerline>)*

Die alte vim-powerline ist obsolete. Die neue ist aktuell noch in der
Beta-Phase. Funktioniert aber in meinen ersten Tests gut.

``` bash
	$ cd ~/.vim/bunde/
	$ git clone https://github.com/Lokaltog/powerline.git
```

Jetzt muss die Powerline noch in der .vimrc aktiviert werden.

``` vim
	autocmd VimEnter,Colorscheme * :source ~/.vim/bundle/powerline/powerline/ext/vim/source_plugin.vim
```

Das wars schon. ;-)
