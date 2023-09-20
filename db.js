// Create and open Database
// Step 2 -> Create Object store
// Object store can only be created inside upgradeneeded listener
// Market transaction
let db;
let openRequest = indexedDB.open("myDataBase");

// DB success
openRequest.addEventListener("success", (e) => {
  db = openRequest.result;
});

// DB error
openRequest.addEventListener("error", (e) => {});

// Db upgrade
openRequest.addEventListener("upgradeneeded", (e) => {
  console.log("Db upgraded and for initial db creation");
  // This will be called for the very first time even before success
  db = openRequest.result;

  // Keypath is the unique identifier
  db.createObjectStore("video", { keyPath: "id" }); // Store for videos
  db.createObjectStore("image", { keyPath: "id" }); // STore for images
});
