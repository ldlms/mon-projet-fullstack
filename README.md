# TP-Fullstack : Deck builder

This deck builder aims to allow the user to search for cards through MTG card databases, and for him to create his own deck.
Ultimately, this app could provide a feature for the user to search cards, not only by name, but also by abilities or potential synergy between cards.

# Head-up

![alt text](image.png)

The barebone architecture is thought after a front-end app, built via the React library, who will be sending http calls to an API Gateway responsible for dispatching the calls between, for now, two different services.
Each service will have it's own postgre database, the ORM prisma was used to handle the creation of the database shema.

# Features

The idea behind the project is to facilitate the process of deck building for MTG players, the features, ideally would be the following :

- searching a card by name, type, color, rarity, extension, format, effect, illustrator (?), 
- to add those cards to a "deck", each deck related to a game format, hence respecting a number of rules regarding the number of cards allowed and the configuration of the chosen cards.
- the killer feature, would be, from a card, to search other cards based on the complementarity of effects, e.g : i have a card wich gain stats when i'm gaining life, and i want to search for cards that trigger gaining life, or cards that trigger when a card gain stats. The idea would be to show to the user, cards that trigger and/or are triggered by the effect of a given card.  

# technical stack

- the front -end is developped in React, allowing the use of reusable component, of the virtual DOM and the easing up of testing
- the gateway and services are in express. Making use of the lightweight framework, the routing features and the strong middleware support. Allowing me to develop in javascript for the entirety of the project.
- A postgres Database is used, know for it's support of a variety of data-types, and for it's support of JSon as a data type, wich could prove beneficial for maybe retreiving card info directly in Json format and storing them as such.
- 




