(() => {
    "use strict";
    var e = e || {};
    e.initResources = function() {
        var e = $(document).find("input[name=payment_method]").first();
        e.length && (e.trigger("click").trigger("change"), e.closest(".list-group-item").find(".payment_collapse_wrap").addClass("show")), 
        $(".stripe-card-wrapper").length > 0 && new Card({
            form: ".payment-checkout-form",
            container: ".stripe-card-wrapper",
            formSelectors: {
                numberInput: "input#stripe-number",
                expiryInput: "input#stripe-exp",
                cvcInput: "input#stripe-cvc",
                nameInput: "input#stripe-name"
            },
            width: 350,
            formatting: !0,
            messages: {
                validDate: "valid\ndate",
                monthYear: "mm/yyyy"
            },
            placeholders: {
                number: "•••• •••• •••• ••••",
                name: "Full Name",
                expiry: "••/••",
                cvc: "•••"
            },
            masks: {
                cardNumber: "•"
            },
            debug: !1
        })
    }, e.init = function() {
        e.initResources(), $(document).on("change", ".js_payment_method", (function() {
            $(".payment_collapse_wrap").removeClass("collapse").removeClass("show").removeClass("active")
        })), $(document).off("click", ".payment-checkout-btn").on("click", ".payment-checkout-btn", (function(e) {
            e.preventDefault();
            var t = $(this),
                r = t.closest("form");
            t.attr("disabled", "disabled");
            var n = t.html();
            t.html('<i class="fa fa-gear fa-spin"></i> ' + t.data("processing-text")), "stripe" === $("input[name=payment_method]:checked").val() ? (Stripe.setPublishableKey($("#payment-stripe-key").data("value")), Stripe.card.createToken(r, (function(e, a) {
                a.error ? ("undefined" != typeof Botble ? Botble.showError(a.error.message, t.data("error-header")) : alert(a.error.message), t.removeAttr("disabled"), t.html(n)) : (r.append($('<input type="hidden" name="stripeToken">').val(a.id)), r.submit())
            }))) : r.submit()
        }))
    }, $(document).ready((function() {
        e.init(), document.addEventListener("payment-form-reloaded", (function() {
            e.initResources()
        }))
    }))
})();