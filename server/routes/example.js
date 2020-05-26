export default function(server) {
  server.route({
    path: '/api/deep_intel/example',
    method: 'GET',
    handler() {
      return { time: new Date().toISOString() };
    },
  });
}
