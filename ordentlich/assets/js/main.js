/* jshint devel:true */
/* globals jQuery, document */
(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $(document).ready(function() {
      var menuToggle = $('#js-centered-navigation-mobile-menu').unbind();
      $('#js-centered-navigation-menu').removeClass("show");
      
      menuToggle.on('click', function(e) {
        e.preventDefault();
        var img = $(this).find('img');
        if (img.hasClass('rotated')) {
          img.removeClass('rotated');  
        } else {
          img.addClass('rotated');  
        }
        $('#js-centered-navigation-menu').slideToggle(function(){
          if($('#js-centered-navigation-menu').is(':hidden')) {
            $('#js-centered-navigation-menu').removeAttr('style');
          }
        });
      });
    });

})(jQuery);
