import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import { defaultModal } from '../theme/global/modal';

/**
 * Get URL Parameter
 *
 * @param  {String} Parameter name
 * @param  {String} URL
 * @return {String} return string value or 0 if not exist
 */
function getURLParam(name, url) {
    const results = new RegExp(`[\?&]${name}=([^&#]*)`).exec(url);
    return results[1] || 0;
}

/**
 * Get cart contents
 *
 * @param {String} cartItemHash
 * @param {Function} onComplete
 */
function getCartContent(cartItemHash, onComplete) {
    const options = {
        template: 'cart/preview',
        params: {
            suggest: cartItemHash,
        },
        config: {
            cart: {
                suggestions: {
                    limit: 4,
                },
            },
        },
    };

    utils.api.cart.getContent(options, onComplete);
}

/**
 * Update cart content
 *
 * @param {String} cartItemHash
 */
function updateCartContent(modal, cartItemHash) {
    getCartContent(cartItemHash, (err, response) => {
        if (err) {
            return;
        }

        modal.updateContent(response);

        // Update cart counter
        const $body = $('body');
        const $cartQuantity = $('[data-cart-quantity]', modal.$content);
        const $cartCounter = $('.navUser-action .cart-count');
        const quantity = $cartQuantity.data('cart-quantity') || 0;

        $cartCounter.addClass('cart-count--positive');
        $body.trigger('cart-quantity-update', quantity);
    });
}

export default function () {
    const modal = defaultModal();

    $('body').on('click', '[data-emthemesmodez-cart-item-add]', (event) => {
		// Do not do AJAX if browser doesn't support FormData
        if (window.FormData === undefined) {
            return;
        }

        event.preventDefault();

        const productId = getURLParam('product_id', event.target.href);
        if (productId === 0) {
            return;
        }

        const formData = new FormData();
        formData.append('product_id', productId);

		// Add item to cart
        utils.api.cart.itemAdd(formData, (err, response) => {
            const errorMessage = err || response.data.error;

			// Guard statement
            if (errorMessage) {
				// Strip the HTML from the error message
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;

                alert(tmp.textContent || tmp.innerText);

                return;
            }

            // Open preview modal and update content
            modal.open();
            modal.open({ size: 'large' });

            updateCartContent(modal, response.data.cart_item.hash);
        });
    });
}
