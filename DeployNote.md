# UQCloud Deploy

UQClould use each member's account to access the webiste. So, there are 6 users in the UQCloud, if you use your own

# Deploy Notes

##### ssh UQCloud

1. Need to connect to UQ's internet or using UQ's VPN
2. SSH to UQCloud

- If your are using terminal

  ```
  ssh sXXXXXXX@deco3801-dacce.zones.eait.uq.au (replace with your student number)
  password is your student account password as well
  ```

- If you are using FileZilla
  ```
    Host: deco3801-dacce.zones.eait.uq.au
    Username: sXXXXXXX
    Password: Your student account password
    Port: 22
  ```

##### Set up frontend

1. Modify `/Frontend_React/dacce/src/contexts/WebSocketContext.jsx` file.
   From:

   ```
   ws.current = new WebSocket("ws://localhost:8080");
   ```

   to:

   ```
   ws.current = new WebSocket("wss://deco3801-dacce.uqcloud.net/ws");
   ```

2. Modify `/Frontend_React/dacce/vite.config.js` file.
   From:

   ```
   export default defineConfig({
     plugins: [react()],
   })
   ```

   To:

   ```
   export default defineConfig({
     plugins: [react()],
     base: '/',  // Add this line
   })
   ```

3. Direct to react project directory and generate the production for frontend react project
   ```
   cd /Frontend_React/dacce
   npm run build
   ```
4. After run build, it will generate a dist folder in the project folder. (Any changes on frontend should be rebuild)
5. Copy the **assets** folder and **index.html** to the UQCloud's `/home/s4786392/www/htdocs` directory (replace your student ID)

##### Set up database

1. Use admin to get into Database
   ```
   sudo psql postgres
   ```
2. Follow `PSQL database notes.txt` to create database

##### Set up server

1. Copy entire `ServerClient` to the `/home/s4786392` (replace your student ID).

2. Modify `index1.js` file.
   ```
   const server = express().listen(8080, '0.0.0.0', () => {
       console.log('[Server] Opened connection on port 8080');
   });
   ```
   ```
   const client = new Client({
     host: "localhost",
     user: "dacce",
     password: "dacce",
     database: "postgres",
     port: 5432
   });
   ```
