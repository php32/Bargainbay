<?php

namespace Botble\Ecommerce\Models;

use Botble\Base\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Transactions extends BaseModel
{

    /**
     * @var string
     */
    protected $table = 'transactions';

    protected $fillable = [
        'payable_type',
        'payable_id',
        'wallet_id',
        'type',
        'amount',
        'confirmed',
        'uuid',
    ];

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
        return $this->belongsTo(Customer::class, 'payable_id', 'id');
    }
}
