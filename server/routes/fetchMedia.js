const mongodb = require('mongodb');
const fs = require('fs');



export default function (server) {
    server.route({
        path: '/api/deep_intel/fetchMedia',
        method: 'POST',
        handler(req, resp) {

            const url = "mongodb://localhost";
            const dbName = 'testdb';
            const client = new mongodb.MongoClient(url, { useUnifiedTopology: true });
            console.log("Connected to MongoDB...");
            const db = client.db("testdb");
            const bucket = new mongodb.GridFSBucket(db, { bucketName: "DeepIntel" });

            bucket
                .openDownloadStreamByName('Video1.mp4')
                .pipe(fs.createWriteStream('./downloads/video1.mp4'))
                .on("error", () => {
                    console.log("error downloading");
                    client.close();
                })
                .on("finish", (r) => {
                    console.log("End");
                    console.log(r);
                    client.close();
                })


            console.log(req.payload);


            return {
                //req, resp
            };
        },
    });
}
