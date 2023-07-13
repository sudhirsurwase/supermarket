import $ from 'jquery';
import Url from 'url';
import urlUtils from '../theme/common/url-utils';

let eventInitialized = false;

function removeModeClass(index, className) {
    return (className.match(/(^|\s)mode-\S+/g) || []).join(' ');
}

function initFields() {
    const $parent = $('[data-sort-by]');

    if (!$parent.length) {
        return;
    }

    const $limit = $parent.find('[name=limit]');
    const $mode = $parent.find('input[name=mode]');
    const url = Url.parse(location.href, true);

    if (url.query.limit) {
        $limit.val(url.query.limit);
    }

    if (url.query.mode) {
        $mode.prop('checked', false)
            .filter(`[value=${url.query.mode}]`).prop('checked', true);
    }

    $('#product-listing-container')
        .removeClass(removeModeClass)
        .addClass(`mode-${$mode.filter(':checked').val()}`);
}

/**
 * Init events/hooks when page is loaded
 */
function initEvents() {
    //
    // When Grid/List icon is clicked
    //
    $('body').on('change', '[data-sort-by] input[name=mode]', (event) => {
        event.preventDefault();

        const mode = $(event.currentTarget).val();

        $('#product-listing-container')
            .removeClass(removeModeClass)
            .addClass(`mode-${mode}`);

        const url = Url.parse(location.href, true);
        url.query.mode = mode;
        window.history.pushState({}, document.title, Url.format({ pathname: url.pathname, search: urlUtils.buildQueryString(url.query) }));
    });
}

/**
 * Call this function when:
 * - Page is loaded
 * - Ajax page returned
 */
export default function actionBarFactory() {
    initFields();

    if (!eventInitialized) {
        initEvents();
        eventInitialized = true;
    }
}

