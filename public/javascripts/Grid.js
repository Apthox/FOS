try {
    var Chunk = require('./Chunk.js');
    var Farm = require('./Farm.js');
} catch (e) {console.log("Something fucked up!");}


// Long N & S
// Lat Left & Right

// the Object Grid
// is passing all

function Grid(pins, density) {
    var H_Lat = -91;
    var L_Lat = 91;
    var H_Long = -181;
    var L_Long = 181;

    pins.forEach(function(pin){
        if (pin.Latitude > H_Lat && pin.Latitude !== null) {
            H_Lat = pin.Latitude;
        }

        if (pin.Latitude < L_Lat && pin.Latitude !== null){
            L_Lat = pin.Latitude;
        }

        if (pin.Longitude > H_Long && pin.Longitude !== null){
            H_Long = pin.Longitude;
        }

        if (pin.Longitude < L_Long && pin.Longitude !== null) {
            L_Long = pin.Longitude;
        }

    });

    var lat_extend = (H_Lat - L_Lat) * .025;
    var long_extend = (H_Long - L_Long) * .025;

    H_Lat = H_Lat + lat_extend;
    L_Lat = L_Lat - lat_extend;
    H_Long = H_Long + long_extend;
    L_Long = L_Long - long_extend;

    console.log("HLat: " + String(H_Lat) + " \ LLat: " + String(L_Lat));
    console.log("HLong: " + String(H_Long) + " \ LLong: " + String(L_Long));

    var chunkCollection = [];

    for (var a = 0; a <= density; a++) {
        chunkCollection.push(new Array(density));
    }

// solve for distance

    var recHeight = (H_Lat - L_Lat) / density;
    var recWidth = (H_Long - L_Long) / density;
// the distance from point 10 and point 4 is
// Density is how many rectangles will be on screen.


    for (var x = 0; x < density; x++) {
        for (var y = 0; y < density; y++) {
            // Creates the boundary, lowest point with lowest corner
            // to create a side of the cube.
            // merge the google maps.

            chunkCollection[x][y] = new Chunk(x, y,
                recWidth, recHeight, L_Lat, L_Long);
        }
    }

    pins.forEach(function (p) {
        var lat_index = (p.Latitude - L_Lat) / recHeight;
        var long_index = (p.Longitude - L_Long) / recWidth;

        lat_index = parseInt(lat_index);
        long_index = parseInt(long_index);

        try {
            chunkCollection[long_index][lat_index].addPin(p);
        } catch (e) {
            console.log("P| lat:" + p.Latitude + " long:" + p.Longitude);
            console.log("P| latI:" + lat_index + " longI:" + long_index);
            console.error("Data is not possible! Something fucked up");
        }

    });

    this.getChunk = function (x, y) {
        try {
            return chunkCollection[x][y];
        } catch (e) {
            console.log("Out of bounds!");
        }
    };

    this.getFarms = function () {
        var farms = [];
        for (var x = 0; x < density; x++) {
            for (var y = 0; y < density; y++) {
                var chunk = chunkCollection[x][y];
                if (chunk !== null && !chunk.isEmpty()){
                    var farm = new Farm(chunk.getSurrounding(this, null));
                    farm.chunks.forEach(function(chunk){
                        chunkCollection[chunk.x][chunk.y] = new Chunk();
                    });
                    farms.push(farm);
                }
            }
        }
        return farms;
    };
}

try {
    module.exports = Grid;
} catch (e) {
    /* nothing */
}
