(() => {
    "use strict";
    $(document).ready((function() {
        $(document).on("click", ".add-faq-schema-items", (function(e) {
            e.preventDefault(), $(".faq-schema-items").toggleClass("hidden")
        }))
    }))
})();