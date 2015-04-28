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
`selectClass` | String | Class given to generated `<select>` elements | `'form-control'`
`columnClass` | String | Class given to generated columns | `'col-md-4'`
`addButtonClass` | String | Class given to the add button | `'btn btn-success'`
`addButtonHtml` | String | HTML injected into the add button | `'+'`
`addable` | Bool | Should the user be allowed to add new categories? | `false`

### Events

#### `onCategoryAdd`

Called when a new category is added.

`object` refers to the newly created category object.

`index` refers to the index of the newly created category object in the `data` array.

```javascript
var options = {
	onCategoryAdd: function(object, index) {
		// Do something
	}
};
```

#### `onSelectChange`

Fired when the selection changes.

`object` refers to the selected category object.

`index` refers to the index of the category object in the `data` array.

```javascript
var options = {
	onSelectChange: function(object, index) {
		// Do something
	}
};
```
