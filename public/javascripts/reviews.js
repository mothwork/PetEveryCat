document.addEventListener("DOMContentLoaded", async e => {
  const deleteBtns = document.querySelectorAll('.delete');

  deleteBtns.forEach(btn => {
    btn.addEventListener("click", async e => {
      e.preventDefault();
      const reviewId = btn.id;
      if (window.confirm(`Are you sure you want to remove this review?`)) {
        await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
        const row = document.getElementById(`review-${reviewId}`);
        row.remove();
      }
    });
  });
});