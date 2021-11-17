document.addEventListener("DOMContentLoaded", async e => {
    let createBtn;
    const newList = async () => {
        const catListContainer = document.querySelector('.catlist-container');
        const res = await fetch ("/api/catlists");
    
        const catLists = await res.json();
        
        const catListHTML = catLists.map(catList => {
            return `
            <div id="${catList.id}-catList">
            <a href="/catLists/${catList.id}">${catList.name}</a>
              <button id="${catList.id}-edit" class="edit">Edit Cat List</button>
              <button id="${catList.id}-delete" class="delete">Delete Cat List</button>
              </div>
            `
        });
        catListContainer.innerHTML = catListHTML.join("");
        
        const deleteBtns = document.querySelectorAll(".delete");
        
        const editBtns = document.querySelectorAll(".edit");
        
        deleteBtns.forEach(button => button.addEventListener("click", async e => {
            e.preventDefault();
            const catListId = button.id;
            const id = catListId.split("-")[0]
            const catListToRemove = document.getElementById(`${id}-catList`)
            const catListName = catListToRemove.querySelector('a').innerText;
            if (window.confirm(`Are you sure you want to delete catlist "${catListName}"?`)) {
                catListToRemove.innerHTML = '';
                await fetch (`/api/catlists/${id}`, {
                    method: "DELETE"
                });
            }
        }));
      
        editBtns.forEach(button => button.addEventListener("click", async e => {
            e.preventDefault();
            const catListId = button.id;
            const id = catListId.split("-")[0]
            const catListToEdit = document.getElementById(`${id}-catList`)
            const text = catListToEdit.querySelector('a').innerHTML
            const editForm = document.createElement("form");
            editForm.innerHTML = `
                <label for="name">Name</label>
                <input name="name" type="text" value="${text}">
                <button id="edit">Submit</button>
                <input type="button" value="Cancel">
            `
            catListToEdit.innerHTML = ''
            catListToEdit.appendChild(editForm);
            editForm.addEventListener("submit", async e => {
                e.preventDefault();
                const formData = new FormData(editForm);
                const name = formData.get('name');
                const body = { name };
                await fetch(`/api/catlists/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' }
                })
                await newList()
            });
        }));
    };
    
    await newList();
    
    createBtn = document.createElement("button");
    createBtn.innerHTML = "Create New Cat List";
    document.body.appendChild(createBtn);
    
    createBtn.addEventListener("click", async e => {
        e.preventDefault();
        const form = document.createElement('form');
        form.innerHTML = `
        <label for="name">Name</label>
        <input name="name" type="text">
        <button id="create">Submit</button>
        `
        document.body.appendChild(form)
        createBtn.disabled = true;
        form.addEventListener("submit", async e => {
            e.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('name');
            const body = { name };
            await fetch('/api/catlists', {
                method: 'POST',
                body: JSON.stringify( body ),
                headers: { 'Content-Type': 'application/json' }
            });
            await newList();
            form.remove();
            createBtn.disabled = false;
        });
    });


})