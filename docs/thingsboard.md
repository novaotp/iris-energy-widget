# Thingsboard

Welcome to the un-official Thingsboard documentation. The [official Thingsboard documentation](https://thingsboard.io/docs/user-guide/contribution/widgets-development/) being _almost_ empty, you'll find here some explanations on some elements I've worked with in this widget.

- Author : Sajidur Rahman
- Last update : 17.08.2023

Javascript version in Thingsboard : ES5

## ctx

The [widget context](https://github.com/thingsboard/thingsboard/blob/13e6b10b7ab830e64d31b99614a9d95a1a25928a/ui-ngx/src/app/modules/home/models/widget-component.models.ts#L83)

## Widget API

### $container

The ```self.ctx.$container``` variable is a [jQuery element](https://api.jquery.com/) to reference the DOM inside the widget itself.

Remarque : Do not use ```document``` if you want to instanciate multiple widgets.

### detectChanges()

The ```self.ctx.detectChanges()``` function detects any changes. Use it in [self.onDataUpdated()](#ondataupdated)

### defaultSubscription

The ```self.ctx.defaultSubscription``` variable contains all the [data subscription](https://thingsboard.io/docs/user-guide/contribution/widgets-development/#subscription-object), depending on the widget type.

### settings

The ```self.ctx.settings``` variable contains data about the schema in the ["Settings Schema" tab](https://thingsboard.io/docs/user-guide/contribution/widgets-development/#settings-schema-section) in Thingsboard.

## Proprietary functions

### onInit()

The ```self.onInit()``` function is triggered once.

### onDataUpdated()

The ```self.onDataUpdated()``` function triggers every time the data changes. Look into the [defaultSubscription](#defaultsubscription).

### onResize()

The ```self.onResize()``` function triggers every time the widget is resized. You can use jQuery to access the props.

### onEditModeChanged()

The ```self.onEditModeChanged()``` function triggers every time you enter or leave the edit mode.