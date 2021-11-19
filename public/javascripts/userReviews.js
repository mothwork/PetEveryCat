document.addEventListener('DOMContentLoaded', (e) => {
    const deleteButtons = document.querySelectorAll('.delete')

    deleteButtons.forEach(button => button.addEventListener("click", async e => {
        e.preventDefault()
        const id = e.target.id.split("-");
        const reviewId = id[0];
        if (window.confirm(`Are you sure you want to delete this review?`)) {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.message == 'successful') {
                const container = document.querySelector(`.reviewContainer`)
                container.innerHTML = '';
                window.location.href = `/users/${id[1]}`
            }
        }
    }))
})
