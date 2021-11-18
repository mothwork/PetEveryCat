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

    const createButtons = document.querySelectorAll('.create')

    createButtons.forEach(button => {
        button.addEventListener("click", async e => {
            e.preventDefault();
            const form = document.createElement('form');
            form.setAttribute("method", "post")
            form.setAttribute("actions", "/api/reviews")
            form.innerHTML = `
                <input type="hidden" name="_csrf" value="${e.target.id.split("-")[0]}">
                <label for="rating">Rating: </label>
                <select name="rating"><option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                </select>
                <div class="form-group">
                <label for="content">Review:</label>
                <textarea class="textarea" id="content" name="content"></textarea>
                </div>
                <button>Submit</button>
            `
            document.body.appendChild(form)
            button.disabled = true;
            form.addEventListener("submit", async e => {
                e.preventDefault();
                const formData = new FormData(form);
                const rating = formData.get('rating');
                const content = formData.get('content');
                const catId = `${e.target.id.split("-")[1]}`
                const body = { rating, content, catId };
                console.log(body);
                await fetch(`/api/reviews`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' }
                });
                form.remove();
                button.disabled = false;
            });
        });
    })
})
