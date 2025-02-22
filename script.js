document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("signin-form");
    const uploadForm = document.getElementById("upload-form");
    const videoList = document.getElementById("video-list");
    const signinSection = document.getElementById("signin-section");
    const signinBtn = document.getElementById("signin-btn");

    // Load user account from local storage
    let user = JSON.parse(localStorage.getItem("user")) || null;
    updateUI();

    // Handle sign-in
    signinForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username && password) {
            user = { username };
            localStorage.setItem("user", JSON.stringify(user));
            updateUI();
        }
    });

    // Handle sign-out
    signinBtn.addEventListener("click", () => {
        if (user) {
            localStorage.removeItem("user");
            user = null;
            updateUI();
        }
    });

    // Handle video upload
    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!user) {
            alert("Sign in to upload videos!");
            return;
        }

        const title = document.getElementById("video-title").value;
        const file = document.getElementById("video-file").files[0];
        const thumbnail = document.getElementById("thumbnail-file").files[0];

        if (title && file && thumbnail) {
            const videoURL = URL.createObjectURL(file);
            const thumbURL = URL.createObjectURL(thumbnail);
            saveVideo(title, videoURL, thumbURL);
        }
    });

    function saveVideo(title, videoURL, thumbURL) {
        let videos = JSON.parse(localStorage.getItem("videos")) || [];
        videos.push({ title, videoURL, thumbURL });
        localStorage.setItem("videos", JSON.stringify(videos));
        renderVideos();
    }

    function renderVideos() {
        videoList.innerHTML = "";
        const videos = JSON.parse(localStorage.getItem("videos")) || [];
        videos.forEach((video) => {
            const videoCard = document.createElement("div");
            videoCard.classList.add("video-card");
            videoCard.innerHTML = `
                <img src="${video.thumbURL}" alt="Thumbnail">
                <h3>${video.title}</h3>
                <video controls src="${video.videoURL}"></video>
            `;
            videoList.appendChild(videoCard);
        });
    }

    function updateUI() {
        if (user) {
            signinSection.style.display = "none";
            signinBtn.textContent = `Sign Out (${user.username})`;
        } else {
            signinSection.style.display = "block";
            signinBtn.textContent = "Sign In";
        }
        renderVideos();
    }
});
