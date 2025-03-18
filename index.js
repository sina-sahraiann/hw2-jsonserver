const jsonServer = require("json-server"); // importing json-server library
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Create a fetch event handler for Cloudflare Workers
addEventListener('fetch', event => {
   event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
   // Set up server middleware
   server.use(middlewares);
   server.use(router);

   // Convert the incoming request to a Node.js style request
   const nodeRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body
   });

   // Process the request through json-server
   return await new Promise((resolve) => {
      server.callback()(nodeRequest, {
         setHeader: () => { },
         end: (body) => {
            resolve(new Response(body, {
               headers: { 'Content-Type': 'application/json' }
            })) ;
         }
      });
   });
}

