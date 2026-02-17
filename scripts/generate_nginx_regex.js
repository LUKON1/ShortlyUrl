const fs = require("fs");
const path = require("path");

const routesPath = path.join(__dirname, "../shared/clientRoutes.json");
const routes = require(routesPath);

const reservedPaths = Object.values(routes).map((r) => (r.startsWith("/") ? r.slice(1) : r));

// Add system paths
reservedPaths.push("api", "assets", "favicon.ico", "robots.txt", "manifest.json");

// Escape special characters for regex if necessary (not needed for simple alphanumeric paths)
const excluded = reservedPaths.join("|");

const regex = `^/(?!(${excluded}))[a-zA-Z0-9_-]{4,30}$`;

console.log("Generated Nginx Location Block:");
console.log("---------------------------------------------------");
console.log(`
  location ~ ${regex} {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
`);
console.log("---------------------------------------------------");
