const API = "http://localhost:3000";

// ================= POSTS =================
async function LoadData() {
    let res = await fetch(API + "/posts");
    let posts = await res.json();

    let body = document.getElementById("body_table");
    body.innerHTML = "";

    for (const post of posts) {
        let style = post.isDeleted ? "text-decoration:line-through;color:gray" : "";

        body.innerHTML += `
        <tr>
            <td>${post.id}</td>
            <td style="${style}">${post.title}</td>
            <td style="${style}">${post.views}</td>
            <td>
                <button onclick="SoftDelete('${post.id}')">Delete</button>
            </td>
        </tr>`;
    }
}

// Tạo / Update post
async function Save() {
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;

    // Lấy danh sách post để tìm maxId
    let res = await fetch("http://localhost:3000/posts");
    let posts = await res.json();

    let maxId = 0;
    posts.forEach(p => {
        let num = parseInt(p.id);
        if (num > maxId) maxId = num;
    });

    let newId = (maxId + 1).toString();

    let createRes = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: newId,
            title: title,
            views: views,
            isDeleted: false
        })
    });

    if (createRes.ok) {
        console.log("Thêm mới thành công");
    }

    LoadData();
    return false;
}


// XOÁ MỀM
async function SoftDelete(id) {
    await fetch(API + "/posts/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    LoadData();
}

// ================= COMMENTS =================
async function LoadComments(postId) {
    let res = await fetch(API + `/comments?postId=${postId}`);
    let comments = await res.json();
    console.log(comments);
}

async function AddComment(postId, text) {
    let res = await fetch(API + "/comments");
    let comments = await res.json();
    let maxId = Math.max(...comments.map(c => Number(c.id)));
    let newId = (maxId + 1).toString();

    await fetch(API + "/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: newId,
            text,
            postId,
            isDeleted: false
        })
    });
}

async function UpdateComment(id, text) {
    await fetch(API + "/comments/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
}

async function DeleteComment(id) {
    await fetch(API + "/comments/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
}

LoadData();
