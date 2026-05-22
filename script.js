let username = "";
let login_status = false;
let count = 0;
let server = "https://friday99nn.pythonanywhere.com/butterfly";

function change_theme(target) {
    let color = target.style.backgroundColor;
    document.documentElement.style.setProperty(
        "--root-color",
        color
    );

    localStorage.setItem("root-color", color)
    document.documentElement.style.setProperty(
        "--light-color",
        color.replace("rgb", "rgba").replace(")", ", 0.23)")
    );

    localStorage.setItem("light-color", color.replace("rgb", "rgba").replace(")", ", 0.23)"))
}

function clear_input() {
    let file = document.querySelector("#file input");
    let message = document.querySelector("#message");
    message.value = "";
    file.value = "";
    let preview = document.querySelector(".preview");
    preview.style.display = "none";
}

function preview() {
    let file = document.querySelector("#file input");
    let preview = document.querySelector(".preview");
    preview.innerHTML = "<button>×</button>";
    preview.style.display = "inline-block";
    let media = file.files[0];
    if (!media) return;
    let fileURL = URL.createObjectURL(media);

    if (media.type.startsWith("image/")) {
        let img = document.createElement("img");
        img.src = fileURL;
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";
        preview.appendChild(img);
    }
    else if (media.type.startsWith("video/")) {
        let video = document.createElement("video");
        video.src = fileURL;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = "100%";
        video.style.borderRadius = "8px";
        preview.appendChild(video);
    }
    else {
        preview.innerHTML = `<h6>Unsupported file type</h6>`;
    }

    preview.querySelector("button").addEventListener("click", () => {
        preview.innerHTML = "<button>×</button>";
        preview.style.display = "none";
        clear_input();
    })
}

function show_settings() {
    let settings = document.querySelector(".settings_area");
    if (settings.style.display == "none") {
        settings.style.display = "inline-block";
    } else {
        settings.style.display = "none"
    }
}

function getDateTime() {

    const now = new Date();

    const months = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    let month = months[now.getMonth()];
    let day = now.getDate();
    let year = now.getFullYear();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    let ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zero
    minutes = String(minutes).padStart(2, "0");

    return `[ ${month} ${day}, ${year} ${hours}:${minutes} ${ampm} ]`;
}


function login() {
    let key = document.querySelector("#key");
    if (key.value.trim() == "") {
        key.style.border = "2px solid red";
        return
    }
    if (key.value.trim() == "3000") {
        username = "Labya💫";
        let login = document.querySelector(".login");
        login.style.display = "none";
        login_status = true;
    }

    if (key.value.trim() == "365") {
        username = "chotu patlu😎";
        let login = document.querySelector(".login");
        login.style.display = "none";
        login_status = true;
    }

    console.log("invalid key.")
    key.style.border = "2px solid red";

    document.documentElement.style.setProperty("--root-color", localStorage.getItem("root-color"));
    document.documentElement.style.setProperty("--light-color", localStorage.getItem("light-color"));
}

function load_message(message) {
    let main = document.querySelector("main");
    let div = document.createElement("div");
    let h5 = document.createElement("h5");
    h5.innerText = message.username;
    let h6 = document.createElement("h6");
    h6.innerText = message.info;

    div.appendChild(h5);
    if (message.message) {
        let p = document.createElement("p");
        p.innerText = message.message;
        div.appendChild(p);

    }
    if (message.img) {
        let img = document.createElement("img");
        img.src = message.img;
        div.appendChild(img);
    }
    if (message.video) {
        let video = document.createElement("video");
        video.src = message.video;
        video.controls = true;
        div.appendChild(video);
    }
    if (message.audio) {
        let audio = document.createElement("audio");
        audio.src = message.video;
        audio.controls = true;
        div.appendChild(audio);
    }

    div.appendChild(h6);

    if (message.username == username) {
        div.style.justifySelf = "flex-end";
        div.style.borderRadius = "8px 0 8px 8px"
    }
    main.appendChild(div);
}

function send() {
    let message = document.querySelector("#message");
    let file = document.querySelector("#file input");

    if (!message.value && !file.files[0]) {
        console.log("empty message");
        return;
    }
    console.log("sending...");

    if (message.value) {
        load_message({
            "username": username,
            "message": message.value.trim(),
            "info": getDateTime()
        })
        let data = new FormData()
        data.append("username", username);
        data.append("message", message.value.trim());
        data.append("info", getDateTime());

        send_to_server(data);

        console.log("sent.")
        clear_input();
        return
    }
    if (file.files[0]) {
        if (file.files[0].type.startsWith("image/")) {
            load_message({
                "username": username,
                "img": URL.createObjectURL(file.files[0]),
                "info": getDateTime()
            })
            let data = new FormData()
            data.append("username", username);
            data.append("img", file.files[0]);
            data.append("info", getDateTime());
            send_to_server(data);

            console.log("sent.")
            clear_input();
            return;
        }

        if (file.files[0].type.startsWith("video/")) {
            load_message({
                "username": username,
                "video": URL.createObjectURL(file.files[0]),
                "info": getDateTime()
            })
            let data = new FormData()
            data.append("username", username);
            data.append("video", file.files[0]);
            data.append("info", getDateTime());
            send_to_server(data);
            console.log("sent.")
            clear_input();
            return;
        }
    }
    console.log("sending...");
}

function send_to_server(data) {
    fetch(`${server}/save`, {
        method: "POST",
        body: data
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))

}

function sync() {
    let formData = new FormData();
    formData.append("username", username);

    fetch(`${server}/load`, {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            let chat = data.chat
            if(chat.length == count) return;
            count = 0;
            let main = document.querySelector("main")
            main.innerHTML = "";
            chat.forEach(message => {
                if(message.message){
                    load_message({
                        "username": message.username,
                        "message" : message.message,
                        "info": message.info
                    })
                    count = count + 1;
                }
                if(message.img){
                    load_message({
                        "username": message.username,
                        "img" : message.img,
                        "info": message.info
                    })
                    count = count + 1;
                }
                if(message.video){
                    load_message({
                        "username": message.username,
                        "video" : message.video,
                        "info": message.info
                    })
                    count = count + 1;
                }
            });
            console.log(count + " messages loaded.")
        })
        .catch(error => console.log(error))
}
// =======================================

setInterval(() => {
    if (login_status) {
        sync();
    }
}, 2000);















