/*-------Topo: progresso, fundo e botão de voltar--------*/


const topo = document.querySelector('.topo');
const progresso = document.querySelector('.progresso');
const voltarTopo = document.querySelector('.voltar-topo');

function aoRolar(){
    const total = document.documentElement.scrollHeight - innerHeight;
    progresso.style.setProperty('--progresso', total > 0 ? scrollY / total : 0);
    topo.classList.toggle('rolado', scrollY > 20);
    voltarTopo.classList.toggle('visivel', scrollY > 700);
}

addEventListener('scroll', aoRolar, { passive: true });
aoRolar();


/*-------Menu mobile--------*/


const menu = document.querySelector('.menu');
const menuBotao = document.querySelector('.menu-botao');

function alternarMenu(abrir){
    menu.classList.toggle('aberto', abrir);
    menuBotao.setAttribute('aria-expanded', abrir);
    menuBotao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
}

menuBotao.addEventListener('click', ()=> alternarMenu(!menu.classList.contains('aberto')));
menu.querySelectorAll('a').forEach((link)=> link.addEventListener('click', ()=> alternarMenu(false)));


/*-------Link ativo conforme a seção na tela--------*/


const linksMenu = [...menu.querySelectorAll('a:not(.btn)')];

const espiao = new IntersectionObserver((entradas)=>{
    entradas.forEach((entrada)=>{
        if (!entrada.isIntersecting) return;
        linksMenu.forEach((link)=> link.classList.toggle('ativo', link.hash === `#${entrada.target.id}`));
    });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach((secao)=> espiao.observe(secao));


/*-------Entrada dos elementos ao rolar--------*/


// itens de uma mesma lista entram em cascata
document.querySelectorAll('.stack, .projetos-grid, .linha-tempo').forEach((grupo)=>{
    [...grupo.children].forEach((item, i)=> item.style.setProperty('--atraso', `${i * 90}ms`));
});

const observador = new IntersectionObserver((entradas)=>{
    entradas.forEach((entrada)=>{
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: .12 });

document.querySelectorAll('.revelar').forEach((elemento)=> observador.observe(elemento));


/*-------Início--------*/


// as linhas do código aparecem uma após a outra
document.querySelectorAll('.editor .linha').forEach((linha, i)=> linha.style.setProperty('--n', i));

// segunda cópia da faixa para o loop não ter emenda
const trilho = document.querySelector('.faixa-trilho');
trilho.append(trilho.firstElementChild.cloneNode(true));


/*-------Sobre--------*/


// idade calculada pela data de nascimento, para o texto não ficar desatualizado
const nascimento = new Date(1999, 10, 5);
const hoje = new Date();
let anos = hoje.getFullYear() - nascimento.getFullYear();
if (hoje < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate())) anos--;
document.querySelector('.idade').textContent = anos;

document.querySelector('.ano').textContent = hoje.getFullYear();


/*-------Habilidades: luz que segue o mouse--------*/


document.querySelectorAll('.stack-card').forEach((card)=>{
    card.addEventListener('pointermove', (e)=>{
        const area = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - area.left}px`);
        card.style.setProperty('--y', `${e.clientY - area.top}px`);
    });
});


/*-------Certificados: carrossel--------*/


const carrossel = document.querySelector('.carrossel');
const palco = carrossel.querySelector('.carrossel-palco');
const certs = [...carrossel.querySelectorAll('.cert')];
const dotsBox = carrossel.querySelector('.carrossel-dots');
const info = carrossel.querySelector('.carrossel-info');
const titulo = carrossel.querySelector('.carrossel-titulo');
const detalhe = carrossel.querySelector('.carrossel-detalhe');
const total = certs.length;
let atual = 0;

const dots = certs.map((cert, i)=>{
    const validar = document.createElement('span');
    validar.className = 'cert-validar';
    validar.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> Validar certificado';
    cert.appendChild(validar);

    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ver certificado ${i + 1}`);
    dot.addEventListener('click', ()=> irPara(i));
    dotsBox.appendChild(dot);
    return dot;
});

// distância circular até o certificado atual: 0 no centro, negativo à esquerda
function posicaoRelativa(i){
    let offset = (i - atual + total) % total;
    if (offset > total / 2) offset -= total;
    return offset;
}

function atualizar(){
    certs.forEach((cert, i)=>{
        const offset = posicaoRelativa(i);
        const anterior = Number(cert.style.getPropertyValue('--offset') || offset);
        // cartão que dá a volta de uma ponta à outra: reaparece sem atravessar o palco
        const pulou = Math.abs(offset - anterior) > Math.floor(total / 2);

        if (pulou) cert.classList.add('pulando');
        cert.style.setProperty('--offset', offset);
        cert.style.setProperty('--abs', Math.abs(offset));
        cert.classList.toggle('ativo', offset === 0);
        cert.classList.toggle('oculto', Math.abs(offset) > 2);
        cert.tabIndex = offset === 0 ? 0 : -1;
        if (pulou) {
            void cert.offsetWidth;
            cert.classList.remove('pulando');
        }
    });

    dots.forEach((dot, i)=> dot.classList.toggle('ativo', i === atual));

    titulo.textContent = certs[atual].dataset.titulo;
    detalhe.textContent = `Workover Academy · ${certs[atual].dataset.horas} horas · ${atual + 1}/${total}`;
    info.classList.remove('trocando');
    void info.offsetWidth;
    info.classList.add('trocando');
}

function irPara(i){
    atual = (i + total) % total;
    atualizar();
}

carrossel.querySelector('.anterior').addEventListener('click', ()=> irPara(atual - 1));
carrossel.querySelector('.proximo').addEventListener('click', ()=> irPara(atual + 1));

carrossel.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowLeft') irPara(atual - 1);
    if (e.key === 'ArrowRight') irPara(atual + 1);
});

// autoplay: a barra do ponto ativo (CSS) dita o tempo e pausa no hover
dotsBox.addEventListener('animationend', (e)=>{
    if (e.animationName === 'tempoCarrossel') irPara(atual + 1);
});

// arrastar / swipe
let inicioX = null;
let arrastou = false;

palco.addEventListener('pointerdown', (e)=>{
    inicioX = e.clientX;
    carrossel.classList.add('arrastando');
});

window.addEventListener('pointerup', (e)=>{
    carrossel.classList.remove('arrastando');
    if (inicioX === null) return;
    const distancia = e.clientX - inicioX;
    inicioX = null;
    if (Math.abs(distancia) > 50) {
        arrastou = true;
        irPara(distancia < 0 ? atual + 1 : atual - 1);
        // o click que vem logo após soltar ainda vê arrastou = true e é cancelado
        setTimeout(()=> arrastou = false);
    }
});

palco.addEventListener('pointercancel', ()=>{
    inicioX = null;
    carrossel.classList.remove('arrastando');
});

palco.addEventListener('dragstart', (e)=> e.preventDefault());

// só o certificado do centro abre o validador; os laterais vêm para o centro
certs.forEach((cert, i)=>{
    cert.addEventListener('click', (e)=>{
        if (arrastou || i !== atual) {
            e.preventDefault();
            if (!arrastou) irPara(i);
        }
    });
});

atualizar();


/*-------Contato: copiar e-mail--------*/


const aviso = document.querySelector('.aviso');
let avisoTimer;

function mostrarAviso(texto){
    aviso.textContent = texto;
    aviso.classList.add('mostrar');
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(()=> aviso.classList.remove('mostrar'), 2200);
}

document.querySelector('.copiar-email').addEventListener('click', async (e)=>{
    const email = e.currentTarget.dataset.email;
    try {
        await navigator.clipboard.writeText(email);
        mostrarAviso('E-mail copiado!');
    } catch {
        mostrarAviso(email);
    }
});
