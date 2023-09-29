const editBtns = document.querySelectorAll('#edit-btn')
const editForms = document.querySelectorAll('.edit-comment-form')

editBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    editForms[idx].style.display = editForms[idx].style.display === "flex" ? "none" : "flex"
  })
})

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString()
