<?php

namespace Botble\Ecommerce\Repositories\Caches;

use Botble\Ecommerce\Repositories\Interfaces\WalletTransactionsInterface;
use Botble\Support\Repositories\Caches\CacheAbstractDecorator;

class WalletTransactionsCacheDecorator extends CacheAbstractDecorator implements WalletTransactionsInterface
{
}
