$(document).ready(function() {
    // dropymenu
    // http://codepen.io/Tombek/pen/OPvpLe
    var menu = {
        $menuInstance: null,
        openClass: 'open',
        selectClass: 'selected',
        init: function() {
            var self = this;

            self.$menuInstance = $('.menu');
            self.eventHandler();
        },
        eventHandler: function() {
            var self = this;

            // Opening a menu
            self.$menuInstance.find('.menu-title').click(function() {
                self.$menuInstance.removeClass(self.openClass);
                $(this).parents('.menu').addClass(self.openClass);
            });

            // Click on a menu list
            self.$menuInstance.find('.menu-content ul li a').click(function() {
                var $that = $(this);
                var $menu = $that.parents('.menu');
                var $input = $menu.find('input');
                var $title = $(this).parents('.menu').find('.menu-title span');

                // Remove selected class
                $menu.find('.menu-content a').each(function() {
                    $(this).removeClass(self.selectClass);
                });

                // Update selected value
                $title.html($that.html());
                $input.val($that.attr('data-value')).trigger('change');

                // If back to default, remove selected class else addclass on right element
                if ($that.hasClass('menu-header')) {
                    $title.removeClass(self.selectClass);
                    $title.html($title.attr('data-title'));
                } else {
                    $title.addClass(self.selectClass);
                    $that.addClass(self.selectClass);
                }

                // Close dropdown
                $menu.removeClass(self.openClass);
            });

            // Close all dropdown onclick on another element
            $(document).bind('click', function(e) {
                if (!$(e.target).parents().hasClass('menu')) { self.$menuInstance.removeClass(self.openClass); }
            });
        }
    };

    $(function() {
        menu.init();
    });
});
