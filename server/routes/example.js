const mongodb = require('mongodb');
const Boom = require('boom');
const fs = require('fs');
const MemoryStream = require('memorystream');


const mongoClient = mongodb.MongoClient;
const mongoUrl = "mongodb://localhost";
const mongodbName = 'testdb';
const bucketName = "DeepIntel"


export default function (server) {

  server.route({
    path: '/api/deep_intel/fetch',
    method: 'POST',
    handler: async (req, resp) => {

      //console.log(server);
      const fileName = req.payload.fileName;


      return { time: new Date().toISOString(), fileName };
    },
  });

  server.route({
    path: '/api/deep_intel/fetchPhoto',
    method: 'POST',
    handler: async (req, resp) => {

      //console.log(server);
      const fileName = req.payload.fileName;


      return { type: "photo", fileName };
    },
  });


  server.route({
    path: '/api/deep_intel/fetchDocument',
    method: 'POST',
    handler: async (request, h) => {

      return new Promise(async (resolve, reject) => {

        const fileName = request.payload.fileName;
        console.log(`Fetching ${fileName}`);
        const client = await mongoClient.connect(mongoUrl, { useUnifiedTopology: true });
        await client.connect();
        const db = await client.db(mongodbName);
        const bucket = new mongodb.GridFSBucket(db, { bucketName: bucketName });
        const count = await bucket.find({ filename: fileName }).count();
        console.log(`Count: ${count}`)
        let image;
        if (count !== 1) {
          console.log("Not found");
          resolve(Boom.notFound());
        }
        else {
          console.log("Downloading...")
          const tempStream = new MemoryStream();
          bucket
            .openDownloadStreamByName(fileName)
            .pipe(tempStream)
            .on("error", () => {
              console.log("Error downloading");
              client.close();
              

              resolve(Boom.internal());
            })
            .on("finish", () => {
              console.log("Finished downloading")
              client.close();
              const mimeType = request.headers['accept'] || 'application/octet-stream';
              const resp = h.response(tempStream).type(mimeType);
              resolve(resp);
            });

        }
      })
    },
  });

  server.route({
    method: 'POST',
    path: '/api/deep_intel/fetchVideo',
    handler: async (request, h) => {

        
        return new Promise(async (resolve, reject) => {

            const fileName = request.payload.fileName;
            console.log(`Fetching ${fileName}`);
            const client = await mongoClient.connect(mongoUrl, { useUnifiedTopology: true });
            await client.connect();
            const db = await client.db(mongodbName);
            const bucket = new mongodb.GridFSBucket(db, { bucketName: bucketName });
            const count = await bucket.find({ filename: fileName }).count();
            console.log(`Count: ${count}`)
            let image;
            if (count !== 1) {
                console.log("Not found");
                resolve(Boom.notFound());
            }
            else {
                console.log("Downloading...")
                const tempStream = new MemoryStream();
                bucket
                    .openDownloadStreamByName(fileName)
                    //.pipe(fs.createWriteStream("../tempFiles/" + fileName))
                    .pipe(tempStream)
                    .on("error", () => {
                        //console.log("Error downloading");
                        client.close();
                        resolve(Boom.internal());
                    })
                    .on("finish", () => {
                        console.log("Finished downloading")
                        client.close();
                        tempStream.pipe(fs.createWriteStream(__dirname + "/" + fileName));
                        const resp = h.response({filePath: __dirname + "/" + fileName}).type("application/json");
                        resolve(resp);
                    });

            }
        })
    }
});
}
