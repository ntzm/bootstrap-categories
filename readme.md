# Bootstrap Categories

[Demo](http://natzim.me/bootstrap-categories)

## Documentation

### Usage

```javascript
element.categories(data, options);
```

Example

```javascript
var data = [
	{
		id: 0,
		name: 'Category',
	},
	{
		id: 1,
		name: 'Child',
		parent: 0
	},
	{
		id: 2,
		name: 'Leaf',
		parent: 1
	}
];

var options = {
	selectClass: 'form-control'
};

$('#element').categories(data, options);
```

### Options

Option | Type | Description | Default
------ | ---- | ----------- | -------
`selectClass` | String | Class given to generated `<select>` elements | `'list-group'`
`columnClass` | String | Class given to generated columns | `'col-md-4'`
`addButtonClass` | String | Class given to the add button | `'btn btn-success'`
`addButtonHtml` | String | HTML injected into the add button | `'+'`
`removeButtonClass` | String | Class given to the remove button | `'btn btn-xs btn-danger pull-right'`
`removeButtonHtml` | String | HTML injected into the remove button | `'X'`
`addInputClass` | String | Class given to the add input | `'form-control'`
`addInputPlaceholder` | String | Placeholder to be given to the add input | `'Category name'`
`addable` | Bool | Should the user be allowed to add new categories? | `false`
`removable` | Bool | Should the user be allowed to remove categories? | `false`
`maxLevels` | Number | The maximum number of levels allowed | `3`

### Events

#### `onAdd`

Called when a new category is added.

`object` refers to the newly created category object.

`index` refers to the index of the newly created category object in the `data` array.

```javascript
var options = {
	onAdd: function(object, index) {
		// Do something
	}
};
```

#### `onRemove`

Called when a category is removed.

`object` refers to the removed caetgory object.

`index` refers to the index where the category object was stored in the `data` array.

```javascript
var options = {
	onRemove: function(object, index) {
		// Do something
	}
};
```

#### `onSelect`

Fired when a category is selected.

`object` refers to the selected category object.

`index` refers to the index of the category object in the `data` array.

```javascript
var options = {
	onSelect: function(object, index) {
		// Do something
	}
};
```
