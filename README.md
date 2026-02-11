🎵 Vinyle Backend API

API REST pour la gestion de stock d'un disquaire. Permet de gérer les vinyles, les stocks et les utilisateurs avec des permissions granulaires (RBAC).

Construit avec Hono, TypeScript, MongoDB (Mongoose) et Zod.

🛠 Pré-requis

Avant de commencer, assurez-vous d'avoir installé :

Node.js (v20 ou supérieur recommandé)

pnpm (gestionnaire de paquets)

Un cluster MongoDB (Atlas ou local)

🚀 Installation & Démarrage

Installer les dépendances :

pnpm install


Configuration de l'environnement :
Créez un fichier .env à la racine du projet en copiant l'exemple ci-dessous :

# .env
SERVER_PORT=3000

# Configuration MongoDB (Atlas)
MONGO_USER=votre_utilisateur
MONGO_PWD=votre_mot_de_passe
MONGO_CLUSTER=votre_cluster.mongodb.net
MONGO_DATABASE=vinyle_db

# Sécurité
JWT_SECRET=votre_cle_secrete_tres_longue


Lancer le projet :

pnpm dev


Le serveur sera accessible sur http://localhost:3000/v1/api.

🔑 Utilisation Rapide de l'API

Une fois le serveur lancé, vous pouvez utiliser Postman ou cURL pour interagir avec l'API.

1. Créer les Rôles (Si base vide)

POST /v1/api/roles

{
  "name": "GERANT",
  "description": "Admin",
  "authorizations": [{ "ressource": "vinyls", "permissions": { "full": ["*"] } }]
}


2. Créer un Utilisateur

POST /v1/api/auth/register

{
  "email": "admin@vinyle.com",
  "password": "password123",
  "roles": ["GERANT"]
}


3. Se connecter

POST /v1/api/auth/login

{
  "email": "admin@vinyle.com",
  "password": "password123"
}


👉 Utilisez le token reçu dans le Header Authorization: Bearer <token> pour les requêtes suivantes.

4. Exemples Vinyles

Lister tout : GET /v1/api/vinyles

Rechercher : GET /v1/api/vinyles?group=Daft&condition=NEUF

Ajouter : POST /v1/api/vinyles

Modifier stock : PATCH /v1/api/vinyles/:id (Body: { "stock": 42 })