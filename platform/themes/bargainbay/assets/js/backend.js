(function ($) {
    'use strict';

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    window.botbleCookieNewsletter = (() => {

        const COOKIE_VALUE = 1;
        const COOKIE_NAME = 'botble_cookie_newsletter';
        const COOKIE_DOMAIN = $('div[data-session-domain]').data('session-domain');
        const COOKIE_MODAL = $('#subscribe');
        const COOKIE_MODAL_TIME = COOKIE_MODAL.data('time');

        function newsletterWithCookies(expirationInDays) {
            setCookie(COOKIE_NAME, COOKIE_VALUE, expirationInDays);
        }

        function cookieExists(name) {
            return document.cookie.split('; ').indexOf(name + '=' + COOKIE_VALUE) !== -1;
        }

        function hideCookieDialog() {
            if (!cookieExists(COOKIE_NAME) && $('#dont_show_again').is(':checked')) {
                newsletterWithCookies(3);
            } else {
                newsletterWithCookies(1 / 24);
            }
        }

        function setCookie(name, value, expirationInDays) {
            const date = new Date();
            date.setTime(date.getTime() + (expirationInDays * 24 * 60 * 60 * 1000));
            document.cookie = name + '=' + value
                + ';expires=' + date.toUTCString()
                + ';domain=' + COOKIE_DOMAIN
                + ';path=/';
        }

        if (!cookieExists(COOKIE_NAME)) {
            setTimeout(function () {
                if (COOKIE_MODAL.length > 0) {
                    COOKIE_MODAL.addClass('active');
                    $('body').css('overflow', 'hidden');
                }
            }, COOKIE_MODAL_TIME);
        }

        return {
            newsletterWithCookies: newsletterWithCookies,
            hideCookieDialog: hideCookieDialog
        };
    })();

    var showError = message => {
        window.showAlert('alert-danger', message);
    }

    var showSuccess = message => {
        window.showAlert('alert-success', message);
    }

    var handleError = data => {
        if (typeof (data.errors) !== 'undefined' && data.errors.length) {
            handleValidationError(data.errors);
        } else if (typeof (data.responseJSON) !== 'undefined') {
            if (typeof (data.responseJSON.errors) !== 'undefined') {
                if (data.status === 422) {
                    handleValidationError(data.responseJSON.errors);
                }
            } else if (typeof (data.responseJSON.message) !== 'undefined') {
                showError(data.responseJSON.message);
            } else {
                $.each(data.responseJSON, (index, el) => {
                    $.each(el, (key, item) => {
                        showError(item);
                    });
                });
            }
        } else {
            showError(data.statusText);
        }
    }

    var handleValidationError = errors => {
        let message = '';

        $.each(errors, (index, item) => {
            if (message !== '') {
                message += '<br />';
            }
            message += item;
        });

        showError(message);
    }

    window.showAlert = (messageType, message) => {
        if (messageType && message !== '') {
            let alertId = Math.floor(Math.random() * 1000);

            let html = `<div class="alert ${messageType} alert-dismissible" id="${alertId}">
                <span class="close fa fa-times-circle" data-dismiss="alert" aria-label="close"></span>
                <i class="fas fa-` + (messageType === 'alert-success' ? 'check-circle' : 'exclamation-circle') + ` message-icon"></i>
                ${message}
            </div>`;

            $('#alert-container').append(html).ready(() => {
                window.setTimeout(() => {
                    $(`#alert-container #${alertId}`).remove();
                }, 6000);
            });
        }
    }

    let isRTL = $('body').prop('dir') === 'rtl';

    $(document).ready(function () {
        window.onBeforeChangeSwatches = function (data) {
            $('.add-to-cart-form .error-message').hide();
            $('.add-to-cart-form .success-message').hide();
            $('.number-items-available').html('').hide();

            if (data && data.attributes) {
                $('.add-to-cart-form button[type=submit]').prop('disabled', true).addClass('btn-disabled');
            }
        }

        window.onChangeSwatchesSuccess = function (res) {
            $('.add-to-cart-form .error-message').hide();
            $('.add-to-cart-form .success-message').hide();

            if (res) {
                let buttonSubmit = $('.add-to-cart-form button[type=submit]');
                if (res.error) {
                    buttonSubmit.prop('disabled', true).addClass('btn-disabled');
                    $('.number-items-available').html('<span class="text-danger">(' + res.message + ')</span>').show();
                    $('.hidden-product-id').val('');
                } else {
                    $('.add-to-cart-form').find('.error-message').hide();
                    $('.price_range ins').text(res.data.display_sale_price);
                    if (res.data.sale_price !== res.data.price) {
                        $('.price_range del').text(res.data.display_price).show();
                    } else {
                        $('.price_range del').hide();
                    }

                    $('.sku_wrapper .value').text(res.data.sku);

                    $('.hidden-product-id').val(res.data.id);

                    buttonSubmit.prop('disabled', false).removeClass('btn-disabled');

                    if (res.data.error_message) {
                        buttonSubmit.prop('disabled', true).addClass('btn-disabled');
                        $('.number-items-available').html('<span class="text-danger">(' + res.data.error_message + ')</span>').show();
                    } else if (res.data.success_message) {
                        $('.number-items-available').html('<span class="text-success">(' + res.data.success_message + ')</span>').show();
                    } else {
                        $('.number-items-available').html('').hide();
                    }

                    const unavailableAttributeIds = res.data.unavailable_attribute_ids || [];
                    $('.attribute-swatch-item').removeClass('pe-none');
                    $('option.product-filter-item').prop('disabled', false);
                    if (unavailableAttributeIds && unavailableAttributeIds.length) {
                        unavailableAttributeIds.map(function (id) {
                            let $item = $('.attribute-swatch-item[data-id="' + id + '"]');
                            if ($item.length) {
                                $item.addClass('pe-none');
                                $item.find('input').prop('checked', false);
                            } else {
                                $item = $('option.product-filter-item[data-id="' + id + '"]');
                                if ($item.length) {
                                    $item.prop('disabled', 'disabled').prop('selected', false);
                                }
                            }
                        });
                    }

                    let slider = $('.product-image-slider');

                    slider.slick('unslick');

                    let imageHtml = '';
                    res.data.image_with_sizes.origin.forEach(function (item) {
                        imageHtml += '<figure class="border-radius-10"><img src="' + item + '" alt="image"/></figure>'
                    });

                    slider.html(imageHtml);

                    slider.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        rtl: isRTL,
                        arrows: false,
                        fade: false,
                        asNavFor: '.slider-nav-thumbnails',
                    });

                    let sliderThumbnail = $('.slider-nav-thumbnails');

                    sliderThumbnail.slick('unslick');

                    let thumbHtml = '';
                    res.data.image_with_sizes.thumb.forEach(function (item) {
                        thumbHtml += '<div class="item"><img src="' + item + '" alt="image"/></div>'
                    });

                    sliderThumbnail.html(thumbHtml);

                    sliderThumbnail.slick({
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        rtl: isRTL,
                        asNavFor: '.product-image-slider',
                        dots: false,
                        focusOnSelect: true,
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>'
                    });

                    // Remove active class from all thumbnail slides
                    sliderThumbnail.find('.slick-slide').removeClass('slick-active');

                    // Set active class to first thumbnail slides
                    sliderThumbnail.find('.slick-slide').eq(0).addClass('slick-active');

                    // On before slide change match active thumbnail to current slide
                    slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                        var mySlideNumber = nextSlide;
                        sliderThumbnail.find('.slick-slide').removeClass('slick-active');
                        sliderThumbnail.find('.slick-slide').eq(mySlideNumber).addClass('slick-active');
                    });

                    slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                        var img = $(slick.$slides[nextSlide]).find('img');
                        $('.zoomWindowContainer, .zoomContainer').remove();
                        $(img).elevateZoom({
                            zoomType: 'inner',
                            cursor: 'crosshair',
                            zoomWindowFadeIn: 500,
                            zoomWindowFadeOut: 750
                        });
                    });

                    if (slider.length) {
                        slider.find('.slick-active img').elevateZoom({
                            zoomType: 'inner',
                            cursor: 'crosshair',
                            zoomWindowFadeIn: 500,
                            zoomWindowFadeOut: 750
                        });
                    }
                }
            }
        };

        $('#subscribe').on('click', function (event) {
            if (!$(event.target).closest('.ps-popup__content').length) {
                $(this).removeClass('active');
                $('body').css('overflow-y', 'auto');

                window.botbleCookieNewsletter.hideCookieDialog();
            }
        });

        $(document).on('click', '.newsletter-form button[type=submit]', function (event) {
            event.preventDefault();
            event.stopPropagation();

            let _self = $(this);

            _self.addClass('button-loading');

            $.ajax({
                type: 'POST',
                cache: false,
                url: _self.closest('form').prop('action'),
                data: new FormData(_self.closest('form')[0]),
                contentType: false,
                processData: false,
                success: res => {
                    _self.removeClass('button-loading');

                    if (typeof refreshRecaptcha !== 'undefined') {
                        refreshRecaptcha();
                    }

                    if (!res.error) {
                        _self.closest('form').find('input[type=email]').val('');
                        showSuccess(res.message);
                    } else {
                        showError(res.message);
                    }
                },
                error: res => {
                    if (typeof refreshRecaptcha !== 'undefined') {
                        refreshRecaptcha();
                    }
                    _self.removeClass('button-loading');
                    handleError(res);
                }
            });
        });

        $(document).on('change', '.switch-currency', function () {
            $(this).closest('form').submit();
        });

        $(document).on('click', '.js-add-to-wishlist-button', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'POST',
                success: res => {

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    $('.wishlist-count span').text(res.data.count);
                    _self.removeClass('button-loading');
                    _self.toggleClass('wis_added');

                    _self.removeClass('button-loading')
                        .removeClass('js-add-to-wishlist-button')
                        .addClass('js-remove-from-wishlist-button');
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.js-remove-from-wishlist-button', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'DELETE',
                success: res => {

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    $('.header-action-right .pro-count').text(res.data.count);
                    _self.removeClass('button-loading');

                    _self.closest('tr').remove();
                    _self.removeClass('js-remove-from-wishlist-button')
                        .addClass('js-add-to-wishlist-button');
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.js-add-to-compare-button', function (event) {
            event.preventDefault();
            let _self = $(this);
            _self.addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'POST',
                success: res => {

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    $('.compare-count span').text(res.data.count);
                    _self.removeClass('button-loading');
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.js-remove-from-compare-button', function (event) {
            event.preventDefault();
            let _self = $(this);
            let buttonHtml = _self.html();

            _self.html(buttonHtml + '...');

            $.ajax({
                url: _self.data('url'),
                method: 'DELETE',
                success: res => {

                    if (res.error) {
                        _self.text(buttonHtml);
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    $('.table__compare').load(window.location.href + ' .table__compare > *', function () {
                        window.showAlert('alert-success', res.message);

                        _self.html(buttonHtml);
                    });
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.add-to-cart-button', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.prop('disabled', true).addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'POST',
                data: {
                    id: _self.data('id')
                },
                dataType: 'json',
                success: res => {
                    _self.prop('disabled', false).removeClass('button-loading').addClass('active');

                    if (res.error) {
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    if (_self.prop('name') === 'checkout' && res.data.next_url !== undefined) {
                        window.location.href = res.data.next_url;
                    } else {
                        $.ajax({
                            url: window.siteUrl + '/ajax/cart',
                            method: 'GET',
                            success: response => {
                                if (!response.error) {
                                    $('.cart-dropdown-wrap').html(response.data.html);
                                    $('.mini-cart-icon span').text(response.data.count);
                                }
                            }
                        });
                    }
                },
                error: res => {
                    _self.prop('disabled', false).removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.add-to-cart-form button[type=submit]', function (event) {
            event.preventDefault();
            event.stopPropagation();

            let _self = $(this);

            if (!$('.hidden-product-id').val()) {
                _self.prop('disabled', true).addClass('btn-disabled');
                return;
            }

            _self.prop('disabled', true).addClass('btn-disabled').addClass('button-loading');

            $.ajax({
                type: 'POST',
                cache: false,
                url: _self.closest('form').prop('action'),
                data: new FormData(_self.closest('form')[0]),
                contentType: false,
                processData: false,
                success: res => {
                    _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    if (_self.prop('name') === 'checkout' && res.data.next_url !== undefined) {
                        window.location.href = res.data.next_url;
                    } else {
                        $.ajax({
                            url: window.siteUrl + '/ajax/cart',
                            method: 'GET',
                            success: function (response) {
                                if (!response.error) {
                                    $('.cart-dropdown-wrap').html(response.data.html);
                                    $('.mini-cart-icon span').text(response.data.count);
                                }
                            }
                        });
                    }
                },
                error: res => {
                    _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                    handleError(res, _self.closest('form'));
                }
            });
        });

        $(document).on('click', '.remove-cart-item', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.closest('li').addClass('content-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'GET',
                success: res => {
                    _self.closest('li').removeClass('content-loading');

                    if (res.error) {
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    $.ajax({
                        url: window.siteUrl + '/ajax/cart',
                        method: 'GET',
                        success: response => {
                            if (!response.error) {
                                $('.cart-dropdown-wrap').html(response.data.html);
                                $('.mini-cart-icon span').text(response.data.count);
                                window.showAlert('alert-success', res.message);
                            }
                        }
                    });
                },
                error: res => {
                    _self.closest('li').removeClass('content-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.remove-cart-button', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.closest('.table--cart').addClass('content-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'GET',
                success: function (res) {

                    if (res.error) {
                        window.showAlert('alert-danger', res.message);
                        _self.closest('.table--cart').removeClass('content-loading');
                        return false;
                    }

                    $('.section--shopping-cart').load(window.location.href + ' .section--shopping-cart > *', function () {
                        _self.closest('.table--cart').removeClass('content-loading');
                        window.showAlert('alert-success', res.message);
                    });

                    $.ajax({
                        url: window.siteUrl + '/ajax/cart',
                        method: 'GET',
                        success: response => {
                            if (!response.error) {
                                $('.cart-dropdown-wrap').html(response.data.html);
                                $('.mini-cart-icon span').text(response.data.count);
                            }
                        }
                    });
                },
                error: res => {
                    _self.closest('.table--cart').removeClass('content-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('change', '.submit-form-on-change', function () {
            $(this).closest('form').submit();
        });

        $(document).on('click', '.form-review-product button[type=submit]', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).prop('disabled', true).addClass('btn-disabled').addClass('button-loading');

            $.ajax({
                type: 'POST',
                cache: false,
                url: $(this).closest('form').prop('action'),
                data: new FormData($(this).closest('form')[0]),
                contentType: false,
                processData: false,
                success: res => {
                    if (!res.error) {
                        $(this).closest('form').find('select').val(0);
                        $(this).closest('form').find('textarea').val('');

                        showSuccess(res.message);

                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    } else {
                        showError(res.message);
                    }

                    $(this).prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                },
                error: res => {
                    $(this).prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                    handleError(res, $(this).closest('form'));
                }
            });
        });

        $('.form-coupon-wrapper .coupon-code').keypress(event => {
            if (event.keyCode === 13) {
                $('.apply-coupon-code').trigger('click');
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        });

        /**
         * Update Cart
         */
        // $(document).on('click', '.detail-qty .qty-up', function (event) {
        //     event.preventDefault();
        //     event.stopPropagation();
        //     console.log('cart up from plateform/themes/wowy/assets/js/backend');
        //     let qtyval = parseInt($(this).closest('.detail-qty').find('.qty-val').text(), 10);
        //     qtyval = qtyval + 1;
        //     $(this).prev().text(qtyval);
        //     $(this).closest('.detail-qty').find('input').val(qtyval);

        //     if ($(this).closest('.section--shopping-cart').length) {
        //         ajaxUpdateCart($(this));
        //     }
        // });

        // $(document).on('click', '.detail-qty .qty-down', function (event) {
        //     console.log('hereee1111')
        //     event.preventDefault();
        //     event.stopPropagation();
        //     let qtyval = parseInt($(this).closest('.detail-qty').find('.qty-val').text(), 10);

        //     qtyval = qtyval - 1;
        //     if (qtyval > 1) {
        //         $(this).next().text(qtyval);
        //     } else {
        //         qtyval = 1;
        //         $(this).next().text(qtyval);
        //     }

        //     $(this).closest('.detail-qty').find('input').val(qtyval).trigger('change');

        //     if (qtyval >= 0) {
        //         if ($(this).closest('.section--shopping-cart').length) {
        //             ajaxUpdateCart($(this));
        //         }
        //     }
        // });

        function ajaxUpdateCart(_self) {

            _self.closest('.table--cart').addClass('content-loading');

            $.ajax({
                type: 'POST',
                cache: false,
                url: _self.closest('form').prop('action'),
                data: new FormData(_self.closest('form')[0]),
                contentType: false,
                processData: false,
                success: res => {
                    if (res.error) {
                        window.showAlert('alert-danger', res.message);
                        _self.closest('.table--cart').removeClass('content-loading');
                        return false;
                    }

                    $('.section--shopping-cart').load(window.location.href + ' .section--shopping-cart > *', function () {
                        _self.closest('.table--cart').removeClass('content-loading');
                        window.showAlert('alert-success', res.message);
                    });

                    $.ajax({
                        url: window.siteUrl + '/ajax/cart',
                        method: 'GET',
                        success: response => {
                            if (!response.error) {
                                $('.cart-dropdown-wrap').html(response.data.html);
                                $('.mini-cart-icon span').text(response.data.count);
                            }
                        }
                    });
                },
                error: res => {
                    _self.closest('.table--cart').removeClass('content-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        }

        $(document).on('click', '.btn-apply-coupon-code', event => {
            event.preventDefault();
            let _self = $(event.currentTarget);
            _self.prop('disabled', true).addClass('btn-disabled').addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                type: 'POST',
                data: {
                    coupon_code: _self.closest('.form-coupon-wrapper').find('.coupon-code').val(),
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: res => {
                    if (!res.error) {
                        $('.section--shopping-cart').load(window.location.href + '?applied_coupon=1 .section--shopping-cart > *', function () {
                            _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                            window.showAlert('alert-success', res.message);
                        });
                    } else {
                        window.showAlert('alert-danger', res.message);
                        _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                    }
                },
                error: data => {
                    if (typeof (data.responseJSON) !== 'undefined') {
                        if (data.responseJSON.errors !== 'undefined') {
                            $.each(data.responseJSON.errors, (index, el) => {
                                $.each(el, (key, item) => {
                                    window.showAlert('alert-danger', item);
                                });
                            });
                        } else if (typeof (data.responseJSON.message) !== 'undefined') {
                            window.showAlert('alert-danger', data.responseJSON.message);
                        }
                    } else {
                        window.showAlert('alert-danger', data.status.text);
                    }
                    _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                }
            });
        });

        $(document).on('click', '.btn-remove-coupon-code', event => {
            event.preventDefault();
            let _self = $(event.currentTarget);
            let buttonText = _self.text();
            _self.text(_self.data('processing-text'));

            $.ajax({
                url: _self.data('url'),
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: res => {
                    if (!res.error) {
                        $('.section--shopping-cart').load(window.location.href + ' .section--shopping-cart > *', function () {
                            _self.text(buttonText);
                        });
                    } else {
                        window.showAlert('alert-danger', res.message);
                        _self.text(buttonText);
                    }
                },
                error: data => {
                    if (typeof (data.responseJSON) !== 'undefined') {
                        if (data.responseJSON.errors !== 'undefined') {
                            $.each(data.responseJSON.errors, (index, el) => {
                                $.each(el, (key, item) => {
                                    window.showAlert('alert-danger', item);
                                });
                            });
                        } else if (typeof (data.responseJSON.message) !== 'undefined') {
                            window.showAlert('alert-danger', data.responseJSON.message);
                        }
                    } else {
                        window.showAlert('alert-danger', data.status.text);
                    }
                    _self.text(buttonText);
                }
            });
        });

        $(document).on('click', '.js-remove-from-wishlist-button-wishlist', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'DELETE',
                success: res => {

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    $('.wishlist-count span').text(res.data.count);
                    _self.removeClass('button-loading');

                    _self.closest('tr').remove();
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(window).on('load', function () {
            let $modal = $('#flash-sale-modal');
            if ($modal.length && !getCookie($modal.data('id'))) {
                setTimeout(function () {
                    $modal.modal('show');
                    setCookie($modal.data('id'), 1, 1);
                }, 5000);
            }
        });

        $(document).on('click', '.js-quick-view-button', event => {
            event.preventDefault();

            let $modal = $('#quick-view-modal');

            $modal.find('.quick-view-content').html('');
            $modal.find('.modal-body').addClass('modal-empty');
            $modal.find('.loading-spinner').show();
            $modal.modal('show');

            $.ajax({
                url: $(event.currentTarget).data('url'),
                type: 'GET',
                success: res => {
                    if (!res.error) {
                        $modal.find('.loading-spinner').hide();
                        $modal.find('.modal-body').removeClass('modal-empty');
                        let $quickViewContent = $modal.find('.quick-view-content');
                        $quickViewContent.html(res.data);

                        $modal.find('.product-image-slider').slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            rtl: isRTL,
                            arrows: false,
                            fade: false,
                            asNavFor: '.slider-nav-thumbnails',
                        });

                        $modal.find('.slider-nav-thumbnails').slick({
                            slidesToShow: 5,
                            slidesToScroll: 1,
                            rtl: isRTL,
                            asNavFor: '.product-image-slider',
                            dots: false,
                            focusOnSelect: true,
                            prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                            nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>'
                        });

                        // Remove active class from all thumbnail slides
                        $modal.find('.slider-nav-thumbnails .slick-slide').removeClass('slick-active');

                        // Set active class to first thumbnail slides
                        $modal.find('.slider-nav-thumbnails .slick-slide').eq(0).addClass('slick-active');

                        // On before slide change match active thumbnail to current slide
                        $modal.find('.product-image-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                            var mySlideNumber = nextSlide;
                            $modal.find('.slider-nav-thumbnails .slick-slide').removeClass('slick-active');
                            $modal.find('.slider-nav-thumbnails .slick-slide').eq(mySlideNumber).addClass('slick-active');
                        });

                        $modal.find('.product-image-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                            var img = $(slick.$slides[nextSlide]).find("img");
                            $('.zoomWindowContainer, .zoomContainer').remove();
                            $(img).elevateZoom({
                                zoomType: "inner",
                                cursor: "crosshair",
                                zoomWindowFadeIn: 500,
                                zoomWindowFadeOut: 750
                            });
                        });
                        //Elevate Zoom
                        if ($('.product-image-slider').length) {
                            $('.product-image-slider .slick-active img').elevateZoom({
                                zoomType: 'inner',
                                cursor: 'crosshair',
                                zoomWindowFadeIn: 500,
                                zoomWindowFadeOut: 750
                            });
                        }
                        //Filter color/Size
                        $('.list-filter').each(function () {
                            $(this).find('a').on('click', function (event) {
                                event.preventDefault();
                                $(this).parent().siblings().removeClass('active');
                                $(this).parent().toggleClass('active');
                                $(this).parents('.attr-detail').find('.current-size').text($(this).text());
                                $(this).parents('.attr-detail').find('.current-color').text($(this).attr('data-color'));
                            });
                        });
                        //Qty Up-Down
                        $('.detail-qty').each(function () {
                            var qtyval = parseInt($(this).find('.qty-val').text(), 10);

                            $('.qty-up').on('click', function (event) {
                                event.preventDefault();
                                qtyval = qtyval + 1;
                                $(this).prev().text(qtyval);
                                $(this).closest('.detail-qty').find('input').val(qtyval);
                            });

                            $('.qty-down').on('click', function (event) {
                                event.preventDefault();
                                qtyval = qtyval - 1;
                                if (qtyval > 1) {
                                    $(this).next().text(qtyval);
                                } else {
                                    qtyval = 1;
                                    $(this).next().text(qtyval);
                                }

                                $(this).closest('.detail-qty').find('input').val(qtyval);
                            });
                        });

                    } else {
                        window.showAlert('alert-danger', res.message);
                        $modal.modal('hide');
                    }
                },
                error: () => {
                    $modal.modal('hide');
                }
            });
        });

        // Products filter ajax
        const $formSearch = $('#products-filter-ajax');
        const $productListing = $('.products-listing');

        function changeInputInSearchForm(parseParams) {
            $formSearch.find('input, select, textarea').each(function (e, i) {
                const $el = $(i);
                const name = $el.attr('name');
                let value = parseParams[name] || null;
                const type = $el.attr('type');
                switch (type) {
                    case 'checkbox':
                        $el.prop('checked', false);
                        if (Array.isArray(value)) {
                            $el.prop('checked', value.includes($el.val()));
                        } else {
                            $el.prop('checked', !!value);
                        }
                        break;
                    default:
                        if ($el.is('[name=max_price]')) {
                            $el.val(value || $el.data('max'));
                        } else if ($el.is('[name=min_price]')) {
                            $el.val(value || $el.data('min'));
                        } else if ($el.val() != value) {
                            $el.val(value);
                        }
                        break;
                }

                $el.trigger('change');
            });
        }

        $(document).on('click', '.clear_filter.clear_all_filter', function (e) {
            e.preventDefault();
            changeInputInSearchForm([]);
            $formSearch.trigger('submit');
        })

        $(document).on('click', '.clear_filter.bf_icons', function (e) {
            e.preventDefault();
            const $this = $(e.currentTarget);
            let name = $this.data('name');
            let value = $this.data('value');
            let $input;
            if (name.substring(name.length - 2) == '[]') {
                $input = $formSearch.find('[name="' + name + '"][value="' + value + '"]');
                switch ($input.attr('type')) {
                    case 'checkbox':
                        $input.prop('checked', false);
                        break;
                    default:
                        $input.val(null);
                        break;
                }
            } else {
                $input = $formSearch.find('[name="' + name + '"]');
                switch ($input.attr('name')) {
                    case 'min_price':
                        $input.val($input.data('min'));
                        break;
                    case 'max_price':
                        $input.val($input.data('max'));
                        break;
                    default:
                        $input.val(null);
                        break;
                }
            }

            if ($input) {
                $input.trigger('change');
            }

            $formSearch.trigger('submit');
        });

        function checkHasAnyFilter(formData) {
            if (!formData) {
                formData = $formSearch.serializeArray();
            }
            let filtered = convertFromDataToArray(formData);
            let isFiltering = false;
            if (filtered && filtered.length) {
                filtered.map((x) => {
                    let findBy;
                    if (x.name.substring(x.name.length - 2) == '[]') {
                        findBy = '[name="' + x.name + '"][value="' + x.value + '"]';
                    } else {
                        findBy = '[name="' + x.name + '"]';
                    }
                    let $input = $formSearch.find(findBy);
                    if ($input.length) {
                        isFiltering = true;
                    }
                });
            }

            if ($('.shop-filter-toogle').length) {
                if (isFiltering) {
                    $('.shop-filter-toogle').addClass('is-filtering');
                } else {
                    $('.shop-filter-toogle').removeClass('is-filtering');
                }
            }
        }

        checkHasAnyFilter();

        function convertFromDataToArray(formData) {
            let data = [];
            formData.forEach(function (obj) {
                if (obj.value) {
                    // break with price
                    if (['min_price', 'max_price'].includes(obj.name)) {
                        const dataValue = $formSearch.find('input[name=' + obj.name + ']').data(obj.name.substring(0, 3));
                        if (dataValue == parseInt(obj.value)) {
                            return;
                        }
                    }
                    data.push(obj);
                }
            });

            return data;
        }

        if ($formSearch.length) {
            $(document).on('submit', '#products-filter-ajax', function (event) {
                event.preventDefault();
                const $form = $(event.currentTarget);
                const formData = $form.serializeArray();
                let data = convertFromDataToArray(formData);
                let uriData = [];

                const $inputs = $productListing.find('input');
                $inputs.map(function (i, el) {
                    const $input = $(el);
                    if ($input.val()) {
                        data.push({name: $input.attr('name'), value: $input.val()});

                    }
                });

                // Without "s" param
                data.map(function (obj) {
                    uriData.push(encodeURIComponent(obj.name) + '=' + obj.value);
                })

                const nextHref = $form.attr('action') + (uriData && uriData.length ? ('?' + uriData.join('&')) : '');

                // add to params get to popstate not show json
                data.push({name: 's', value: 1});

                $.ajax({
                    url: $form.attr('action'),
                    type: 'GET',
                    data: data,
                    beforeSend: function () {
                        // Show loading before sending
                        $productListing.find('.list-content-loading').show();
                        if (window.closeShopFilterSection) {
                            window.closeShopFilterSection();
                        }
                        // Animation scroll to filter button
                        $('html, body').animate({
                            scrollTop: $formSearch.offset().top - $('header').height()
                        }, 500);
                    },
                    success: function (res) {
                        if (res.error == false) {
                            $productListing.html(res.data);
                            if (nextHref != window.location.href) {
                                window.history.pushState(data, res.message, nextHref);
                            }
                            checkHasAnyFilter(formData);
                        } else {
                            showError(res.message || 'Opp!');
                        }
                    },
                    error: function (res) {
                        handleError(res);
                    },
                    complete: function () {
                        $productListing.find('.list-content-loading').hide();
                    }
                });
            });

            window.addEventListener('popstate', function () {
                let url = window.location.origin + window.location.pathname;
                if ($formSearch.attr('action') == url) {
                    const parseParams = parseParamsSearch();
                    changeInputInSearchForm(parseParams);
                    $formSearch.trigger('submit');
                } else {
                    history.back()
                }
            }, false);

            $(document).on('click', '.products-listing .pagination-page a', function (e) {
                e.preventDefault();
                var url = new URL($(e.currentTarget).attr('href'));
                var page = url.searchParams.get("page");
                $productListing.find('input[name=page]').val(page)
                $formSearch.trigger('submit');
            });

            $(document).on('click', '.products_sortby .products_ajaxsortby a', function (e) {
                e.preventDefault();
                const $this = $(e.currentTarget);
                const href = $this.attr('href');
                const $parent = $this.closest('.products_ajaxsortby');
                $parent.find('a.selected').removeClass('selected');
                $this.addClass('selected');
                if (href.indexOf('?') >= 0) {
                    const queryString = href.substring(href.indexOf('?') + 1);
                    if (queryString) {
                        const parse = parseParamsSearch(queryString);
                        $productListing.find('input[name="' + $parent.data('name') + '"]').val(parse[$parent.data('name')]);
                    }
                }
                $formSearch.trigger('submit');
            });
        }

        function parseParamsSearch(query, includeArray = false) {
            let pairs = query || window.location.search.substring(1);
            let re = /([^&=]+)=?([^&]*)/g;
            let decodeRE = /\+/g;  // Regex for replacing addition symbol with a space
            let decode = function (str) {
                return decodeURIComponent(str.replace(decodeRE, " "));
            };

            let params = {}, e;
            while (e = re.exec(pairs)) {
                let k = decode(e[1]), v = decode(e[2]);
                if (k.substring(k.length - 2) == '[]') {
                    if (includeArray) {
                        k = k.substring(0, k.length - 2);
                    }
                    (params[k] || (params[k] = [])).push(v);
                } else {
                    params[k] = v;
                }
            }

            return params;
        }

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            var url = new URL(window.siteUrl);
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = 'expires=' + d.toUTCString();
            document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/' + '; domain=' + url.hostname;
        }

        function getCookie(cname) {
            var name = cname + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        }

        let searchTimeout = null;
        $('#input-search')
            .on('keydown', function () {
                $('.ps-panel--search-result').html('').removeClass('active');
            })
            .on('keyup', function () {
                const k = $(this).val();
                if (k) {
                    $('.ps-form--quick-search .spinner-icon').show();
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(function () {
                        const form = $('.ps-form--quick-search');
                        $.ajax({
                            type: 'GET',
                            url: form.data('ajax-url'),
                            data: form.serialize(),
                            success: res => {
                                if (!res.error && res.data !== '') {
                                    $('.ps-panel--search-result').html(res.data).addClass('active');
                                } else {
                                    $('.ps-panel--search-result').html('').removeClass('active');
                                }

                                $('.ps-form--quick-search .spinner-icon').hide();
                            },
                            error: () => {
                                $('.ps-form--quick-search .spinner-icon').hide();
                            }
                        });
                    }, 500);
                }
            });

        $('.rating_wrap > a ').on('click', function (e) {
            e.preventDefault();
            const target = $(this).attr('href');
            $('.ps-tab-list li').removeClass('active');
            $('.ps-tab-list li > a[href="' + target + '"]').closest('li').addClass('active');

            $(target).addClass('active');
            $(target)
                .siblings('.ps-tab')
                .removeClass('active');
            $(target).closest('.ps-tab-root').find('li').removeClass('active');
            $(target).closest('.ps-tab-root').find('li a[href="' + target + '"]').closest('li').addClass('active');

            $('html, body').animate(
                {
                    scrollTop: ($(target).offset().top - $('.header--product .navigation').height() - 165) + 'px',
                },
                800
            );
        });

        $(document).on('click', 'input[name=is_vendor]', function () {
           if ($(this).val() == 1) {
               $('.show-if-vendor').slideDown().show();
           } else {
               $('.show-if-vendor').slideUp();
               setTimeout(function () {
                   $('.show-if-vendor').hide();
               }, 500);
           }
        });

        $('#shop-url').on('keyup', function () {
                let displayURL = $(this).closest('.form-group').find('span small');
                displayURL.html(displayURL.data('base-url') + '/<strong>' + $(this).val().toLowerCase() + '</strong>');
            }).on('change', function () {
                $('.shop-url-wrapper').addClass('content-loading');
                $(this).closest('form').find('button[type=submit]').addClass('btn-disabled').prop('disabled', true);

                $.ajax({
                    url: $(this).data('url'),
                    type: 'POST',
                    data: {
                        url: $(this).val(),
                    },
                    success: res =>  {
                        $('.shop-url-wrapper').removeClass('content-loading');
                        if (res.error) {
                            $('.shop-url-status').removeClass('text-success').addClass('text-danger').text(res.message);

                        } else {
                            $('.shop-url-status').removeClass('text-danger').addClass('text-success').text(res.message);
                            $(this).closest('form').find('button[type=submit]').prop('disabled', false).removeClass('btn-disabled');
                        }
                    },
                    error: () =>  {
                        $('.shop-url-wrapper').removeClass('content-loading');
                    }
                });
            });
    });

})(jQuery);
