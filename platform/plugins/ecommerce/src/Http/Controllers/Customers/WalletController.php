<?php

namespace Botble\Ecommerce\Http\Controllers\Customers;

use Botble\Base\Http\Responses\BaseHttpResponse;
use Botble\Ecommerce\Http\Requests\EditAccountRequest;
use Botble\Ecommerce\Http\Requests\WalletRequest;
use Botble\Ecommerce\Repositories\Interfaces\AddressInterface;
use Botble\Ecommerce\Repositories\Interfaces\CustomerInterface;
use Botble\Ecommerce\Repositories\Interfaces\OrderHistoryInterface;
use Botble\Ecommerce\Repositories\Interfaces\OrderInterface;
use Botble\Ecommerce\Repositories\Interfaces\ProductInterface;
use Botble\Payment\Enums\PaymentMethodEnum;
use Botble\Payment\Services\Gateways\BankTransferPaymentService;
use Botble\Payment\Services\Gateways\CodPaymentService;
use Botble\Payment\Services\Gateways\PayPalPaymentService;
use Botble\Payment\Services\Gateways\StripePaymentService;
use Botble\Payment\Supports\PaymentHelper;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use Response;
use SeoHelper;
use Theme;

class WalletController extends Controller
{
    /**
     * @var CustomerInterface
     */
    protected $customerRepository;

    /**
     * @var ProductInterface
     */
    protected $productRepository;

    /**
     * @var AddressInterface
     */
    protected $addressRepository;

    /**
     * @var OrderInterface
     */
    protected $orderRepository;

    /**
     * @var OrderHistoryInterface
     */
    protected $orderHistoryRepository;

    /**
     * PublicController constructor.
     * @param CustomerInterface $customerRepository
     * @param ProductInterface $productRepository
     * @param AddressInterface $addressRepository
     * @param OrderInterface $orderRepository
     * @param OrderHistoryInterface $orderHistoryRepository
     */
    public function __construct(
        CustomerInterface $customerRepository,
        ProductInterface $productRepository,
        AddressInterface $addressRepository,
        OrderInterface $orderRepository,
        OrderHistoryInterface $orderHistoryRepository
    ) {
        $this->customerRepository     = $customerRepository;
        $this->productRepository      = $productRepository;
        $this->addressRepository      = $addressRepository;
        $this->orderRepository        = $orderRepository;
        $this->orderHistoryRepository = $orderHistoryRepository;

        Theme::asset()
            ->add('customer-style', 'vendor/core/plugins/ecommerce/css/customer.css');
        Theme::asset()
            ->container('footer')
            ->add('ecommerce-utilities-js', 'vendor/core/plugins/ecommerce/js/utilities.js', ['jquery']);

        Theme::asset()
            ->container('footer')
            ->add('avatar-js', 'vendor/core/plugins/ecommerce/js/avatar.js', ['jquery']);
    }

    /**
     * @return Response
     */
    public function getWallet()
    {
        SeoHelper::setTitle(__('Wallet information'));

        Theme::breadcrumb()
            ->add(__('Home'), route('public.index'))
            ->add(__('Wallet information'), route('customer.wallet'));

        $customer     = auth('customer')->user();
        $transactions = $customer->transactions()->where(['wallet_id' => $customer->wallet->getKey(), 'confirmed' => 1])->orderBy('created_at', 'desc')->paginate(10);
        $token = md5(Str::random(40));

        return Theme::scope('ecommerce.customers.wallet.wallet', compact('transactions', 'token'), 'plugins/ecommerce::themes.customers.overview')
            ->render();
    }

    /**
     * @param EditAccountRequest $request
     * @param BaseHttpResponse $response
     * @return BaseHttpResponse
     */
    public function postWalletProcess($token, WalletRequest $request, PayPalPaymentService $payPalService,
        StripePaymentService $stripePaymentService,
        CodPaymentService $codPaymentService,
        BankTransferPaymentService $bankTransferPaymentService,
        BaseHttpResponse $response)
    {
        
        $customer     = auth('customer')->user();
        $depositValue = $request->wallet_money;
        $paymentData = [
            'error'     => false,
            'message'   => false,
            'amount'    => (float)format_price($depositValue, null, true),
            'currency'  => strtoupper(get_application_currency()->title),
            'type'      => $request->input('payment_method'),
            'charge_id' => null,
        ];

        $transaction = $customer->deposit($depositValue, null, false); // not confirm
        // $request->merge(['return_url' => route('customer.wallet', $transaction->uuid)]);
        $request->merge([
            'name'   => __('Pay for wallet deposit :uuid', ['uuid' => $transaction->uuid]),
            'amount' => $paymentData['amount'],
        ]);
        
        switch ($request->input('payment_method')) {
            case PaymentMethodEnum::STRIPE:
                $result = $stripePaymentService->execute($request);
                if ($stripePaymentService->getErrorMessage()) {
                    $paymentData['error'] = true;
                    $paymentData['message'] = $stripePaymentService->getErrorMessage();
                }

                $paymentData['charge_id'] = $result;

                break;

            case PaymentMethodEnum::PAYPAL:

                $checkoutUrl = $payPalService->execute($request);
                if ($checkoutUrl) {
                    return redirect($checkoutUrl);
                }

                $paymentData['error'] = true;
                $paymentData['message'] = $payPalService->getErrorMessage();
                break;
            case PaymentMethodEnum::COD:
                $paymentData['charge_id'] = $codPaymentService->execute($request);
                break;

            case PaymentMethodEnum::BANK_TRANSFER:
                $paymentData['charge_id'] = $bankTransferPaymentService->execute($request);
                break;
            default:
                $paymentData = apply_filters(PAYMENT_FILTER_AFTER_POST_CHECKOUT, $paymentData, $request);
                break;
        }

        if ($paymentData['error'] || !$paymentData['charge_id']) {
            return $response
                ->setError()
                ->setNextUrl(route('customer.wallet'))
                ->withInput()
                ->setMessage($paymentData['message'] ?: __('Payment error!'));
        }
        
        $customer->confirm($transaction);
        
        return $response
            ->setNextUrl(route('customer.wallet'))
            ->setMessage(__('Amount added in wallet successfully!'));
    }

    /**
     * @param EditAccountRequest $request
     * @param BaseHttpResponse $response
     * @return BaseHttpResponse
     */
    public function postWidthdrawWallet(WalletRequest $request, BaseHttpResponse $response)
    {
        $customer     = auth('customer')->user();
        $depositValue = $request->wallet_money;
        $customer->withdraw($depositValue);
        $customer->wallet->refreshBalance();
        return $response
            ->setNextUrl(route('customer.wallet'))
            ->setMessage(__('Deposit in wallet successfully!'));
    }

    public function getWalletSuccess($token, BaseHttpResponse $response)
    {
        $customer     = auth('customer')->user();
        $transactions = $customer->transactions()->where(['uuid' => $token])->first();

        if (!$transactions) {

        }

        $customer->confirm($transaction);
            
    }
}
