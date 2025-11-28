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
- The prisma ORM is used, in order to directly map entities used in the code, to the SQL shema of both databases. This way of doing things allows us to produce cleaner, easier to read code, without having to formulate sql queries ourselves. Moreover, it adds a layer of security by preventing sql injection by design. Being database-agnostic, it also allows to switch to another database if, in the future, i feel the need to change from postgres. Prisma, particularly, will generate Typescript types based on the database shema, completing the use of typescript in our backend express, it alse gives us access to prisma studio, a GUI tool to manipulate data.
We still need to be carefull in the use of ORM in general, since ORM tends to be less-optimized than pure SQL, hence, i will need to search for a way to use custom queries for specific needs, in order to avoid fetching a whole table when it's not needed.
- The whole app use docker as a mean to create images and containers, allowing it to run on whathever environement with a docker setup installed. A dockr newtork is used to run the different apps together, allowing them to communicate between containers in the same network.
- The project also use : nodement for hotReload, husky : to run pre-commit scripts.

# setup

In order to run the project on your machine :
- Clone the repository *
- Create and configure your own .env files for cv-service and card-service, they are mandatory to connect to both DDB, you will also need to create a .env at the root of the project, for the docker compose to use those environment variables. You can refer yourself to the .env sample in order to know what varaibles you need to populate.
- 





