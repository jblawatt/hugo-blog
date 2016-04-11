+++
title = "Python Namespaces"
tags = ["python"]
date = "2013-01-12"
languages = ["python"]
+++

In Programmiersprachen wie Java oder C\# ist es möglich, Namespaces zu
nutzen um sein Programm zu struckturieren. In Python nutzt man hierfür
Packages. Auf den ersten Blick gibt es jedoch in Python keine
Möglichkeit die einzelnen Packete in mehrere Eggs aufzuteilen und damit
aussehen zu lassen als wären Sie eins. Dies dient meines Erachtens auch
der Übersichtlichtkeit des Programms/Frameworks.

Da ich aus der C\#/VB.NET Ecke komme, habe ich ich dieses Feature ein
wenig vermisst.

Jetzt bin ich auf eine Möglichkeit gestoßen, dieses Feature auf in
Python zu nutzen. Hierfür muss man in jeder \_\_init\_\_.py jedes
Packetes folgenden Codeschnipsel einfügen.

``` python
	try:
	    __import__('pkg_resources').declare_namespace(__name__)
	except ImportError:
	    from pkgutil import extend_path
	    __path__ = extend_path(__path__, __name__)
```

Als Beispiel habe ich jetzt zwei Packete: *one* und *two*. Beide
enthalten die gleiche Strucktur, aber ein anderes Modul am Ende des
Pfades.

**/one/foo/bar/foobar.py**

``` python
	def my_method():
	    print "Hello From FooBar"
```

**/two/foo/bar/barfoo.py**

``` python
	def my_method():
    	print "Hello From BarFoo"
```

Sorgt man jetzt dafür, dass beide Pfade im PYTHONPATH liegen, kann man
diese so aufrufen, als wenn sie ein Packet wären.

``` python
	import sys
	
	sys.path.append('./one/')
	sys.path.append('./two/')
	
	from foo.bar import foobar, barfoo
	
	foobar.my_method()
	barfoo.my_method()
```

Den Quellcode zu diesem Beispiel habe ich auf Bitbucket veröffentlicht:
<http://bitbucket.org/jblawatt/python-namespace-example>
