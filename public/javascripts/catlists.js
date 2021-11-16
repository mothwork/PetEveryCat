document.addEventListener("DOMContentLoaded", e => {
    const deleteBtns = document.querySelectorAll(".delete");
    const createBtn = document.querySelector("#new");

    deleteBtns.forEach(button => button.addEventListener("click", async e => {
        e.preventDefault();
        const catListId = button.id;
        const id = catListId.split("-")[0]
        const catListToRemove = document.getElementById(`${id}-catlist`)
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
        const form = document.createElement('p');
        form.innerText = 'I am not a form!'
        document.body.appendChild(form)
        // await fetch('/catlists/new', { method: 'POST'});
    });


})