<?php

namespace Botble\Ecommerce\Tables;

use BaseHelper;
use Botble\Ecommerce\Repositories\Interfaces\WalletTransactionsInterface;
use Botble\Table\Abstracts\TableAbstract;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Support\Facades\Auth;
use Yajra\DataTables\DataTables;

class TransactionsTable extends TableAbstract
{

    /**
     * @var bool
     */
    protected $hasActions = false;

    /**
     * @var bool
     */
    protected $hasFilter = false;

    /**
     * WalletTransactionTable constructor.
     * @param DataTables $table
     * @param UrlGenerator $urlGenerator
     * @param WalletTransactionsInterface $walletTransactionsRepository
     */
    public function __construct(DataTables $table, UrlGenerator $urlGenerator, WalletTransactionsInterface $walletTransactionsRepository)
    {
        parent::__construct($table, $urlGenerator);

        $this->repository = $walletTransactionsRepository;
    }

    /**
     * {@inheritDoc}
     */
    public function ajax()
    {
        $data = $this->table
            ->eloquent($this->query())
            ->editColumn('checkbox', function ($item) {
                return $this->getCheckbox($item->id);
            })
            ->editColumn('uuid', function ($item) {
                return $item->uuid;
            })
            ->editColumn('type', function ($item) {
                return ucfirst($item->type);
            })
            ->editColumn('amount', function ($item) {
                return format_price($item->amount);
            })
            ->editColumn('payable_id', function ($item) {
                return $item->customer->name;
            })
            ->editColumn('created_at', function ($item) {
                return BaseHelper::formatDate($item->created_at);
            });

        $data = $data
            ->addColumn('operations', function ($item) {
                return [];
            });

        return $this->toJson($data);
    }

    /**
     * {@inheritDoc}
     */
    public function query()
    {
        $query = $this->repository->getModel()
            ->select([
                'id',
                'payable_type',
                'payable_id',
                'wallet_id',
                'type',
                'amount',
                'confirmed',
                'uuid',
                'created_at',
            ])
            ->with(['customer'])
            ->where('confirmed', 1);

        return $this->applyScopes($query);
    }

    /**
     * {@inheritDoc}
     */
    public function columns()
    {
        $columns = [
            'uuid'      => [
                'title' => trans('plugins/ecommerce::wallet.transaction_id'),
                'width' => '20px',
                'class' => 'text-left',
            ],
            'type'  => [
                'title' => trans('plugins/ecommerce::wallet.type'),
                'class' => 'text-center',
            ],
            'amount'  => [
                'title' => trans('plugins/ecommerce::wallet.amount'),
                'class' => 'text-center',
            ],
            'payable_id'  => [
                'title' => trans('plugins/ecommerce::wallet.customer'),
                'class' => 'text-center',
            ],
            'created_at' => [
                'title' => trans('plugins/ecommerce::wallet.date'),
                'class' => 'text-left',
            ],
        ];

        return $columns;
    }


    /**
     * {@inheritDoc}
     */
    public function renderTable($data = [], $mergeData = [])
    {
        if ($this->query()->count() === 0 &&
            !$this->request()->wantsJson() &&
            $this->request()->input('filter_table_id') !== $this->getOption('id')
        ) {
            return view('plugins/ecommerce::wallet.intro');
        }
        
        return parent::renderTable($data, $mergeData);
    }

    /**
     * {@inheritDoc}
     */
    public function getDefaultButtons(): array
    {
        return [
            'export',
            'reload',
        ];
    }
}
