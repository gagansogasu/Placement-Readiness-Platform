/**
 * KodNest Premium Build System - Core Logic
 * Calm, Intentional, Coherent, Confident
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('KodNest Premium Build System Initialized.');

    // Simple smooth transitions for UI interactions
    const checkBoxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');

    checkBoxes.forEach(chk => {
        chk.addEventListener('change', (e) => {
            const group = e.target.closest('.checklist-item-group');
            const label = group.querySelector('.checklist-item');
            const proofInput = group.querySelector('.proof-input');

            if (e.target.checked) {
                label.style.opacity = '0.5';
                if (proofInput) proofInput.focus();
            } else {
                label.style.opacity = '1';
                if (proofInput) proofInput.value = '';
            }
        });
    });

    // Handle secondary panel buttons (just logic placeholders)
    const secondaryBtns = document.querySelectorAll('.secondary-panel .btn');
    secondaryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Ripple or feedback handled via CSS transitions
            console.log(`Action triggered: ${btn.innerText}`);
        });
    });
});
