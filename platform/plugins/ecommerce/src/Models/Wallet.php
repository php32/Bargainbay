<?php

namespace Botble\Ecommerce\Models;

use Botble\Base\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Wallet extends BaseModel
{

    /**
     * @var string
     */
    protected $table = 'wallets';


    /**
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
    ];

    /**
     * @return HasOne
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'holder_id', 'id');
    }
}
