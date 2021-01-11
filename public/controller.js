let allPosts = [];
let myPosts = [];
let currentId;

function showInfo() {
    document.getElementById("posts-section").style.display = "none";
    document.getElementById("addButton").style.display = "none";
    document.getElementById("info").style.display = "inline-block";
}

function showPersonalPosts() {
    document.getElementById("info").style.display = "none";
    document.getElementById("posts-section").style.display = "inline-block";
    document.getElementById("addButton").style.display = "inline-block";
}

function signup() {
    let details = {
        email: document.getElementById("email-signup").value,
        password: document.getElementById("pass-signup").value,
    };
    if (details["password"] != document.getElementById("repass-signup").value) {
        alert("Password not match!");
    } else if (!document.getElementById("accept").checked) {
        alert("You should accept user agrement.");
    } else {
        let formBody = [];
        for (var property in details) {
            formBody.push(
                encodeURIComponent(property) +
                    "=" +
                    encodeURIComponent(details[property])
            );
        }
        let http = new XMLHttpRequest();
        let url = "api/signup";
        let params = formBody.join("&");
        http.open("POST", url, true);
        http.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        http.send(params);
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status != 201) {
                    alert(JSON.parse(http.responseText)["message"]);
                } else {
                    getPersonalPosts();
                    window.location.pathname = "./index.html";
                }
            }
        };
    }
}

function signin() {
    let details = {
        email: document.getElementById("email-signin").value,
        password: document.getElementById("pass-signin").value,
    };
    let formBody = [];
    for (var property in details) {
        formBody.push(
            encodeURIComponent(property) +
                "=" +
                encodeURIComponent(details[property])
        );
    }
    console.log(details);
    let http = new XMLHttpRequest();
    let url = "api/signin";
    let params = formBody.join("&");
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 201) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                getPersonalPosts();
                window.location.pathname = "./dashboard.html";
            }
        }
    };
}

function signout() {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    window.location.pathname = "./index.html";
}

function getPersonalPosts() {
    let http = new XMLHttpRequest();
    let url = "api/admin/post/crud";
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 200) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                myPosts = JSON.parse(http.responseText)["posts"];
                getThisUserPosts();
            }
        }
    };
}

function getThisUserPosts() {
    let postsPart = document.getElementById("posts-section");
    postsPart.innerHTML = "";
    for (let post of myPosts) {
        addPostOnScreen(post.title, post.content, post.id);
    }
}

function addPost() {
    let title = document.getElementById("recipient-name").value;
    let content = document.getElementById("message-text").value;
    let details = {
        title: title,
        content: content,
    };
    let formBody = [];
    for (var property in details) {
        formBody.push(
            encodeURIComponent(property) +
                "=" +
                encodeURIComponent(details[property])
        );
    }
    let http = new XMLHttpRequest();
    let url = "api/admin/post/crud";
    let params = formBody.join("&");
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 201) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                addPostOnScreen(title, content, JSON.parse(http.responseText)["id"]);
            }
        }
    };
}

function addPostOnScreen(title, content, id) {
    let postsPart = document.getElementById("posts-section");
    postsPart.innerHTML += `<div cardId="${id}" class="card">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${content}</p>
            <ion-icon onclick="updateCurrentId(this)" name="trash" type="button" data-toggle="modal" data-target="#deletePost"></ion-icon>
            <ion-icon onclick="updateCurrentId(this)" name="pencil" type="button" data-toggle="modal" data-target="#editPost"></ion-icon>
          </div>
    </div>`;
}

function addHomePost(title, content) {
    let postsPart = document.getElementById("homePostsSection");
    let mainSection = postsPart.parentNode;
    mainSection.style.marginRight = "0";
    postsPart.innerHTML += `<div class="col-sm-4" >
      <div class="card">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${content}</p>
          </div>
        </div>
    </div>`;
}

function getHomePosts() {
    let http = new XMLHttpRequest();
    let url = "api/post/";
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(null);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 200) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                allPosts = JSON.parse(http.responseText)["posts"];
                for (var post of allPosts) {
                    addHomePost(post.title, post.content);
                }
            }
        }
    };
}

function updateCurrentId(element) {
    let post = element.parentNode.parentNode;
    let posts = document.getElementById("posts-section").childNodes;
    console.log(post);
    console.log(posts);
    let i = 0;
    for (let p of posts) {
        console.log(i);
        if (post == p) {
            currentId = myPosts[i - 1].id;
            return;
        }
        i++;
    }
    console.log(currentId);
}

function editPost() {
    let http = new XMLHttpRequest();
    let url = `api/admin/post/crud/${currentId}`;
    let request = {
        title: document.getElementById("recipient-name").value,
        content: document.getElementById("message-text").value,
    };
    let formBody = [];
    for (var property in request) {
        formBody.push(
            encodeURIComponent(property) +
                "=" +
                encodeURIComponent(request[property])
        );
    }
    let params = formBody.join("&");
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 201) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                window.location.pathname = "./dashboard.html";
            }
        }
    };
}

function deletePost() {
    let http = new XMLHttpRequest();
    let url = `/api/admin/post/crud/${currentId}`;
    http.open("DELETE", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(null);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 201) {
                console.log(http.responseText);
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                window.location.pathname = "./dashboard.html";
                deletePostFromScreen();
            }
        }
    };
}

function deletePostFromScreen() {
    posts = document.getElementById("posts-section").childNodes;
    let i = 0;
    for (let p of posts) {
        if ((i = currentId)) {
            posts.removeChild(p);
            return;
        }
        i++;
    }
}
