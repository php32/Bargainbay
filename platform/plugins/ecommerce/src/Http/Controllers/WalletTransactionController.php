<?php

namespace Botble\Ecommerce\Http\Controllers;

use Assets;
use Botble\Base\Http\Controllers\BaseController;
use Botble\Ecommerce\Repositories\Interfaces\WalletTransactionsInterface;
use Botble\Ecommerce\Tables\TransactionsTable;
use Exception;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\View\View;

class WalletTransactionController extends BaseController
{
    protected $walletTransactionsRepository;

    public function __construct(WalletTransactionsInterface $walletTransactionsRepository) {
        $this->walletTransactionsRepository = $walletTransactionsRepository;
    }

    /**
     * @param TransactionsTable $dataTable
     * @return Factory|View
     * @throws Throwable
     */
    public function index(TransactionsTable $dataTable)
    {
        page_title()->setTitle(trans('plugins/ecommerce::wallet.transactions'));

        return $dataTable->renderTable();
    }

    /**
     * @param int $id
     * @param Request $request
     * @param BaseHttpResponse $response
     * @return BaseHttpResponse
     */
    public function destroy($id, Request $request, BaseHttpResponse $response)
    {
        $wallet = $this->walletTransactionsRepository->findOrFail($id);

        try {
            $this->walletTransactionsRepository->deleteBy(['id' => $id]);
            event(new DeletedContentEvent(WALLET_MODULE_SCREEN_NAME, $request, $wallet));
            return $response->setMessage(trans('core/base::notices.delete_success_message'));
        } catch (Exception $exception) {
            return $response
                ->setError()
                ->setMessage($exception->getMessage());
        }
    }
}
