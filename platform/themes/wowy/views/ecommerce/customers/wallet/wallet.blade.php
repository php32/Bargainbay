@extends(Theme::getThemeNamespace() . '::views.ecommerce.customers.master')
@section('content')
<link rel="stylesheet" href="{{ asset('vendor/core/plugins/payment/css/payment.css') }}?v=1.0.3">

<style>
    .form-group input {
        border: 1px solid #f0e9ff;
    }
    h5.checkout-payment-title {
        font-size: 1.25rem;
        margin-bottom: 10px;
    }
</style>
<div class="card">
    <div class="card-header">
        <div class="ps-section__header">
            <h3>
                {{ SeoHelper::getTitle() }}
            </h3>
        </div>
    </div>
    <div class="card-body">
        <div class="ps-section__content">
            <div class="amount-box text-center">
                <img alt="wallet" src="https://lh3.googleusercontent.com/ohLHGNvMvQjOcmRpL4rjS3YQlcpO0D_80jJpJ-QA7-fQln9p3n7BAnqu3mxQ6kI4Sw" style="width: 50px;">
                    <p>
                        Total Balance
                    </p>
                    <p class="amount mb-10">
                        {{format_price(auth('customer')->user()->balance)}}
                    </p>
                </img>
            </div>
            <div class="btn-group mb-10" style="width: 100%;">
                <button class="btn btn-outline-light" data-toggle="collapse" data-target="#checkout-form" aria-expanded="false" aria-controls="checkout-form" type="button">
                    Add Money
                </button>
            </div>
            {!! Form::open(['route' => ['customer.wallet.process', $token], 'class' => 'checkout-form wallet-checkout-form payment-checkout-form collapse', 'id' => 'checkout-form']) !!}
            <div id="main-checkout-product-info">
                <div class="col-lg-12 col-md-12 left">
                    <div class="form-checkout">
                        <form action="{{ route('payments.checkout') }}" method="post">
                            @csrf
                            <input type="hidden" name="checkout-token" id="checkout-token" value="{{ $token }}">
                            <div class="position-relative">
                                <div class="payment-info-loading" style="display: none;">
                                    <div class="payment-info-loading-content">
                                        <i class="fas fa-spinner fa-spin"></i>
                                    </div>
                                </div>
                                <h5 class="checkout-payment-title">{{ __('Payment method') }}</h5>
                                <input type="hidden" name="currency" value="{{ strtoupper(get_application_currency()->title) }}">
                                {{-- <input type="hidden" name="callback_url" value="{{ route('public.payment.paypal.status') }}"> --}}
                                {{-- <input type="hidden" name="return_url" value="{{ \Botble\Payment\Supports\PaymentHelper::getRedirectURL($token) }}"> --}}
                                {!! apply_filters(PAYMENT_FILTER_PAYMENT_PARAMETERS, null) !!}
                                <ul class="list-group list_payment_method">
                                    @if (setting('payment_stripe_status') == 1)
                                        <div class="form-group">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <input class="form-control square" id="walletInput" name="wallet_money" type="text" placeholder="Enter wallet money" required>
                                                    <small id="walletvalid" class="form-text text-red invalid-feedback" style="display: none;">
                                                            Please enter wallet amount.
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <li class="list-group-item">
                                            <input class="magic-radio js_payment_method" type="radio" name="payment_method" id="payment_stripe"
                                                   value="stripe" @if (!setting('default_payment_method') || setting('default_payment_method') == \Botble\Payment\Enums\PaymentMethodEnum::STRIPE) checked @endif data-toggle="collapse" data-target=".payment_stripe_wrap" data-parent=".list_payment_method">
                                            <label for="payment_stripe" class="text-left">
                                                {{ setting('payment_stripe_name', trans('plugins/payment::payment.payment_via_card')) }}
                                            </label>
                                            <div class="payment_stripe_wrap payment_collapse_wrap collapse @if (!setting('default_payment_method') || setting('default_payment_method') == \Botble\Payment\Enums\PaymentMethodEnum::STRIPE) show @endif">
                                                <div class="card-checkout">
                                                    <div class="form-group">
                                                        <div class="stripe-card-wrapper"></div>
                                                    </div>
                                                    <div class="form-group @if ($errors->has('number') || $errors->has('expiry')) has-error @endif">
                                                        <div class="row">
                                                            <div class="col-sm-9">
                                                                <input placeholder="{{ trans('plugins/payment::payment.card_number') }}"
                                                                       class="form-control" type="text" id="stripe-number" data-stripe="number" autocomplete="off">
                                                            </div>
                                                            <div class="col-sm-3">
                                                                <input placeholder="{{ trans('plugins/payment::payment.mm_yy') }}" class="form-control"
                                                                       type="text" id="stripe-exp" data-stripe="exp">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group @if ($errors->has('name') || $errors->has('cvc')) has-error @endif">
                                                        <div class="row">
                                                            <div class="col-sm-9">
                                                                <input placeholder="{{ trans('plugins/payment::payment.full_name') }}"
                                                                       class="form-control" id="stripe-name" type="text" data-stripe="name" autocomplete="off">
                                                            </div>
                                                            <div class="col-sm-3">
                                                                <input placeholder="{{ trans('plugins/payment::payment.cvc') }}" class="form-control"
                                                                       type="text" id="stripe-cvc" data-stripe="cvc">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="payment-stripe-key" data-value="{{ setting('payment_stripe_client_id') }}"></div>
                                            </div>
                                        </li>
                                    @endif
                                    {{-- @if (setting('payment_paypal_status') == 1)
                                        <li class="list-group-item">
                                            <input class="magic-radio js_payment_method" type="radio" name="payment_method" id="payment_paypal"
                                                   @if (setting('default_payment_method') == \Botble\Payment\Enums\PaymentMethodEnum::PAYPAL) checked @endif
                                                   value="paypal">
                                            <label for="payment_paypal" class="text-left">{{ setting('payment_paypal_name', trans('plugins/payment::payment.payment_via_paypal')) }}</label>
                                        </li>
                                    @endif --}}  
                                </ul>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-6 mt-10 checkout-button-group">
                                        <button type="submit" @if (EcommerceHelper::getMinimumOrderAmount() > Cart::instance('cart')->rawSubTotal()) disabled @endif class="btn payment-checkout-btn payment-checkout-btn-step float-right" data-processing-text="{{ __('Processing. Please wait...') }}" data-error-header="{{ __('Error') }}">
                                            {{ __('Pay') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card-body">
        <div class="ps-section__content">
            <table class="table table-hover wallet">
                <thead>
                    <tr>
                        <th>
                            Transaction #ID
                        </th>
                        <th>
                            Date
                        </th>
                        <th>
                            Type
                        </th>
                        <th>
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($transactions as $transaction)
                    <tr>
                        <td>
                            {{$transaction->uuid}}
                        </td>
                        <td>
                            {{$transaction->created_at}}
                        </td>
                        <td>
                            {{$transaction->type}}
                        </td>
                        <td class="@if($transaction->type == 'deposit')green @else red @endif">
                            {{format_price($transaction->amount)}}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            {!! $transactions->links(Theme::getThemeNamespace() . '::partials.custom-pagination') !!}
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="{{ asset('vendor/core/plugins/payment/js/payment.js') }}?v=1.0.3"></script>
@if (setting('payment_stripe_status') == 1)
    <link rel="stylesheet" href="{{ asset('vendor/core/plugins/payment/libraries/card/card.css') }}">
    <script src="{{ asset('vendor/core/plugins/payment/libraries/card/card.js') }}"></script>
    <script src="{{ asset('https://js.stripe.com/v2/') }}"></script>
@endif
@endsection
