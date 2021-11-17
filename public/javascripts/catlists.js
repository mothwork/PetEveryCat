document.addEventListener("DOMContentLoaded", async e => {
    const res = await fetch ("/catlists/api")

    const catLists = await res.json();

    const catListHTML = catLists.map(catList => {
        if (catList.canDelete) {
            return `
            <div id="${catList.id}-catList">
              <a href="/catLists/${catList.id}">${catList.name}</a>
              <button id="${catList.id}-edit" class="edit">Edit Cat List</button>
              <button id="${catList.id}-delete" class="delete">Delete Cat List</button>
            </div>
            `
        } else {
            return `
            <div id="${catList.id}-catList">
              <a href="/catLists/${catList.id}">${catList.name}</a>
              <button id="${catList.id}-edit" class="edit">Edit Cat List</button>
            </div>
            `
        }
    })

    document.body.innerHTML += catListHTML.join("");

    const createBtn = document.createElement("button");
    createBtn.innerHTML = "Create New Cat List";
    document.body.appendChild(createBtn);

    const deleteBtns = document.querySelectorAll(".delete");

    deleteBtns.forEach(button => button.addEventListener("click", async e => {
        e.preventDefault();
        const catListId = button.id;
        const id = catListId.split("-")[0]
        const catListToRemove = document.getElementById(`${id}-catList`)
        const catListName = catListToRemove.querySelector('a').innerText;
        if (window.confirm(`Are you sure you want to delete catlist "${catListName}"?`)) {
            catListToRemove.innerHTML = '';
            const catList = await fetch (`/catlists/${id}`, {
                method: "DELETE"
            });
        }
    }));
    
    createBtn.addEventListener("click", async e => {
        e.preventDefault();
        const form = document.createElement('form');
        form.innerHTML = `
        <label for="name">Name</label>
        <input name="name" type="text">
        <button id="create">Create Cat List</button>
        `
        document.body.appendChild(form)
        const createBtn = document.getElementById("create");
        createBtn.addEventListener("click", async e => {
            e.preventDefault();
            
            await fetch('/catlists', { method: 'POST'});
        })
    });


})