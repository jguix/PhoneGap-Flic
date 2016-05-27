/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('flicButtonClick', this.onFlicButtonPressed, false);
        document.addEventListener('flicButtonDblClick', this.onFlicButtonPressed, false);
        document.addEventListener('flicButtonHold', this.onFlicButtonPressed, false);
        document.getElementById('myBtn1').addEventListener('click', this.grabButton);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        console.log('Received Event: ' + id);

        var appId = "dbcce1f9-c4b9-41c1-89fb-2f36c8577706";
        var appSecret = "f17c4448-093b-4ba8-951a-bb40113b1900";
        var appName = "Table Football";

        console.log('Starting Flic Manager');

        try {
            Flic.init(appId, appSecret, appName, {
                success: function(result) {
                    console.log('Flic init succeeded');
                    listeningElement.setAttribute('style', 'display:none;');
                    receivedElement.setAttribute('style', 'display:block;');

                    Flic.getKnownButtons({
                        success: function(buttons) {
                            console.log('Flic getKnownButtons succeeded');
                            console.log('Flic known buttons: ' + JSON.stringify(buttons));
                            for (var i = 0; i < buttons.length; i += 1) {
                                var button = buttons[i];
                                var buttonElement = document.getElementById(button.color);
                                var captionElement = document.getElementById('caption_' + button.color);
                                buttonElement.setAttribute('class', 'floating btn button_' + button.color + '_idle');
                                captionElement.innerHTML = 'IDLE';
                            }
                        },
                        error: function(message) {
                            console.log('Flic getKnownButtons failed: ' + message);
                        }
                    });

                },
                error: function(message) {
                    console.log('Flic init failed: ' + message);
                }
            });
        } catch (e) {
            console.log('Flic exception: ' + e.message);
        }

    },

    onFlicButtonPressed: function(event) {
        var buttonElement = document.getElementById(event.color);
        var captionElement = document.getElementById('caption_' + event.color);
        buttonElement.setAttribute('class', 'floating btn button_' + event.color);
        captionElement.innerHTML = event.type;

        setTimeout(function() {
            buttonElement.setAttribute('class', 'floating btn button_' + event.color + '_idle');
            captionElement.innerHTML = 'IDLE';
        }, 2000);
    },

    grabButton: function() {
        Flic.grabButton({
            success: function(button) {
                console.log('Flic grabButton succeeded');
                console.log('Flic grabbed button: ' + JSON.stringify(button));
                var buttonElement = document.getElementById(button.color);
                buttonElement.setAttribute('class', 'floating button_' + button.color + '_idle');
            },
            error: function(message) {
                console.log('Flic grabButton failed: ' + message);
            }
        });

    }
};

app.initialize();