---
title: 'Otium'
description: 'What I do with unstructured time, and a running log of what I have been paying attention to.'
updated: 2026-10-04
---

*Otium* is the Roman word for time that is not owed to anyone. Not leisure in
the sense of recovery, but the free attention out of which anything worth doing
eventually comes. Its opposite, *negotium*, literally means "not otium":
business, the absence of the good thing. I find that framing more useful than
our own, which treats work as the default and free time as what is left over.

```python
class Otium:
    """What I do with unstructured time."""

    def cards(self):
        games = ["poker", "bridge", "blackjack", 24]
        return f"I'm happy to play {games}"

    def chess(self):
        return "still learning"

    def piano(self):
        composers = ["Mozart", "Chopin", "Richard Clayderman"]
        return composers

    def bartending(self):
        bartending_license = "New York State"
        if bartending_license == "New York State":
            return "I'm happy to serve you a drink"

    def bouldering(self):
        return "more effective for shaping muscle definition than lifting"

    def equestrian(self):
        disciplines = ["show jumping", "dressage"]  # stopped after coming to the city
        return disciplines

    def reading(self):
        return "banned books"


me = Otium()
print(me.cards())
print(me.piano())
print(me.bartending())
```

## Future goal

Have a little dog.
