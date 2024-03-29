try {
    var express = require('express');
    var fs = require('fs');
} catch (e) { /* nothing */
}
// Long1 and Long2 N&S
// latitudeLeft Right

// Lat = y coordinates points
// Long = x coordinates points

function Chunk(x, y, width, height, b_lat, b_long) {
// create the array
    this.pins = [];
    this.pinCount = 0;

    this.x = x;
    this.y = y;

    var Lat1 = (height * y) + b_lat;
    var Long1 = (width * x) + b_long;

    var Lat2 = (height * (y + 1)) + b_lat;
    var Long2 = (width * (x + 1)) + b_long;

//  array addPoint  pin == variable
    this.addPin = function (pin) {

        this.pins.push(pin);
        this.pinCount += 1;
    };

    this.select = function(map){

        var color = '#270dc7';

        var Boundary = new google.maps.Polygon({
            paths: [
                new google.maps.LatLng(Lat1, Long1),
                new google.maps.LatLng(Lat1, Long2),
                new google.maps.LatLng(Lat2, Long2),
                new google.maps.LatLng(Lat2, Long1)
            ],
            fillColor: color,
            fillOpacity: 100
        });

        Boundary.setMap(map);

    };

    this.draw = function (map) {
        // console.log("Trying to draw a fucken box you son of a bitch client ass nigga");

        var color = '#feffff';
        if (this.pinCount >= 4) {
            color = '#C70039';
            // console.log("Is green");
        } else if (this.pinCount == 3) {
            color = '#FF5733';
            // console.log("Is not green");
        } else if (this.pinCount == 2) {
            color = '#FFC300';
            // console.log("Is not green");
        } else if (this.pinCount == 1) {
            color = '#49ff46';
            // console.log("Is not green");
        }

        // console.log("Lat1: " + Lat1 + " Long1: " + Long1);
        // console.log("Lat2:" + Lat2 + " Long2: " + Long2);

        var Boundary = new google.maps.Polygon({
            paths: [
                new google.maps.LatLng(Lat1, Long1),
                new google.maps.LatLng(Lat1, Long2),
                new google.maps.LatLng(Lat2, Long2),
                new google.maps.LatLng(Lat2, Long1)
            ],
            fillColor: color
        });

        Boundary.setMap(map);

        var that = this;

        google.maps.event.addDomListener(Boundary, 'click', function (e) {
            console.log('<=== Chunk ' + x + '-' + y + ' ===>');
            that.pins.forEach(function(pin){
                console.log(pin.toString());
            });
            console.log('<======>');
        });

    };

    // every chunk now has an assigned number. Get pins by the #

    this.isEmpty = function () {
        return this.pins.length < 1;
    };

    this.isEdge = function(grid, x_max, y_max){
        if (this.isEmpty())
            return false;

        var order = [[-1, 1], [0, 1], [1, 1], [1, 0],
            [1, -1], [0, -1], [-1, -1], [-1, 0]];

        for (var i = 0; i < order.length; i++){
            var nx = this.x + order[i][0];
            var ny = this.y + order[i][1];

            if ((nx < 0 || nx > x_max-1) || (ny < 0 || ny > y_max-1)){
                return true;
            } else {
                console.log(nx + ' ' + ny);
                var chunk = grid.getChunk(nx, ny);
                if (chunk.isEmpty()){
                    return true
                }
            }
        }
        return false;
    };

    this.getSurrounding = function (grid, chunks) {
        if (chunks === null) {
            chunks = []
        }

        var chunksContains = function (arr, chunk) {
            var arrayLength = arr.length;
            for (var i = 0; i < arrayLength; i++) {
                if (arr[i].x == chunk.x && arr[i].y == chunk.y) {
                    return true;
                }
            }
            return false;
        };


        var order = [[-1, 1], [0, 1], [1, 1], [1, 0],
            [1, -1], [0, -1], [-1, -1], [-1, 0]];

        chunks.push(this);

        order.forEach(function (pd) {
            var neighbor = grid.getChunk(x + pd[0], y + pd[1]);
            if (neighbor !== undefined && !neighbor.isEmpty()
                && !chunksContains(chunks, neighbor)) {
                neighbor.getSurrounding(grid, chunks);
            }
        });

        return chunks;
    };

    this.convertSeconds = function(seconds){
        seconds = parseFloat(seconds);
        return [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), Math.floor(seconds % 3600 % 60),
            Math.floor((((seconds % 3600) % 60) / 10))];
    };

    this.process = function(){
        if (this.pins[0].Quality === null){
            console.warn('Chunk could not be processed because of improper data!');
            return;
        }

        var sorted = [];

        for (var i = 0; i < this.pins.length; i++) {
            var qs = parseFloat(this.pins[i].Quality);
            var date = this.pins[i].TimeStamp.split(" ")[0];
            var year = parseInt(date.split('-')[0]);
            var month = parseInt(date.split('-')[1]);
            var day = parseInt(date.split('-')[2]);

            var time = parseFloat(this.pins[i].TimeStamp.split(" ")[1]);

            var results = this.convertSeconds(time);
            var d = new Date(year, month, day, results[0], results[1], results[2]);
            this.pins[i].setDate(d);

            var index = this.pins[i].Date.getTime() / 1000;

            if (sorted.length === 0){
                sorted.push(this.pins[i]);
            }

            for (var 2)

        }
    }

}

try {
    module.exports = Chunk;
} catch (e) { /* nothing */
}

