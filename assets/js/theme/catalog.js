import PageManager from '../page-manager';
import $ from 'jquery';
import urlUtils from './common/url-utils';
import Url from 'url';

export default class CatalogPage extends PageManager {
    onSortBySubmit(event) {
        const url = Url.parse(location.href, true);
        /* MOD by papathemes - supermarket
        ---
        const queryParams = $(event.currentTarget).serialize().split('=');

        url.query[queryParams[0]] = queryParams[1];
        ---
        */
        const queryParams = $(event.currentTarget).serializeArray();
        queryParams.forEach(param => {
            url.query[param.name] = param.value;
        });
        /* END MOD */
        delete url.query.page;

        event.preventDefault();
        window.location = Url.format({ pathname: url.pathname, search: urlUtils.buildQueryString(url.query) });
    }
}
