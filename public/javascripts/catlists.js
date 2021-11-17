document.addEventListener("DOMContentLoaded", async e => {
    
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
    };
    
    await newList();

    const createBtn = document.createElement("button");
    createBtn.innerHTML = "Create New Cat List";
    document.body.appendChild(createBtn);

    const deleteBtns = document.querySelectorAll(".delete");

    console.log(deleteBtns);
    deleteBtns.forEach(button => button.addEventListener("click", async e => {
        e.preventDefault();
        console.log('I am in!');
        const catListId = button.id;
        const id = catListId.split("-")[0]
        const catListToRemove = document.getElementById(`${id}-catList`)
        const catListName = catListToRemove.querySelector('a').innerText;
        if (window.confirm(`Are you sure you want to delete catlist "${catListName}"?`)) {
            catListToRemove.innerHTML = '';
            const catList = await fetch (`api/catlists/${id}`, {
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
        <button id="create">Submit</button>
        `
        document.body.appendChild(form)
        createBtn.disabled = true;
        form.addEventListener("submit", async e => {
            e.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('name');
            const body = { name };
            const res = await fetch('/api/catlists', {
                method: 'POST',
                body: JSON.stringify( body ),
                headers: { 'Content-Type': 'application/json' }
            });
            const catList = await res.json();
            await newList();
            form.remove();
        createBtn.disabled = false;
        });
    });


})