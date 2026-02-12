// src/swagger.js
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "API Gateway - Magic The Gathering Deck Manager",
    version: "1.0.0",
    description: "Documentation complète de l'API Gateway pour la gestion de decks Magic The Gathering",
  },
  servers: [
    { 
      url: "http://localhost:5000",
      description: "Serveur de développement"
    }  
  ],
  components: {
    schemas: {
      // ============ CARD SCHEMAS ============
      Card: {
        type: "object",
        properties: {
          id: { 
            type: "string", 
            description: "ID unique de la carte",
            example: "card-abc123"
          },
          name: { 
            type: "string", 
            description: "Nom de la carte",
            example: "Lightning Bolt"
          },
          manaCost: { 
            type: "string", 
            description: "Coût en mana",
            example: "{R}"
          },
          cmc: {
            type: "number",
            description: "Coût converti en mana",
            example: 1
          },
          type: { 
            type: "string", 
            description: "Type de la carte",
            example: "Instant"
          },
          colors: { 
            type: "array", 
            items: { 
              type: "string",
              enum: ["W", "U", "B", "R", "G"]
            },
            description: "Couleurs de la carte (W=White, U=Blue, B=Black, R=Red, G=Green)",
            example: ["R"]
          },
          colorIdentity: {
            type: "array",
            items: {
              type: "string",
              enum: ["W", "U", "B", "R", "G"]
            },
            description: "Identité de couleur pour le format Commander"
          },
          imageUri: { 
            type: "string", 
            description: "URL de l'image de la carte",
            example: "https://cards.scryfall.io/normal/front/..."
          },
          power: { 
            type: "string", 
            nullable: true, 
            description: "Force de la créature",
            example: "3"
          },
          toughness: { 
            type: "string", 
            nullable: true, 
            description: "Endurance de la créature",
            example: "3"
          },
          text: {
            type: "string",
            description: "Texte de règles de la carte",
            example: "Lightning Bolt deals 3 damage to any target."
          },
          rarity: {
            type: "string",
            enum: ["common", "uncommon", "rare", "mythic"],
            description: "Rareté de la carte"
          },
          setName: {
            type: "string",
            description: "Nom de l'extension",
            example: "Alpha"
          },
          setCode: {
            type: "string",
            description: "Code de l'extension",
            example: "LEA"
          }
        },
        required: ["id", "name"]
      },
      
      CardSearchResult: {
        type: "object",
        properties: {
          cards: {
            type: "array",
            items: { $ref: "#/components/schemas/Card" }
          },
          nextCursor: {
            type: "string",
            nullable: true,
            description: "Curseur pour la page suivante (null s'il n'y a plus de résultats)"
          },
          hasMore: {
            type: "boolean",
            description: "Indique s'il y a plus de résultats disponibles"
          },
          total: {
            type: "integer",
            description: "Nombre total de résultats"
          }
        }
      },

      // ============ DECK SCHEMAS ============
      Deck: {
        type: "object",
        properties: {
          id: { 
            type: "string",
            description: "ID unique du deck",
            example: "deck-123"
          },
          name: { 
            type: "string",
            description: "Nom du deck",
            example: "Mon Deck Commander Azorius"
          },
          format: { 
            type: "string",
            enum: ["Commander", "Standard", "Modern", "Legacy", "Vintage", "Pioneer", "Pauper"],
            description: "Format du deck",
            example: "Commander"
          },
          ownerId: { 
            type: "string",
            description: "ID du propriétaire du deck",
            example: "user-456"
          },
          commanderId: { 
            type: "string", 
            nullable: true,
            description: "ID de la carte commandant (pour format Commander)",
            example: "card-789"
          },
          imageUri: { 
            type: "string",
            description: "URI de l'image représentant le deck",
            example: "https://example.com/deck-image.jpg"
          },
          colors: { 
            type: "array",
            items: { 
              type: "string",
              enum: ["W", "U", "B", "R", "G"]
            },
            description: "Couleurs du deck",
            example: ["W", "U"]
          },
          cards: { 
            type: "array",
            description: "Liste des cartes du deck",
            items: { $ref: "#/components/schemas/DeckCard" }
          },
          totalCards: {
            type: "integer",
            description: "Nombre total de cartes dans le deck",
            example: 100
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Date de création du deck"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Date de dernière modification"
          }
        },
        required: ["id", "name", "format", "ownerId"]
      },

      DeckCard: {
        type: "object",
        properties: {
          cardId: { 
            type: "string",
            description: "ID de la carte",
            example: "card-123"
          },
          quantity: { 
            type: "integer",
            minimum: 1,
            description: "Quantité de cette carte dans le deck",
            example: 1
          },
          card: {
            $ref: "#/components/schemas/Card",
            description: "Détails de la carte"
          }
        },
        required: ["cardId", "quantity"]
      },

      // ============ USER SCHEMAS ============
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "ID unique de l'utilisateur",
            example: "user-123"
          },
          name: {
            type: "string",
            description: "Nom de l'utilisateur",
            example: "John Doe"
          },
          email: {
            type: "string",
            format: "email",
            description: "Email de l'utilisateur",
            example: "john.doe@example.com"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Date de création du compte"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Date de dernière modification"
          }
        },
        required: ["id", "name", "email"]
      },

      UserCreate: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Nom de l'utilisateur",
            example: "John Doe"
          },
          email: {
            type: "string",
            format: "email",
            description: "Email de l'utilisateur",
            example: "john.doe@example.com"
          },
          password: {
            type: "string",
            format: "password",
            minLength: 8,
            description: "Mot de passe (minimum 8 caractères)",
            example: "SecureP@ssw0rd"
          }
        },
        required: ["name", "email", "password"]
      },

      // ============ ERROR SCHEMAS ============
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Message d'erreur",
            example: "Resource not found"
          },
          code: {
            type: "string",
            description: "Code d'erreur",
            example: "NOT_FOUND"
          },
          details: {
            type: "object",
            description: "Détails supplémentaires sur l'erreur"
          }
        }
      }
    },

    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT à inclure dans le header Authorization"
      }
    }
  },

  paths: {
    // ============ USER ROUTES ============
    "/users": {
      get: {
        summary: "Health check du service utilisateur",
        description: "Vérifie que le service utilisateur est accessible",
        tags: ["User"],
        responses: {
          200: { 
            description: "Service utilisateur opérationnel",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    service: { type: "string", example: "user-service" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/user/": {
      post: {
        summary: "Créer un nouvel utilisateur",
        description: "Enregistre un nouvel utilisateur dans le système",
        tags: ["User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserCreate" }
            }
          }
        },
        responses: {
          201: { 
            description: "Utilisateur créé avec succès",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          400: { 
            description: "Données invalides",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          409: {
            description: "Un utilisateur avec cet email existe déjà"
          }
        }
      }
    },

    "/user/all": {
      get: {
        summary: "Récupérer tous les utilisateurs",
        description: "Retourne la liste de tous les utilisateurs enregistrés",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des utilisateurs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" }
                }
              }
            }
          },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" }
        }
      }
    },

    "/user/{id}": {
      get: { 
        summary: "Obtenir un utilisateur par ID",
        description: "Retourne les détails d'un utilisateur spécifique",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur",
            example: "user-123"
          }
        ],
        responses: {
          200: {
            description: "Utilisateur trouvé",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          404: { description: "Utilisateur non trouvé" },
          401: { description: "Non autorisé" }
        }
      },
      delete: { 
        summary: "Supprimer un utilisateur",
        description: "Supprime définitivement un utilisateur et toutes ses données associées",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur à supprimer",
            example: "user-123"
          }
        ],
        responses: {
          204: { description: "Utilisateur supprimé avec succès" },
          404: { description: "Utilisateur non trouvé" },
          401: { description: "Non autorisé" }
        }
      }
    },

    // ============ CARD ROUTES ============
    "/cards": {
      get: {
        summary: "Récupérer plusieurs cartes par leurs IDs",
        description: "Retourne les détails des cartes correspondant aux IDs fournis. Utile pour récupérer toutes les cartes d'un deck.",
        tags: ["Cards"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["deckCards"],
                properties: {
                  deckCards: {
                    type: "array",
                    items: { type: "string" },
                    description: "Liste des IDs de cartes à récupérer",
                    example: ["card-1", "card-2", "card-3"],
                    minItems: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Liste des cartes récupérées",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Card" }
                }
              }
            }
          },
          400: { 
            description: "deckCards est requis ou invalide",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          404: { description: "Aucune carte trouvée pour les IDs fournis" },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" }
        }
      }
    },

    "/cards/deckColors": {
      get: {
        summary: "Récupérer les cartes par couleur (avec pagination)",
        description: "Retourne une liste paginée de cartes correspondant aux couleurs spécifiées. Supporte la pagination par curseur pour de meilleures performances.",
        tags: ["Cards"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "colors",
            in: "query",
            required: true,
            schema: { 
              type: "string",
              pattern: "^[WUBRG](,[WUBRG])*$"
            },
            description: "Couleurs séparées par des virgules. W=White, U=Blue, B=Black, R=Red, G=Green",
            examples: {
              mono: {
                value: "U",
                summary: "Mono-bleu"
              },
              azorius: {
                value: "W,U",
                summary: "Azorius (Blanc/Bleu)"
              },
              jund: {
                value: "B,R,G",
                summary: "Jund (Noir/Rouge/Vert)"
              }
            }
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { 
              type: "integer",
              default: 50,
              minimum: 1,
              maximum: 100
            },
            description: "Nombre maximum de cartes à retourner par page",
            example: 50
          },
          {
            name: "cursor",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Curseur de pagination pour récupérer la page suivante (obtenu depuis la réponse précédente)",
            example: "card-abc123"
          }
        ],
        responses: {
          200: {
            description: "Liste paginée de cartes",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CardSearchResult" }
              }
            }
          },
          400: { 
            description: "Paramètre colors manquant ou invalide",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          404: { description: "Aucune carte trouvée pour les couleurs spécifiées" },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" }
        }
      }
    },

    "/cards/search": {
      get: {
        summary: "Rechercher des cartes",
        description: "Effectue une recherche textuelle sur les noms de cartes, types, et texte de règles",
        tags: ["Cards"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["search"],
                properties: {
                  search: {
                    type: "string",
                    description: "Terme de recherche (nom, type, ou texte de règles)",
                    example: "Lightning Bolt",
                    minLength: 2
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Cartes correspondant à la recherche",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Card" }
                }
              }
            }
          },
          400: { 
            description: "Terme de recherche manquant ou trop court",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          404: { description: "Aucune carte trouvée pour la recherche" },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" }
        }
      }
    },

    "/cards/{id}": {
      get: {
        summary: "Récupérer une carte par son ID",
        description: "Retourne les détails complets d'une carte spécifique",
        tags: ["Cards"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID unique de la carte",
            example: "card-abc123"
          }
        ],
        responses: {
          200: {
            description: "Carte trouvée",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Card" }
              }
            }
          },
          400: { 
            description: "ID de carte invalide",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          404: { 
            description: "Carte non trouvée",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          500: { 
            description: "Erreur interne du serveur",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" }
        }
      }
    },

    // ============ DECK ROUTES ============
    "/deck/all": {
      get: {
        summary: "Récupérer tous les decks",
        description: "Retourne la liste complète de tous les decks disponibles dans le système",
        tags: ["Deck"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste de tous les decks",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Deck" }
                }
              }
            }
          },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" }
        }
      }
    },

    "/deck/": {
      post: {
        summary: "Créer un nouveau deck",
        description: "Permet de créer un nouveau deck avec les informations et cartes initiales fournies",
        tags: ["Deck"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "format", "ownerId"],
                properties: {
                  name: { 
                    type: "string", 
                    description: "Nom du deck",
                    example: "Mon Deck Commander Azorius",
                    minLength: 3,
                    maxLength: 100
                  },
                  format: { 
                    type: "string", 
                    description: "Format du deck",
                    enum: ["Commander", "Standard", "Modern", "Legacy", "Vintage", "Pioneer", "Pauper"],
                    example: "Commander"
                  },
                  ownerId: { 
                    type: "string", 
                    description: "ID du propriétaire du deck",
                    example: "user-123"
                  },
                  commanderId: { 
                    type: "string", 
                    nullable: true, 
                    description: "ID de la carte commandant (requis pour format Commander, ignoré pour les autres formats)",
                    example: "card-commander-123"
                  },
                  imageUri: { 
                    type: "string",
                    format: "uri",
                    description: "URI de l'image représentant le deck (optionnel, peut être généré automatiquement)",
                    example: "https://example.com/deck-image.jpg"
                  },
                  colors: { 
                    type: "array",
                    items: { 
                      type: "string",
                      enum: ["W", "U", "B", "R", "G"]
                    },
                    description: "Couleurs du deck (W=White, U=Blue, B=Black, R=Red, G=Green)",
                    example: ["W", "U"],
                    maxItems: 5,
                    uniqueItems: true
                  },
                  cards: { 
                    type: "array",
                    description: "Liste des cartes initiales du deck (optionnel)",
                    items: {
                      type: "object",
                      required: ["cardId", "quantity"],
                      properties: {
                        cardId: { 
                          type: "string",
                          description: "ID de la carte",
                          example: "card-789"
                        },
                        quantity: { 
                          type: "integer",
                          minimum: 1,
                          maximum: 99,
                          description: "Quantité de cette carte",
                          example: 1
                        }
                      }
                    },
                    example: []
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Deck créé avec succès",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Deck" }
              }
            }
          },
          400: { 
            description: "Données invalides - Vérifiez les champs requis et les contraintes de format",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" },
          404: { description: "Utilisateur propriétaire ou carte commandant introuvable" }
        }
      }
    },

    "/deck/{id}": {
      get: {
        summary: "Récupérer les decks d'un utilisateur",
        description: "Retourne tous les decks appartenant à un utilisateur spécifique",
        tags: ["Deck"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur dont on veut récupérer les decks",
            example: "user-123"
          }
        ],
        responses: {
          200: {
            description: "Liste des decks de l'utilisateur",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Deck" }
                }
              }
            }
          },
          400: { description: "ID d'utilisateur requis ou invalide" },
          404: { description: "Utilisateur non trouvé" },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" }
        }
      },
      put: {
        summary: "Mettre à jour un deck",
        description: "Modifie les informations d'un deck existant (nom, format, couleurs, etc.)",
        tags: ["Deck"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID du deck à mettre à jour",
            example: "deck-123"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { 
                    type: "string",
                    description: "Nouveau nom du deck",
                    example: "Mon Deck Commander Azorius Modifié",
                    minLength: 3,
                    maxLength: 100
                  },
                  format: { 
                    type: "string",
                    description: "Nouveau format du deck",
                    enum: ["Commander", "Standard", "Modern", "Legacy", "Vintage", "Pioneer", "Pauper"],
                    example: "Commander"
                  },
                  commanderId: { 
                    type: "string", 
                    nullable: true,
                    description: "Nouveau commandant (ou null pour retirer)",
                    example: "card-new-commander-456"
                  },
                  imageUri: { 
                    type: "string",
                    format: "uri",
                    description: "Nouvelle URI de l'image",
                    example: "https://example.com/new-deck-image.jpg"
                  },
                  colors: { 
                    type: "array", 
                    items: { 
                      type: "string",
                      enum: ["W", "U", "B", "R", "G"]
                    },
                    description: "Nouvelles couleurs du deck",
                    example: ["U", "B", "R"],
                    maxItems: 5,
                    uniqueItems: true
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Deck mis à jour avec succès",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Deck" }
              }
            }
          },
          400: { 
            description: "ID de deck requis ou données invalides",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          404: { 
            description: "Deck non trouvé",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" },
          403: { description: "Vous n'êtes pas autorisé à modifier ce deck" }
        }
      },
      delete: {
        summary: "Supprimer un deck",
        description: "Supprime définitivement un deck et toutes ses cartes associées. Cette action est irréversible.",
        tags: ["Deck"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID du deck à supprimer",
            example: "deck-123"
          }
        ],
        responses: {
          204: { description: "Deck supprimé avec succès - Pas de contenu retourné" },
          400: { 
            description: "ID de deck requis",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          404: { 
            description: "Deck non trouvé",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" },
          403: { description: "Vous n'êtes pas autorisé à supprimer ce deck" }
        }
      }
    },

    "/deck/{deckId}/cards/{cardId}": {
      post: {
        summary: "Ajouter une carte à un deck",
        description: "Ajoute une carte au deck ou incrémente sa quantité si elle existe déjà. Les règles de limite par carte selon le format sont appliquées.",
        tags: ["Deck", "Cards"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "deckId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID du deck",
            example: "deck-123"
          },
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de la carte à ajouter",
            example: "card-789"
          }
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  quantity: {
                    type: "integer",
                    minimum: 1,
                    default: 1,
                    description: "Quantité à ajouter (par défaut: 1)",
                    example: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Carte ajoutée avec succès au deck",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Deck" }
              }
            }
          },
          400: { 
            description: "ID de deck ou de carte requis, ou limite de quantité dépassée",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          404: { 
            description: "Deck ou carte non trouvé(e)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" },
          403: { description: "Vous n'êtes pas autorisé à modifier ce deck" }
        }
      },
      delete: {
        summary: "Retirer une carte d'un deck",
        description: "Retire une carte du deck ou décrémente sa quantité si elle est présente en plusieurs exemplaires",
        tags: ["Deck", "Cards"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "deckId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID du deck",
            example: "deck-123"
          },
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de la carte à retirer",
            example: "card-789"
          }
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  quantity: {
                    type: "integer",
                    minimum: 1,
                    default: 1,
                    description: "Quantité à retirer (par défaut: 1)",
                    example: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Carte retirée avec succès du deck",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Deck" }
              }
            }
          },
          400: { 
            description: "ID de deck ou de carte requis",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          404: { 
            description: "Deck ou carte non trouvé(e) dans ce deck",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          },
          401: { description: "Non autorisé - Token JWT manquant ou invalide" },
          403: { description: "Vous n'êtes pas autorisé à modifier ce deck" }
        }
      }
    }
  },

  tags: [
    {
      name: "User",
      description: "Gestion des utilisateurs"
    },
    {
      name: "Cards",
      description: "Recherche et consultation de cartes Magic The Gathering"
    },
    {
      name: "Deck",
      description: "Création et gestion de decks"
    }
  ]
};

export default swaggerSpec;