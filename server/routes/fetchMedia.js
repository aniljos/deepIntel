const mongodb = require('mongodb');
const fs = require('fs');



export default function (server) {
    server.route({
        path: '/api/deep_intel/fetchMedia',
        method: 'POST',
        handler(req, resp) {
            
            return {message: "done"}
        },
    });
}
