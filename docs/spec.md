## 1. Présentation du projet

### Objectif

Développer une application web permettant aux rugbymen de bénéficier d'un programme de préparation physique personnalisé et évolutif.

L'application agit comme un préparateur physique virtuel spécialisé rugby.

Chaque utilisateur reçoit un programme hebdomadaire adapté à :

- son poste
- ses objectifs
- sa disponibilité
- son matériel
- sa période de saison
- ses retours d'expérience

Les programmes évoluent chaque semaine en fonction des retours de l'utilisateur.

---

# 2. Public cible

### Cible principale

Rugbymen amateurs.

---

# 3. Proposition de valeur

L'utilisateur obtient :

- un programme adapté à son profil
- un programme adapté à son poste
- un programme adapté à sa saison sportive
- un programme adapté à son emploi du temps
- un programme qui évolue selon ses ressentis

L'objectif est de reproduire l'expérience d'un suivi par préparateur physique.

---

# 4. Parcours utilisateur

## Étape 1 : Création du profil

Lors de la première connexion, l'utilisateur complète un questionnaire.

### Informations personnelles

- Prénom

### Rugby

- Poste

Liste :

- Pilier
- Talonneur
- Deuxième ligne
- Troisième ligne
- Demi de mêlée
- Demi d'ouverture
- Centre
- Ailier
- Arrière

### Objectif principal

Choix unique :

- Musculation
- Explosivité
- Vitesse
- Endurance
- Retour de blessure

### Disponibilité

Nombre de séances hebdomadaires :

- 1 séance
- 2 séances
- 3 séances
- 4 séances
- 5 séances

Durée souhaitée :

- 30 minutes
- 45 minutes
- 60 minutes
- 90 minutes

### Environnement

Choix unique :

- Maison
- Salle de musculation complète

### Saison

Choix unique :

- Inter-saison
- Début de saison
- Milieu de saison
- Fin de saison

### Calendrier rugby

Sélection :

- Jours d'entraînement collectif

Sélection :

- Jour de match

---

# 5. Tableau de bord

Après l'onboarding, l'utilisateur arrive sur son espace personnel.

Le tableau de bord affiche :

### Informations principales

- Nom du joueur
- Poste
- Objectif

### Programme actuel

- Numéro de semaine
- Nombre de séances prévues
- Statut de chaque séance

Exemples :

- À faire
- En cours
- Terminée

---

# 6. Consultation du programme

Chaque semaine contient plusieurs séances.

Pour chaque séance :

### Informations générales

- Nom de la séance
- Objectif de la séance
- Durée estimée

### Contenu

Liste des exercices :

Pour chaque exercice :

- Nom
- Description détaillée
- Séries
- Répétitions
- Temps de repos

---

# 7. Validation d'une séance

À la fin d'une séance, l'utilisateur peut la clôturer.

Un formulaire de retour apparaît.

---

## Retour de séance

### Difficulté ressentie

Note de 1 à 10.

### Fatigue ressentie

Choix :

- Faible
- Normale
- Élevée

### Commentaire libre

Champ texte libre.

Exemple :

> Bonne séance mais les jambes étaient très lourdes.

---

# 8. Retour de fin de semaine

Une fois toutes les séances terminées :

L'utilisateur remplit un bilan hebdomadaire.

---

## Bilan hebdomadaire

### Note globale de la semaine

De 1 à 10.

### Commentaire général

Champ libre.

Exemple :

> Très bonne semaine mais récupération difficile après le match.

---

# 9. Génération de la semaine suivante

Une nouvelle semaine est générée automatiquement.

La nouvelle programmation prend en compte :

- le profil utilisateur
- le programme précédent
- les retours des séances
- le bilan hebdomadaire

L'objectif est d'adapter progressivement la charge de travail et le contenu des séances.

---

# 10. Historique

L'utilisateur peut consulter :

### Historique des programmes

Liste des semaines précédentes.

### Historique des retours

Consultation :

- notes de séances
- bilans hebdomadaires

---

# 11. Expérience utilisateur recherchée

L'application doit transmettre l'impression :

- d'un suivi personnalisé
- d'une progression continue
- d'un accompagnement professionnel
- d'une simplicité d'utilisation

Le temps nécessaire pour compléter un retour de séance doit être inférieur à 30 secondes.

---

# 12. Périmètre du MVP

Inclus :

✅ Création du profil

✅ Génération d'un programme personnalisé

✅ Consultation des séances

✅ Validation des séances

✅ Retours de séances

✅ Bilan hebdomadaire

✅ Génération de la semaine suivante

✅ Historique des semaines

---

Non inclus dans le MVP :

❌ Application mobile native

❌ Nutrition

❌ Suivi du poids

❌ Vidéos d'exercices

❌ Communauté

❌ Messagerie

❌ Classements

❌ Gamification

❌ Multi-sports

❌ Gestion avancée des blessures

❌ Synchronisation avec montres connectées

---

# Vision produit

Créer le préparateur physique virtuel de référence pour les rugbymen amateurs, capable de proposer des programmes personnalisés et évolutifs en fonction du profil sportif et des retours de l'utilisateur.
