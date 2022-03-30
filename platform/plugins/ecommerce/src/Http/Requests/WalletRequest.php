<?php

namespace Botble\Ecommerce\Http\Requests;

use App\Rules\ValidAmount;
use Botble\Support\Http\Requests\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class WalletRequest extends Request
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'wallet_money' => ['required', new ValidAmount],
        ];
    }

    public function messages()
    {
        return [
            'wallet_money.required' => 'Please enter amount',
        ];
    }
}
