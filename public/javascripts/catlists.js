document.addEventListener("DOMContentLoaded", e => {
    const deleteBtns = document.querySelectorAll(".delete");
    console.log(deleteBtns)
    deleteBtns.forEach(button => button.addEventListener("click", async e => {
        e.preventDefault();
        const catListId = button.id;
        const id = catListId.split("-")[0]
        const catList = await fetch (`/catlists/${id}/delete`, {
            method: "POST"
        })
        const catListToRemove = document.getElementById(`${id}-catlist`)
        console.log("hi" + catListToRemove.innerHTML)
        catListToRemove.innerHTML = '';
        console.log(catList);
    }))
})