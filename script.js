// 1. SCROLL REVEAL ANIMATION
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 2. NOTES MODAL LOGIC
const notesData = {
    'note-1': {
        title: "The Ethics of Materials",
        content: "Detailed post content goes here. You can write several paragraphs about sustainable material sourcing in the GCC region and why it matters for long-term project integrity."
    },
    'note-2': {
        title: "Systems vs. Sketches",
        content: "This note discusses the balance between creative intuition and the rigorous business systems required to deliver high-end architectural projects on time."
    },
    'note-3': {
        title: "Quiet Luxury in GCC",
        content: "An analysis of the moving trend away from loud, ornamental architecture toward grounded, high-quality, and reflective spaces."
    }
};

function openNote(id) {
    const modal = document.getElementById('note-modal');
    const body = document.getElementById('modal-body');
    const data = notesData[id];
    
    body.innerHTML = `
        <h2 style="margin-bottom:1rem">${data.title}</h2>
        <p>${data.content}</p>
    `;
    modal.style.display = "block";
}

document.querySelector('.close-modal').onclick = function() {
    document.getElementById('note-modal').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('note-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 3. SMOOTH NAV SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
