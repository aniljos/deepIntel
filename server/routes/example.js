export default function(server) {
  server.route({
    path: '/api/deep_intel/fetch',
    method: 'POST',
    handler: async (req, resp)=> {

      //console.log(server);
      const fileName = req.payload.fileName;


      return { time: new Date().toISOString(), fileName };
    },
  });

  server.route({
    path: '/api/deep_intel/fetchPhoto',
    method: 'POST',
    handler: async (req, resp)=> {

      //console.log(server);
      const fileName = req.payload.fileName;


      return { type: "photo", fileName };
    },
  });
}
