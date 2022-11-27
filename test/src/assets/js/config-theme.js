/* --------------------------------------------------------------------------
 * File        : config-theme.js
 * Author      : indonez
 * Author URI  : http://www.indonez.com
 *
 * Indonez Copyright 2020 All Rights Reserved.
 * -------------------------------------------------------------------------- 
 * javascript handle initialization
    1. Slideshow
    2. Counter
    3. Mobile nav button
    4. Isotope filter
 * -------------------------------------------------------------------------- */

    'use strict';

    const HomepageApp = {
        //----------- 1. Slideshow -----------
        theme_slideshow: function() {
            new CarouselConfig({
                fadeTransition: true,    
                darkMode: false,
                interval: 6000,
                control: {
                    hide: false,
                    onHover: false
                },
                indicators: {
                    hide: false,
                    onHover: false
                },
                height: {
                    desktop: '460px',
                    tablet: '380px',
                    phone: '320px'
                }
            }).init();
        },
        //---------- 2. Counter -----------
        theme_counter: function() {
            new CounterUp({
                selector: '.count',
                start: 0,
                duration: 3200,
                intvalues: true,
                interval: 50
            }).start()
        },
        //---------- 3. Mobile nav button -----------
        theme_mobilenav: function() {
            new MobileNavbar({
                addonButtons: true,                 // options to use addon buttons, set it "false" if you won't use addon buttons
                buttons: [
                    {
                        name: 'Login',              // button name
                        url: '/signin.html',        // button url
                        type: 'primary',            // button type (default, primary, secondary, danger, text)
                        icon: 'sign-in-alt'         // button icon, you can use all icons from here : https://fontawesome.com/icons?d=gallery&s=solid&m=free
                    },
                ]
            }).init();
        },
        //---------- 5. Isotope filter -----------
        theme_isotope: function() {
            const isoWrapper = document.querySelectorAll('.isotope-wrapper')
            const isoFilter = document.querySelectorAll('.isotope-filter')

            isoWrapper.forEach((elem, index) => {
                const isotope = new Isotope(elem, {
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                })
                isoFilter[index].addEventListener('click', e => {
                    isotope.arrange({ filter: e.target.getAttribute('data-filter') })
                })
            });
        },
        theme_init: function() {
            HomepageApp.theme_slideshow();
            HomepageApp.theme_counter();
            HomepageApp.theme_mobilenav();
            HomepageApp.theme_isotope();
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        HomepageApp.theme_init();
    });