# Thingsboard

Bienvenue à la documentation inofficielle de Thingsboard. La [documentation de Thingsboard](https://thingsboard.io/docs/user-guide/contribution/widgets-development/) étant _presque_ inexistante, vous trouverez ici l'explication de certains éléments se trouvant dans le widget.

- Auteur : Sajidur Rahman
- Dernière mise à jour : 04.08.2023

Version Javascript : ES5

## ctx

Le contexte du widget.

## Widget API

### $scope

La variable ```self.ctx.$scope``` permet de définir des éléments référençables dans les autres [fonctions propriétaires](#fonctions-propriétaires) du widget.

### $container

La variable ```self.ctx.$container``` (jQuery) permet de référencer le dom du widget, permettant d'effectuer des modifications sur le DOM directement.

Remarque : Ne pas utiliser la variable ```document```.

### width

Propriété qui retourne la largeur du widget.

### height

Propriété qui retourne la hateur du widget.

### detectChanges()

La fonction ```self.ctx.detectChanges()``` permet de détecter les changements. À utiliser dans [self.onDataUpdated()](#ondataupdated)

### defaultSubscription

La variable ```self.ctx.defaultSubscription``` contient toutes les données de souscription, en lien avec le type de widget développé.

PS: La [documentation officielle](https://thingsboard.io/docs/user-guide/contribution/widgets-development/#subscription-object)

## Fonctions propriétaires

### onInit()

La fonction ```self.onInit()``` se lance **une** fois - à l'initialisation du widget.

Ajoutez des définitions d'objets dans le [scope](#scope) ici pour pouvoir y accéder depuis d'autres [fonctions propriétaires](#fonctions-propriétaires).

### onDataUpdated()

La fonction ```self.onDataUpdated()``` se lance **chaque** fois que [self.ctx.detectChanges()](#detectchanges) se lance.

Seuls les éléments qui doivent être mises à jour (par ex. les données en temps réel) devraient se trouver ici.

De plus, les dernières données sont accessibles via l'object [defaultSubscription](#defaultsubscription).

### onResize()

La fonction ```self.onResize()``` se lance **chaque** fois que le widget est redimensionné.

Les nouvelles dimensions sont accessibles via les propriétés [width](#width) et [height](#height).