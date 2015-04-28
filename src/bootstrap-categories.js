/*
 * Bootstrap Categories
 *
 * @author Nat Zimmermann <nat@natzim.me>
 * @license MIT
 */

(function($) {
    $.fn.categories = function(data, options) {
        /*
         * Functions
         */

        /**
         * Get the index of the object in the data array from the id
         *
         * @param  {Number} id
         *
         * @return {Number}
         */
        var getIndexFromId = function(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    return i;
                }
            }
        };

        /**
         * Create a select element and populate it with options from the given array
         *
         * @param {Number} parent
         *
         * @return {Object} jQuery object
         */
        var createSelect = function(parent) {
            var $selectContainer = $('<div class="'+ settings.columnClass +'">');

            if (settings.addable) {
                $selectContainer.append(
                    '<div class="form-group">'+
                        '<button data-parent="'+ parent +'" class="'+ settings.addButtonClass +'">'+ settings.addButtonHtml +'</button>'+
                    '</div>'
                );
            }

            $selectContainer.append(
                '<select multiple class="'+ settings.selectClass +'"></select>'
            );

            for (var i = 0; i < data.length; i++) {
                category = data[i];

                if (parent === null) {
                    if (!category.hasOwnProperty('parent')) {
                        $selectContainer
                            .children('select')
                            .append('<option data-id="'+ category.id +'">'+ category.name +'</option>');
                    }
                } else {
                    if (category.parent == parent) {
                        $selectContainer
                            .children('select')
                            .append('<option data-id="'+ category.id +'">'+ category.name +'</option>');
                    }
                }
            }

            return $root.append($selectContainer);
        };

        /*
         * Settings
         */

        var settings = $.extend({
            selectClass: 'form-control',
            columnClass: 'col-md-4',
            addButtonClass: 'btn btn-success',
            addButtonHtml: '+',
            editable: false,

            onCategoryAdd: function() {},
            onSelectChange: function() {}
        }, options);

        /*
         * Main
         */

        var $root = this;
        createSelect();

        /*
         * Events
         */

        $root.on('change', 'select', function() {
            var $selectedOption = $(this).children('option:selected');
            var categoryId = $selectedOption.data('id');

            // Remove all subsequent select elements after the changed select
            $(this).parent().nextAll().remove();

            var childrenCount = $.grep(data, function(category) {
                return category.parent == categoryId;
            }).length;

            if (childrenCount > 0) {
                createSelect(categoryId);
            }

            var categoryIndex = getIndexFromId(categoryId);

            settings.onSelectChange(data[categoryIndex], categoryIndex);
        });

        $root.on('click', '.btn-success', function() {
            var newCategory = {}

            newCategory.id = 0;

            // Set new category ID based on the maximum ID + 1
            for (var i = 0; i < data.length; i++) {
                var category = data[i];

                if (category.id >= newCategory.id) {
                    newCategory.id = category.id + 1;
                }
            }

            newCategory.name = prompt('New category name');

            var parent = $(this).data('parent');

            if (parent !== 'undefined') {
                newCategory.parent = $(this).data('parent');
            }

            var $select = $(this).parent().siblings('select');

            $select.append(
                '<option data-id="'+ newCategory.id +'">'+ newCategory.name +'</button>'
            );

            data.push(newCategory);

            settings.onCategoryAdd(newCategory, data.length - 1);
        });

        return $root;
    };
}(jQuery));
