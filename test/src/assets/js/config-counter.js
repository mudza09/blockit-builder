/* --------------------------------------------------------------------------
 * File        : config-counter.js
 * Author      : indonez
 * Author URI  : http://www.indonez.com
 *
 * Indonez Copyright 2020 All Rights Reserved.
 * -------------------------------------------------------------------------- 
 * javascript handle initialization
    1. Counter 1
    2. Counter 2
    3. Counter 3
    4. Counter 4
    5. Counter 5
    6. Counter 6
    7. Counter 7
 * -------------------------------------------------------------------------- */

'use strict';

const themeApp = {
    //---------- 1. Counter 1 -----------
    config_counter1: function() {
        new CounterUp({
            selector: '.count-1',
            start: 0,
            duration: 3200,
            intvalues: true,
            interval: 50
        }).start()
    },
    //---------- 2. Counter 2 -----------
    config_counter2: function() {
        new CounterUp({
            selector: '.count-2',
            start: 0,
            duration: 3200,
            intvalues: true,
            interval: 50
        }).start()
    },
    //---------- 3. Counter 3 -----------
    config_counter3: function() {
        new CounterUp({
            selector: '.count-3',
            start: 0,
            duration: 3200,
            intvalues: true,
            interval: 50
        }).start()
    },
    //---------- 4. Counter 4 -----------
    config_counter4: function() {
        new CounterUp({
            selector: '.count-4',
            start: 0,
            duration: 3200,
            intvalues: true,
            interval: 50
        }).start()
    },
    //---------- 5. Counter 5 -----------
    config_counter5: function() {
        new CounterUp({
            selector: '.count-5',
            start: 0,
            duration: 3200,
            intvalues: true,
            interval: 50
        }).start()
    },
    //---------- 6. Counter 6 -----------
    config_counter6: function() {
        new CounterUp({
            selector: '.count-6',
            start: 0,
            duration: 3200,
            intvalues: true,
            interval: 50
        }).start()
    },
    //---------- 7. Counter 7 -----------
    config_counter7: function() {
        new CounterUp({
            selector: '.count-7',
            start: 0,
            duration: 3200,
            intvalues: true,
            interval: 50
        }).start()
    },
    config_init: function() {
        themeApp.config_counter1();
        themeApp.config_counter2();
        themeApp.config_counter3();
        themeApp.config_counter4();
        themeApp.config_counter5();
        themeApp.config_counter6();
        themeApp.config_counter7();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    themeApp.config_init();
});