# InternatEase

## À propos

InternatEase est une application web conçue pour faciliter la gestion des internats, en offrant des fonctionnalités de gestion des étudiants, des chambres et des réservations. Développée avec Next.js pour le front-end et Supabase pour le back-end, elle vise à simplifier les opérations quotidiennes des établissements d'enseignement.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Fonctionnalités](#fonctionnalités)
- [Auteurs](#auteurs)

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) 
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Supabase](https://supabase.io/) : Créez un compte et un projet pour obtenir les informations de connexion nécessaires.

## Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/thomaschrtt/internatease-front.git
   cd internatease-front
   ```
2. **Installer les dépendances :**

   Avec npm :

   ```bash
   npm install
   ```

   Ou avec Yarn :

   ```bash
   yarn install
    ```

3. Configurer les variables d'environnement :

Renommez le fichier `.env.example` en `.env.local` et remplissez les variables suivantes avec vos informations **Supabase** :

````dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
````
## Utilisation
Pour démarrer l'application en mode développement :

Avec npm :

```bash
npm run dev
```
Ou avec Yarn :

```bash
yarn dev
```

Ensuite, ouvrez http://localhost:3000 dans votre navigateur pour voir l'application.

## Fonctionnalités
- **Gestion des étudiants** : Ajout, modification et suppression des informations des étudiants.
- **Gestion des chambres** : Suivi de l'occupation des chambres et gestion des disponibilités.
- **Réservations** : Planification des séjours des étudiants avec gestion des dates d'arrivée et de départ.

## Auteurs
**Charotte** - _Développeur principal_ - [charotte](https://github.com/thomaschrtt)

 