<?php

namespace Database\Seeders;

use Botble\Base\Supports\BaseSeeder;
use Botble\Blog\Models\Post;
use Botble\Ecommerce\Models\Product;
use Botble\Ecommerce\Models\ProductCategory;
use Botble\Language\Models\LanguageMeta;
use Botble\Menu\Models\Menu as MenuModel;
use Botble\Menu\Models\MenuLocation;
use Botble\Menu\Models\MenuNode;
use Botble\Page\Models\Page;
use Illuminate\Support\Arr;
use Menu;

class MenuSeeder extends BaseSeeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            'en_US' => [
                [
                    'name'     => 'Main menu',
                    'slug'     => 'main-menu',
                    'location' => 'main-menu',
                    'items'    => [
                        [
                            'title' => 'Home',
                            'url'   => '/',
                        ],
                        [
                            'title'    => 'Shop',
                            'url'      => '/products',
                        ],
                        [
                            'title'          => 'Blog',
                            'reference_id'   => 5,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Contact',
                            'reference_id'   => 6,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'FAQs',
                            'reference_id'   => 7,
                            'reference_type' => Page::class,
                        ],
                    ],
                ],
                [
                    'name'  => 'Product categories',
                    'slug'  => 'product-categories',
                    'items' => [
                        [
                            'title'          => 'Men',
                            'reference_id'   => 1,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Women',
                            'reference_id'   => 2,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Accessories',
                            'reference_id'   => 3,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Shoes',
                            'reference_id'   => 4,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Denim',
                            'reference_id'   => 5,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Dress',
                            'reference_id'   => 6,
                            'reference_type' => ProductCategory::class,
                        ],
                    ],
                ],
                [
                    'name'  => 'Information',
                    'slug'  => 'information',
                    'items' => [
                        [
                            'title'          => 'Contact Us',
                            'reference_id'   => 6,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'About Us',
                            'reference_id'   => 8,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Terms & Conditions',
                            'reference_id'   => 9,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Returns & Exchanges',
                            'reference_id'   => 10,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Shipping & Delivery',
                            'reference_id'   => 11,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Privacy Policy',
                            'reference_id'   => 12,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'FAQs',
                            'reference_id'   => 7,
                            'reference_type' => Page::class,
                        ],
                    ],
                ],
            ],
            'vi'    => [
                [
                    'name'     => 'Menu chính',
                    'slug'     => 'menu-chinh',
                    'location' => 'main-menu',
                    'items'    => [
                        [
                            'title' => 'Trang chủ',
                            'url'   => '/',
                        ],
                        [
                            'title'    => 'Bán hàng',
                            'url'      => '/products',
                        ],
                        [
                            'title'          => 'Tin tức',
                            'reference_id'   => 5,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Liên hệ',
                            'reference_id'   => 6,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Câu hỏi thường gặp',
                            'reference_id'   => 7,
                            'reference_type' => Page::class,
                        ],
                    ],
                ],
                [
                    'name'  => 'Product categories',
                    'slug'  => 'danh-muc-san-pham',
                    'items' => [
                        [
                            'title'          => 'Dành cho nam',
                            'reference_id'   => 1,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Dành cho nữ',
                            'reference_id'   => 2,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Phụ kiện',
                            'reference_id'   => 3,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Giày dép',
                            'reference_id'   => 4,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Denim',
                            'reference_id'   => 5,
                            'reference_type' => ProductCategory::class,
                        ],
                        [
                            'title'          => 'Quần áo',
                            'reference_id'   => 6,
                            'reference_type' => ProductCategory::class,
                        ],
                    ],
                ],
                [
                    'name'  => 'Information',
                    'slug'  => 'thong-tin',
                    'items' => [
                        [
                            'title'          => 'Liên hệ',
                            'reference_id'   => 6,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Về chúng tôi',
                            'reference_id'   => 8,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Điều khoản & quy định',
                            'reference_id'   => 9,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Chính sách đổi trả',
                            'reference_id'   => 10,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Chính sách vận chuyển',
                            'reference_id'   => 11,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'Chính sách bảo mật',
                            'reference_id'   => 12,
                            'reference_type' => Page::class,
                        ],
                        [
                            'title'          => 'FAQs',
                            'reference_id'   => 7,
                            'reference_type' => Page::class,
                        ],
                    ],
                ],
            ],
        ];

        MenuModel::truncate();
        MenuLocation::truncate();
        MenuNode::truncate();
        LanguageMeta::where('reference_type', MenuModel::class)->delete();
        LanguageMeta::where('reference_type', MenuLocation::class)->delete();

        foreach ($data as $locale => $menus) {
            foreach ($menus as $index => $item) {
                $menu = MenuModel::create(Arr::except($item, ['items', 'location']));

                if (isset($item['location'])) {
                    $menuLocation = MenuLocation::create([
                        'menu_id'  => $menu->id,
                        'location' => $item['location'],
                    ]);

                    $originValue = LanguageMeta::where([
                        'reference_id'   => $locale == 'en_US' ? $menu->id : $menu->id + 3,
                        'reference_type' => MenuLocation::class,
                    ])->value('lang_meta_origin');

                    LanguageMeta::saveMetaData($menuLocation, $locale, $originValue);
                }

                foreach ($item['items'] as $menuNode) {
                    $this->createMenuNode($index, $menuNode, $locale, $menu->id);
                }

                $originValue = null;

                if ($locale !== 'en_US') {
                    $originValue = LanguageMeta::where([
                        'reference_id'   => $index + 1,
                        'reference_type' => MenuModel::class,
                    ])->value('lang_meta_origin');
                }

                LanguageMeta::saveMetaData($menu, $locale, $originValue);
            }
        }

        Menu::clearCacheMenuItems();
    }

    /**
     * @param int $index
     * @param array $menuNode
     * @param string $locale
     * @param int $menuId
     * @param int $parentId
     */
    protected function createMenuNode(int $index, array $menuNode, string $locale, int $menuId, int $parentId = 0): void
    {
        $menuNode['menu_id'] = $menuId;
        $menuNode['parent_id'] = $parentId;

        if (Arr::has($menuNode, 'children')) {
            $children = $menuNode['children'];
            $menuNode['has_child'] = true;

            unset($menuNode['children']);
        } else {
            $children = [];
            $menuNode['has_child'] = false;
        }

        $createdNode = MenuNode::create($menuNode);

        if ($children) {
            foreach ($children as $child) {
                $this->createMenuNode($index, $child, $locale, $menuId, $createdNode->id);
            }
        }
    }
}
