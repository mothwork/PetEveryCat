document.addEventListener("DOMContentLoaded", async e => {
    const innerWrapper = document.querySelector('.inner-wrapper')
    const createBtn = document.createElement("button")
    createBtn.setAttribute("id", "create")
    createBtn.innerText = "Create Cat List"
    innerWrapper.appendChild(createBtn);
    const csrf = document.querySelector("input")
    const formContainer = document.querySelector('.form-container')
    const form = document.createElement('form');
    
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
        formContainer.innerHTML='';
        form.innerHTML=''
        createBtn.disabled = false;
    });
    
    createBtn.addEventListener("click", async e => {
        e.preventDefault();
        form.appendChild(csrf);
        form.innerHTML += `
        <label for="name">Name</label>
        <input name="name" type="text" id="create-input">
        <button id="create">Submit</button>
        <button type="button" value="Cancel" id="cancel-create">Cancel</button>
        `
        formContainer.appendChild(form);
        const input = document.getElementById('create-input');
        input.focus();
        input.select();

        createBtn.disabled = true;
        const cancelBtn = document.getElementById('cancel-create');
        cancelBtn.addEventListener("click", async e => {
            createBtn.disabled = false;
            form.innerHTML = '';
            // // await newList();
        });
    });

    const newList = async () => {
        const catListContainer = document.querySelector('.catlist-container');
        const res = await fetch ("/api/catlists");
    
        const catLists = await res.json();
        
        const catListHTML = catLists.map(catList => {
            if (catList.canDelete) {
                return `
                <div id="${catList.id}-catList" class="catList">
                <a href="/catLists/${catList.id}" class="cat-list-anchor">${catList.name}</a>
                  <div class="list-buttons">
                    <button id="${catList.id}-edit" class="edit">Edit Cat List</button>
                    <button id="${catList.id}-delete" class="delete">Delete Cat List</button>
                  </div>
                  </div>
                `
            } else {
                return `
                <div id="${catList.id}-catList" class="catList">
                    <a href="/catLists/${catList.id}" class="cat-list-anchor">${catList.name}</a>
                </div>
                `
            };
        });

        catListContainer.innerHTML = catListHTML.join("")
        
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
                const catList = document.getElementById(`${id}-catList`)
                catList.remove();
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
                <input name="name" type="text" value="${text}" id="edit-input">
                <button id="edit">Submit</button>
                <button type="button" value="Cancel" id="cancel">Cancel</button>
            `
            catListToEdit.innerHTML = ''
            catListToEdit.appendChild(editForm);
            const input = document.getElementById('edit-input');
            input.focus();
            input.select();
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
            const cancelBtn = document.getElementById('cancel');
            cancelBtn.addEventListener("click", async e => {
                await newList();
            });
        }));
        
    };
    
    await newList();


})