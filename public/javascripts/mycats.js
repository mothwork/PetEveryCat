document.addEventListener('DOMContentLoaded', (e) => {
    const deleteButton = document.querySelectorAll('.delete')

    for (let i = 0; i < deleteButton.length; i++) {
        const del = deleteButton[i];
        del.addEventListener('click', async (e) => {
            e.preventDefault()
            const catId = e.target.id
            console.log(catId)
            const res = await fetch(`/cats/${catId}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.message = 'successful') {
                const container = document.querySelector(`.cat-${catId}`)
                container.remove()
            }
        })

    }
})
