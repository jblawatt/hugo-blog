+++
date = "2014-03-07T18:22:56+01:00"
draft = false
title = "Python Logging Decorator"
author = "jblawatt"
tags = ["python"]
languages = ["python"]
lang = "de"
+++
Hin und wieder ist es notwendig, die Parameter und die RÃ¼ckgabewerte
einer Funktion zu Ã¼berprÃ¼fen. In Python kann man hierfÃ¼r das logging
Paket und den spÃ¤ter folgenden Decorator fÃ¼r die Funktionen verwenden.

Zuvor müssen wir aber erstmal dafür sorgen, dass die Informationen
irgendwo ausgegeben werden. In diesem Fall auf der Konsole.

```python
    import logging

    # Einen Logger mit dem Namen foo.bar erstellen.
    logger = logging.getLogger('foo.bar')
    # Den Log-Level DEBUG setzten.
    logger.setLevel(logging.DEBUG)
    # Festlegen, dass die Meldungen auf der Konsole ausgegeben werden sollen.
    logger.addHandler(logging.StreamHandler())
```
Jetzt ertsellen wir den Decorator, z.B. in der Datei decorators.py.

```python
    import logging

    # Einen default Logger festlegen, der verwendet wird, wenn
    # wenn beim Decorator kein Logger Ã¼bergeben wurde.
    _logger = logging.getLogger(__name__)


    def log(level=logging.DEBUG, logger=None):
        logger = logger or _logger

        def inner(fnc):
            def wrapper(*args, **kwargs):
                logger.log(
                    level,
                    'calling method. name=%s; args=%s; kwargs=%s;',
                    fnc, args, kwargs
                )
                return_value = fnc(*args, **kwargs)
                logger.log(
                    level,
                    'method called. name=%s; args=%s; kwargs=%s; return_value=%s',
                    fnc, args, kwargs, return_value
                )
                return return_value
            return wrapper
        return inner
```

Jetzt verwenden wir den Decorator. Hierfür erstellen wir zwei Methoden,
denen wir die Parameter foo und bar Ã¼bergeben. ZurÃ¼ckgegeben, wird ein
Tuple dieser beiden Werte. Ãœber die Methoden setzten wir unseren
Decorator. Die Parameter des Decorators legen fest, in welchen Logger
und mit welchem Level die Meldungen ausgegeben werden sollen.

``` python
    import decorators

    @decorators.log(logger=logger, level=logging.WARN)
    def log_warning(foo, bar):
        return foo, bar


    @decorators.log(logger=logger, level=logging.DEBUG)
    def log_debug(foo, bar):
        return foo, bar
```

Jetzt rufen wir die Funktion auf:

``` python
    >>> log_warning('foo', bar='bar')
    [WARNING] calling method. name=<function log_warning at 0x2bf9320>; args=('foo',); kwargs={'bar': 'bar'};
    [WARNING] method called. name=<function log_warning at 0x2bf9320>; args=('foo',); kwargs={'bar': 'bar'}; return_value=('foo', 'bar')

    >>> log_debug('foo', bar='bar')
    [DEBUG] calling method. name=<function log_warning at 0x2bf9320>; args=('foo',); kwargs={'bar': 'bar'};
    [DEBUG] method called. name=<function log_warning at 0x2bf9320>; args=('foo',); kwargs={'bar': 'bar'}; return_value=('foo', 'bar')
```
