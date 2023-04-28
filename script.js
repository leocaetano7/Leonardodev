
function escrevendoLetra(){
    function ativaLetra(elemento){
        const arrTexto = elemento.innerHTML.split('');
        elemento.innerHTML = '';
        arrTexto.forEach((letra, i)=>{
            setTimeout(()=>{
                elemento.innerHTML += letra;
            }, 75 * i);
        })
    }

    const titulo = document.querySelector('.digitando');
    ativaLetra(titulo);
}

// chama a função escrevendoLetra() aqui
escrevendoLetra();

const ativaMenu = document.querySelector('.fa-bars');
const navMenu = document.querySelector('header .nave');

ativaMenu.addEventListener('click', ()=>{
    ativaMenu.classList.toggle('fa-x');
    navMenu.classList.toggle('open');
});
