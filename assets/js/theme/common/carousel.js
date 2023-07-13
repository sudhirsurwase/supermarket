import $ from 'jquery';
import 'slick-carousel';
import youtubeCarouselFactory from '../../emthemes-modez/youtube-carousel';

export default function () {
    const $carousel = $('[data-slick]');

    if ($carousel.length) {
        youtubeCarouselFactory($carousel);
        $carousel.slick();
    }
}
