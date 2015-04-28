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
         * @param  {Number} parent
         *
         * @return {Object}        jQuery object
         */
        var createSelect = function(parent) {
            var $selectContainer = $('<div class="'+ settings.columnClass +'">');

            if (settings.addable) {
                // Append the 'add category' button
                $selectContainer.append(
                    '<div class="form-group">'+
                        '<button data-parent="'+ parent +'" class="'+ settings.addButtonClass +'">'+ settings.addButtonHtml +'</button>'+
                    '</div>'
                );
            }

            $selectContainer.append(
                '<ul class="'+ settings.selectClass +'"></ul>'
            );

            var length = data.length;
            for (var i = 0; i < length; i++) {
                var category = data[i];

                if (parent === null && !category.hasOwnProperty('parent') || category.parent == parent) {
                    $selectContainer
                        .children('ul')
                        .append(
                            '<li data-id="'+ category.id +'">'+
                                '<a href="#">'+ category.name +'</a>'+
                            '</li>'
                        );
                }
            }

            return $root.append($selectContainer);
        };

        /*
         * Settings
         */

        var settings = $.extend({
            selectClass: 'nav nav-pills nav-stacked',
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

        // When a category is selected
        $root.on('click', 'li', function() {
            // Toggle active
            $(this).siblings().removeClass('active');
            $(this).addClass('active');

            var categoryId = $(this).data('id');
            var categoryIndex = getIndexFromId(categoryId);

            // Remove all subsequent select elements after the changed select
            $(this).parent().parent().nextAll().remove();

            // Find out if the category has any children
            var hasChildren = false;
            var length = data.length;
            for (var i = 0; i < length; i++) {
                if (data[i].parent == categoryId) {
                    hasChildren = true;
                    break;
                }
            }

            if (hasChildren) {
                createSelect(categoryId);
            }

            settings.onSelectChange(data[categoryIndex], categoryIndex);
        });

        $root.on('click', '.btn-success', function() {
            // TODO: Use an input element rather than a prompt
            var name = prompt('New category name');

            // Ensure the user has entered a new name, or has not cancelled
            if (name !== null && name.trim() !== '') {
                var category = {
                    id: 0,
                    name: name
                };

                var parent = $(this).data('parent');
                var $select = $(this).parent().siblings('ul');

                // Give the category an ID based on the maximum ID + 1
                var length = data.length;
                for (var i = 0; i < length; i++) {
                    if (data[i].id >= category.id) {
                        category.id = data[i].id + 1;
                    }
                }

                // Parent is only undefined if it is a root category (i.e. has no parent)
                if (parent !== 'undefined') {
                    category.parent = parent;
                }

                $select.append(
                    '<li data-id="'+ category.id +'">'+
                        '<a href="#">'+ category.name +'</a>'+
                    '</li>'
                );

                // Add the newly created category to the array
                data.push(category);

                settings.onCategoryAdd(category, data.length - 1);
            }
        });

        return $root;
    };
}(jQuery));
