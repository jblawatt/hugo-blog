---
title: "Hello World"
date: 2021-07-15T19:10:13+02:00
draft: false
summary: >
    this is the longer text
    that should be show as
    summary.
tags:
    - python
    - sometest
categories:
    - WhatILearnedToday
---

What i learned today:
`hugo`
this is a test

```python
from typing import Protocol


class HasToString(Protocol):
    def to_string(self) -> str: ...


def print_string(item: HasToString):
    print(item.to_string())
```
