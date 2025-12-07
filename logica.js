// ---------------- Internacionalización ----------------

let currentLang = localStorage.getItem('lang') || 'es'; // idioma seleccionado
let translations = {};

async function loadLanguage(lang) {
    document.documentElement.lang = lang; //cambiar atributo lang del html
    const res = await fetch(`/ux/i18n/${lang}.json`); //cargar el json correspondiente al idioma seleccionado
    translations = await res.json();

    //cambiar textos de los elementos cuyo data-id coincida con los del json
    translations.forEach(item => {
        const el = document.querySelector(`[data-id="${item.dataId}"]`);
        if(el) el.textContent = item.text;

        const inputEl = document.querySelector(`[data-i18n-placeholder="${item.dataId}"]`);
        if(inputEl) inputEl.placeholder = item.text;

        if (item.dataId.includes("alt")) {
            const img = document.querySelector(`[data-id="${item.dataId}"]`);
            if (img && img.tagName === "IMG") {
                img.alt = item.text;
            }
        }
    });

    // guardar idioma seleccionado en localStorage
    localStorage.setItem('lang', lang);
}

// configurar botones de cambio de idioma
document.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
        currentLang = btn.dataset.lang;
        loadLanguage(currentLang);
    });
});

// cargar idioma al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadLanguage(currentLang);
});

// ---------------- Buscador ----------------

const searchSection = document.querySelector('header section input[type="text"]').closest('section');
const searchInput = searchSection.querySelector('input[type="text"]');
const searchBtn = searchSection.querySelector('button');

let resultsContainer = null;

async function search(aBuscar) {
    //si no hay nada que buscar, eliminar resultados previos
    if(!aBuscar) {
        if (resultsContainer) {
            resultsContainer.remove();
            resultsContainer = null;
        }
        return;
    }

    if (!resultsContainer) {
        resultsContainer = document.createElement('section');
        searchInput.insertAdjacentElement('afterend', resultsContainer);
    }

    //buscar coincidencias en el json del texto pasando texto a minusuculas
    const results = translations.filter(item => item.text.toLowerCase().includes(aBuscar.toLowerCase()));
    resultsContainer.innerHTML = '';

    if(results.length === 0){
        if(currentLang === 'es') {
            resultsContainer.innerHTML = '<p>No se encontraron resultados</p>';
        } else {
            resultsContainer.innerHTML = '<p>No results found</p>';
        }
    } else {
        //crear un enlace a la página correspondiente por cada resultado encontrado
        results.forEach(item => {
            const link = document.createElement('a');
            link.href = 'ux' +item.url;
            link.textContent = item.text + ' (' + 'ux' + item.url + ')';
            resultsContainer.appendChild(link);
        });
    }
}

//asociar el evento click al botón de buscar
searchBtn.addEventListener('click', () => {
    search(searchInput.value);
});

const deleteBtn = document.querySelector('button[data-id="eliminar_btn"]');

// borrar el contenido del input y los resultados al hacer click en el botón eliminar
deleteBtn.addEventListener('click', () => {

    searchInput.value = '';

    if (resultsContainer) {
        resultsContainer.remove();
        resultsContainer = null;
    }

});




