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
            for (var i = data.length - 1; i >= 0; --i) {
                if (data[i].id == id) {
                    return i;
                }
            }
        };

        /**
         * Generate a jQuery object for a category
         *
         * @param  {Object} category
         *
         * @return {Object}          jQuery object
         */
        var generateCategory = function(category) {
            var $listItem = $('<li class="list-group-item clearfix" data-id="'+ category.id +'">'+ category.name +'</li>');

            if (settings.removable) {
                $listItem.append('<button data-role="remove" class="'+ settings.removeButtonClass +'">'+ settings.removeButtonHtml +'</button>');
            }

            return $listItem;
        };

        /**
         * Create a select element and populate it with options from the given array
         *
         * @param  {Number} parent
         *
         * @return {Object}        jQuery object
         */
        var createSelect = function(parent) {
            if ($root.find('ul').length < settings.maxLevels) {
                var $selectContainer = $('<div class="'+ settings.columnClass +'">');

                if (settings.addable) {
                    // Append the 'add category' button
                    $selectContainer.append(
                        '<form data-parent="'+ parent +'">'+
                            '<div class="form-group">'+
                                '<button data-role="add" class="'+ settings.addButtonClass +'">'+ settings.addButtonHtml +'</button>'+
                            '</div>'+
                        '</form>'
                    );
                }

                $selectContainer.append('<ul class="'+ settings.selectClass +'"></ul>');

                var length = data.length;
                for (var i = 0; i < length; i++) {
                    var category = data[i];

                    if (parent === null && !category.hasOwnProperty('parent') || category.parent == parent) {
                        $selectContainer
                            .children('ul')
                            .append(generateCategory(category));
                    }
                }

                return $root.append($selectContainer);
            }
        };

        /*
         * Settings
         */

        var settings = $.extend({
            selectClass: 'list-group',
            columnClass: 'col-md-4',
            addButtonClass: 'btn btn-success',
            addButtonHtml: '+',
            removeButtonClass: 'btn btn-xs btn-danger pull-right',
            removeButtonHtml: 'X',
            addInputClass: 'form-control',
            addInputPlaceholder: 'Category name',
            removable: false,
            maxLevels: 3,

            onCategoryAdd: function() {},
            onCategoryRemove: function() {},
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
        $root.on('click', 'li', function(e) {
            // Prevent the browser from adding a # to the end of the url
            e.preventDefault();

            // Toggle active
            $(this).siblings().removeClass('active');
            $(this).addClass('active');

            var categoryId = $(this).data('id');
            var categoryIndex = getIndexFromId(categoryId);

            // Remove all subsequent select elements after the changed select
            $(this).parent().parent().nextAll().remove();

            createSelect(categoryId);

            settings.onSelectChange(data[categoryIndex], categoryIndex);
        });

        $root.on('submit', 'form', function(e) {
            // Prevent the form from submitting
            e.preventDefault();

            if ($(this).children('input').length === 0) {
                // Create a new input for the new category name
                $(this).prepend('<input data-role="add" type="text" placeholder="'+ settings.addInputPlaceholder +'" class="'+ settings.addInputClass +'">');

                // Focus on the new input
                $(this).children('input[data-role=add]').focus();

                // Hide add button
                $(this).find('button[data-role=add]').css('display', 'none');
            } else {
                var name = $(this).find('input[data-role=add]').val();

                if (name !== null && name.trim() !== '') {
                    var category = {
                        id: 0,
                        name: name
                    };

                    var parent = $(this).data('parent');
                    var $select = $(this).siblings('ul');

                    // Give the category an ID based on the maximum ID + 1
                    for (var i = data.length - 1; i >= 0; --i) {
                        if (data[i].id >= category.id) {
                            category.id = data[i].id + 1;
                        }
                    }

                    // Parent is only undefined if it is a root category (i.e. has no parent)
                    if (parent !== 'undefined') {
                        category.parent = parent;
                    }

                    $select.append(generateCategory(category));

                    // Add the newly created category to the array
                    data.push(category);

                    // Remove the category input
                    $(this).children('input[data-role=add]').remove();

                    // Show the add button
                    $(this).find('button[data-role=add]').css('display', 'inline-block');

                    settings.onCategoryAdd(category, data.length - 1);
                }
            }
        });

        $root.on('click', 'button[data-role=remove]', function(e) {
            // Prevent the parent from being clicked
            e.stopPropagation();

            var categoryId = $(this).parent().data('id');
            var categoryIndex = getIndexFromId(categoryId);
            var category = data[categoryIndex];

            // Removed subsequent columns
            $(this).closest('.'+ settings.columnClass).nextAll().remove();

            // Remove element from DOM
            $(this).parent().remove();

            // Remove element from array
            data.splice(categoryIndex, 1);

            settings.onCategoryRemove(category, categoryIndex);
        });

        return $root;
    };
}(jQuery));
