@php
    Theme::layout('full-width');
@endphp

<section class="pt-100 pb-100">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 m-auto">
                <div class="login_wrap widget-taber-content p-30 background-white border-radius-10">
                    <div class="padding_eight_all bg-white">
                        <div class="heading_s1 mb-20">
                            <h3 class="mb-20">{{ __('Register') }}</h3>
                            <p>{{ __('Please fill in the information below') }}</p>
                        </div>

                        <form class="form--auth" method="POST" action="{{ route('customer.register.post') }}">
                            @csrf
                            <div class="form__content">
                                <div class="form-group">
                                    <label for="txt-name" class="required">{{ __('Name') }}</label>
                                    <input class="form-control" name="name" id="txt-name" type="text" value="{{ old('name') }}" placeholder="{{ __('Please enter your name') }}">
                                    @if ($errors->has('name'))
                                        <span class="text-danger">{{ $errors->first('name') }}</span>
                                    @endif
                                </div>
                                <div class="form-group">
                                    <label for="txt-email" class="required">{{ __('Email Address') }}</label>
                                    <input class="form-control" name="email" id="txt-email" type="email" value="{{ old('email') }}" placeholder="{{ __('Please enter your email address') }}">
                                    @if ($errors->has('email'))
                                        <span class="text-danger">{{ $errors->first('email') }}</span>
                                    @endif
                                </div>
                                <div class="form-group">
                                    <label for="txt-password" class="required">{{ __('Password') }}</label>
                                    <input class="form-control" type="password" name="password" id="txt-password" placeholder="{{ __('Please enter your password') }}">
                                    @if ($errors->has('password'))
                                        <span class="text-danger">{{ $errors->first('password') }}</span>
                                    @endif
                                </div>

                                <div class="form-group">
                                    <label for="txt-password-confirmation" class="required">{{ __('Password confirmation') }}</label>
                                    <input class="form-control" type="password" name="password_confirmation" id="txt-password-confirmation" placeholder="{{ __('Please enter your password confirmation') }}">
                                    @if ($errors->has('password_confirmation'))
                                        <span class="text-danger">{{ $errors->first('password_confirmation') }}</span>
                                    @endif
                                </div>

                                @if (is_plugin_active('marketplace'))
                                    <div class="show-if-vendor" @if (old('is_vendor') == 0) style="display: none" @endif>
                                        <div class="form-group">
                                            <label for="shop-name" class="required">{{ __('Shop Name') }}</label>
                                            <input class="form-control" name="shop_name" id="shop-name" type="text" value="{{ old('shop_name') }}" placeholder="{{ __('Shop Name') }}">
                                            @if ($errors->has('shop_name'))
                                                <span class="text-danger">{{ $errors->first('shop_name') }}</span>
                                            @endif
                                        </div>
                                        <div class="form-group shop-url-wrapper">
                                            <label for="shop-url" class="required float-left">{{ __('Shop URL') }}</label>
                                            <span class="d-inline-block float-right shop-url-status"></span>
                                            <input class="form-control" name="shop_url" id="shop-url" type="text" value="{{ old('shop_url') }}" placeholder="{{ __('Shop URL') }}" data-url="{{ route('public.ajax.check-store-url') }}">
                                            @if ($errors->has('shop_url'))
                                                <span class="text-danger">{{ $errors->first('shop_url') }}</span>
                                            @endif
                                            <span class="d-inline-block"><small data-base-url="{{ route('public.store', '') }}">{{ route('public.store', (string)old('shop_url')) }}</small></span>
                                        </div>
                                        <div class="form-group">
                                            <label for="shop-phone" class="required">{{ __('Phone Number') }}</label>
                                            <input class="form-control" name="shop_phone" id="shop-phone" type="text" value="{{ old('shop_phone') }}" placeholder="{{ __('Shop phone') }}">
                                            @if ($errors->has('shop_phone'))
                                                <span class="text-danger">{{ $errors->first('shop_phone') }}</span>
                                            @endif
                                        </div>
                                    </div>
                                    <div class="form-group user-role">
                                        <p>
                                            <label class="d-flex">
                                                <input class="vendor-radio" type="radio" name="is_vendor" value="0" @if (old('is_vendor') == 0) checked="checked" @endif>
                                                <span class="d-inline-block">
                                                    {{ __('I am a customer') }}
                                                </span>
                                            </label>
                                        </p>
                                        <p>
                                            <label class="d-flex">
                                                <input class="vendor-radio" type="radio" name="is_vendor" value="1" @if (old('is_vendor') == 1) checked="checked" @endif>
                                                <span class="d-inline-block">
                                                    {{ __('I am a vendor') }}
                                                </span>
                                            </label>
                                        </p>
                                    </div>
                                @endif

                                <div class="form-group">
                                    <p>{{ __('Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.') }}</p>
                                </div>

                                <div class="login_footer form-group">
                                    <div class="chek-form">
                                        <div class="custome-checkbox">
                                            <input type="hidden" name="agree_terms_and_policy" value="0">
                                            <input class="form-check-input" type="checkbox" name="agree_terms_and_policy" id="agree-terms-and-policy" value="1">
                                            <label class="form-check-label" for="agree-terms-and-policy"><span>{{ __('I agree to terms & Policy.') }}</span></label>
                                        </div>
                                    </div>
                                </div>

                                @if (setting('enable_captcha') && is_plugin_active('captcha'))
                                    {!! Captcha::display() !!}
                                @endif

                                <div class="form-group">
                                    <div class="ps-checkbox">

                                    </div>
                                    @if ($errors->has('agree_terms_and_policy'))
                                        <span class="text-danger">{{ $errors->first('agree_terms_and_policy') }}</span>
                                    @endif
                                </div>

                                <div class="form-group">
                                    <button type="submit" class="btn btn-fill-out btn-block hover-up">{{ __('Register') }}</button>
                                </div>

                                <br>
                                <p>{{ __('Have an account already?') }} <a href="{{ route('customer.login') }}" class="d-inline-block">{{ __('Login') }}</a></p>

                                <div class="text-left">
                                    {{-- {!! apply_filters(BASE_FILTER_AFTER_LOGIN_OR_REGISTER_FORM, null, \Botble\Ecommerce\Models\Customer::class) !!} --}}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
