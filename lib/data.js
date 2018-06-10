// Require all the dependencies
var fs = require('fs');
var path = require('path');

// Container for module (to be exported)
var lib = {};

lib.baseDir = path.join(__dirname, '../.data/');

// Write data to a file
lib.create = function(dir, file, data, callback) {

    fs.open(lib.baseDir + dir+'/'+file+'.json', 'wx', function(err, fileDescriptor) {

        if(!err && fileDescriptor) {

            let stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor, stringData, function(err) {

                if(!err) {
                    fs.close(fileDescriptor, function(err) {

                        if(!err) {
                            callback(false);
                        }
                        else {
                            callback("error while closing new file");
                        }
                    });
                }
                else {
                    callback("error while writing to new file");
                }
            });
        }
        else {
            console.log(fileDescriptor, err);
            callback("Error while creating the file, file may already exist", err);
        }
    });
}

// read an existing file
lib.read = function(dir, file, callback) {

    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data) {

        callback(err, data);
    });
}

// update an already existing file
lib.update = function(dir, file, data, callback) {

    fs.open(lib.baseDir + dir + '/'+file +'.json', 'r+', function(err, fileDescriptor) {

        if(!err && fileDescriptor) {

            var stringData = JSON.stringify(data);

            fs.truncate(fileDescriptor, function(err) {
                if(!err) {

                    fs.writeFile(fileDescriptor, stringData, function(err) {

                        if(!err) {
                            fs.close(fileDescriptor, function(err, data) {

                                if(!err) {
                                    callback(false);
                                }
                                else {
                                    callback('error while closing the file');
                                }
                            });
                        }
                        else {
                            callback('error while writing to the file');
                        }
                    });
                }
                else {
                    callback('error while truncating the file');
                }
            });
        }   
        else {
            callback('error while opening the file');
        }
    });
}

lib.remove = function(dir, file, callback) {

    fs.unlink(lib.baseDir + dir+'/'+file+'.json', function(err) {

        if(!err) {
            callback(false);
            
        }
        else {
            callback('eror deleteing file');
        }
    });
}

// Export the module
module.exports = lib;