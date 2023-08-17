# Thingsboard

Bienvenue à la documentation inofficielle de Thingsboard. La [documentation de Thingsboard](https://thingsboard.io/docs/user-guide/contribution/widgets-development/) étant _presque_ inexistante, vous trouverez ici l'explication de certains éléments se trouvant dans le widget.

- Auteur : Sajidur Rahman
- Dernière mise à jour : 14.08.2023

Version Javascript : ES5

## ctx

Le contexte du widget.

## Widget API

### $container

La variable ```self.ctx.$container``` ([jQuery](https://api.jquery.com/)) permet de référencer le dom du widget.

Remarque : Ne pas utiliser la variable ```document```.

### detectChanges()

La fonction ```self.ctx.detectChanges()``` permet de détecter les changements. À utiliser dans [self.onDataUpdated()](#ondataupdated)

### defaultSubscription

La variable ```self.ctx.defaultSubscription``` contient toutes les données de souscription, en lien avec le type de widget développé.

PS: La [documentation officielle](https://thingsboard.io/docs/user-guide/contribution/widgets-development/#subscription-object)

### settings

La variable ```self.ctx.settings``` contient les données du schéma se trouvant dans le TAB "Settings Schema" de Thingsboard.

## Fonctions propriétaires

### onInit()

La fonction ```self.onInit()``` se lance **une** fois - à l'initialisation du widget.

### onDataUpdated()

La fonction ```self.onDataUpdated()``` se lance **chaque** fois qu'un changement de données est détecté.

De plus, les dernières données sont accessibles via l'object [defaultSubscription](#defaultsubscription).

### onResize()

La fonction ```self.onResize()``` se lance **chaque** fois que le widget est redimensionné.

Les nouvelles dimensions sont accessibles via le [container](#container).