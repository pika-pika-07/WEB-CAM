console.log("Gallery");
setTimeout(() => {
  if (db) {
    //videos retreival
    //imasges retreival

    let videodbTransaction = db.transaction("video", "readonly");
    let videoStore = videodbTransaction.objectStore("video");

    let videoRequest = videoStore.getAll(); // Event Driven
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;
      let galleryContainer = document.querySelector(".gallery-container");

      videoResult.forEach((videoObj) => {
        let mediaElement = document.createElement("div");
        mediaElement.setAttribute("class", "media-container");
        mediaElement.setAttribute("id", videoObj.id);

        let url = URL.createObjectURL(videoObj.blobData);

        mediaElement.innerHTML = `
          <div class="media">
          <video src="${url}" autoplay loop ></video>
      </div>
      <div class="download action-btn">Download</div>
      <div class="delete action-btn">Delete</div>
          `;
        galleryContainer.appendChild(mediaElement);
        let deleteBtn = mediaElement.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        let downloadBtn = mediaElement.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };

    // Image retreival
    let imagedbTransaction = db.transaction("image", "readonly");
    let imageStore = imagedbTransaction.objectStore("image");

    let imageRequest = imageStore.getAll(); // Event Driven
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;
      let galleryContainer = document.querySelector(".gallery-container");

      imageResult.forEach((imageObj) => {
        let mediaElement = document.createElement("div");
        mediaElement.setAttribute("class", "media-container");
        mediaElement.setAttribute("id", imageObj.id);

        let url = imageObj.url;

        mediaElement.innerHTML = `
          <div class="media">
          <img src="${url}"  />
      </div>
      <div class="download action-btn">Download</div>
      <div class="delete action-btn">Delete</div>
          `;

        galleryContainer.appendChild(mediaElement);

        //Listeners
        let deleteBtn = mediaElement.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        let downloadBtn = mediaElement.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };
  }
}, 400);

// UI removal and  DB removal
function deleteListener(e) {
  // DB removal
  let id = e.target.parentElement.getAttribute("id");

  if (id.slice(0, 3) == "vid") {
    let videodbTransaction = db.transaction("video", "readwrite");
    let videoStore = videodbTransaction.objectStore("video");
    videoStore.delete(id);
  } else if (id.slice(0, 3) === "img") {
    let imagedbTransaction = db.transaction("image", "readwrite");
    let imageStore = imagedbTransaction.objectStore("image");
    imageStore.delete(id);
  }

  //UI removal

  e.target.parentElement.remove();
}

function downloadListener(e) {}
