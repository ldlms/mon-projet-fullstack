# TP-Fullstack : Deck builder

This deck builder aims to allow the user to search for cards through MTG card databases, and for him to create his own deck.
Ultimately, this app could provide a feature for the user to search cards, not only by name, but also by abilities or potential synergy between cards.

# Head-up

<img width="1100" height="1019" alt="shéma" src="https://github.com/user-attachments/assets/2ad43ae4-ccdd-44da-a4aa-1885f5a4a012" />


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
- The documentations of the endpoint can be seen at localhost:3000/api-docs, made available by swagger.

# Database Shema

Card data shema :

<img width="1044" height="588" alt="mcdCard" src="https://github.com/user-attachments/assets/fcfdf9ac-88f1-48bc-9f6d-9cee65be92ee" />
<img width="1064" height="596" alt="mldCard" src="https://github.com/user-attachments/assets/0f854323-b0b6-4b7e-866c-ec152ea23530" />

The idea behind the Database shema is to store infos regarding the several cards in one database. The CardMana table is used to store the mana cost of the cards separatly, in this table, an amout of 2 and a color of {W} will be translated to two white mana, and an entity without a color will translate to an incolor mana.
A card who will need two incolor mana and two red mana to be summonned will hence need two manaCard entity, one with {amount = 2, color = [R]} and the other with {amount = 2, color = null}.
The one-to-many relationship between card and cardLegality will be used to inform the player about the several format a card card can be played in.

User data Shema :

<img width="1489" height="833" alt="mcdUser" src="https://github.com/user-attachments/assets/d6dcb357-89d3-41ef-aa3a-0be94b60781e" />
<img width="1470" height="856" alt="mldUser" src="https://github.com/user-attachments/assets/f05d4f39-6c12-4ce0-887d-19eb6b0d8176" />


The user database will be used to store the users, to store the decks created by the users. The Deck will be composed of deck_cards, entities which will be queried from the card_database to be used in the several decks linked in a one-to-many relationship with the users. 



# setup

Dans un premier temps, récupérer le repository du projet sur : https://github.com/ldlms/mon-projet-fullstack

Un npm install n'est pas obligatoire, compte tenu du fait que le projet tournera sur un container Docker.

Pour les besoins de l'évaluation, le .env sample contiendra les valeurs nécessaires au fonctionnement du projet

Faire ```docker compose up --build```

```docker compose exec user_app npx prisma migrate dev```

```docker compose exec card_app npx prisma migrate dev```

Ces deux commandes vont exécuter la migration Prisma afin de créer le schéma de 
base de données, la commande est exécutée directement depuis l'intérieur du container.

Il faut ensuite télécharger le fichier de cartes sur le site suivant : https://scryfall.com/docs/api/bulk-data

Télécharger Oracle cards, le fichier de 161 Mo

Le mettre à la racine du projet, le renommer si besoin

```docker cp ./<le nom du Json> card-service:/app/allCards.json```

```docker exec -it card-service npx tsx src/utils/import-cards.ts /app/allCards.json```

Attendre la fin de l'import des cartes en BDD

Le swagger sera accessible via : http://localhost:5000/api-docs/

Lancement des tests frontend avec : ```docker compose exec front npm run test:run```



# todo
- the app will maybe need more services, maybe the card service will need to be separated in two, one dedicated to fetching card via the MTG API, the other dedicated to deckbuilding and filters to filter the cards persisted in database.


