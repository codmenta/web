(function(){
  var flavors = [
    {id:'fresa', name:'Fresa con Crema', cat:'frutal', price:8000, emoji:'🍓'},
    {id:'mango', name:'Mango', cat:'frutal', price:7500, emoji:'🥭'},
    {id:'limon', name:'Limón', cat:'frutal', price:7000, emoji:'🍋'},
    {id:'cookies', name:'Cookies & Cream', cat:'cremosa', price:9000, emoji:'🍪'},
    {id:'chocobelga', name:'Chocolate Belga', cat:'cremosa', price:9500, emoji:'🍫'},
    {id:'maracuya', name:'Maracuyá', cat:'frutal', price:7500, emoji:'🍈'},
    {id:'coco', name:'Coco', cat:'cremosa', price:8000, emoji:'🥥'},
    {id:'cafe', name:'Café Espresso', cat:'especial', price:9000, emoji:'☕'},
    {id:'arequipe', name:'Arequipe', cat:'especial', price:8500, emoji:'🍮'},
    {id:'mora', name:'Mora', cat:'frutal', price:7500, emoji:'🫐'},
    {id:'pistacho', name:'Pistacho', cat:'especial', price:10000, emoji:'🥜'},
    {id:'vainilla', name:'Vainilla Bourbon', cat:'cremosa', price:8000, emoji:'🍦'}
  ];
  var featuredIds = ['fresa','mango','limon','cookies','chocobelga','maracuya'];

  var reviewsSeed = [
    {name:'María G.', rating:5, text:'El sabor a fresa con crema me recordó a los helados de mi infancia, pero mucho más natural. ¡Encantada!'},
    {name:'Carlos R.', rating:5, text:'Pedí para el cumpleaños de mi hija y fueron todo un éxito con los invitados. Volveré a pedir seguro.'},
    {name:'Andrea P.', rating:4, text:'Excelente calidad, el chocolate belga es mi favorito. Me encantaría ver más tamaños disponibles.'},
    {name:'Julián M.', rating:5, text:'La entrega fue puntual y las paletas llegaron perfectas. Se nota el cuidado artesanal en cada detalle.'},
    {name:'Sofía T.', rating:5, text:'Maracuyá y limón son un golpe de frescura, ideales para el calor de Bogotá. Muy recomendados.'},
    {name:'Diego L.', rating:5, text:'Atención al cliente increíble y sabores que realmente enamoran. Cien por ciento recomendados.'}
  ];

  var cart = [];
  var reviews = reviewsSeed.slice();
  var selectedStar = 5;
  var currentCat = 'todos';

  function $(sel, ctx){ return (ctx||document).querySelector(sel); }
  function $all(sel, ctx){ return Array.prototype.slice.call((ctx||document).querySelectorAll(sel)); }
  function formatPrice(n){ return '$' + n.toLocaleString('es-CO'); }
  function initials(name){
    return name.trim().split(/\s+/).map(function(w){ return w[0]; }).slice(0,2).join('').toUpperCase();
  }
  function starString(rating){ return '★'.repeat(rating) + '☆'.repeat(5-rating); }

  function showToast(msg){
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    $('#toastContainer').appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('show'); });
    setTimeout(function(){
      el.classList.remove('show');
      setTimeout(function(){ el.remove(); }, 300);
    }, 2600);
  }

  // ---------------- NAVEGACIÓN ----------------
  function showPage(id){
    $all('.page').forEach(function(p){ p.classList.toggle('active', p.id === 'page-'+id); });
    $all('.nav-link').forEach(function(l){ l.classList.toggle('active', l.dataset.nav === id); });
    window.scrollTo({top:0, behavior:'smooth'});
    closeMobileMenu();
    closeSearch();
  }
  $all('[data-nav]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      showPage(el.dataset.nav);
    });
  });

  // ---------------- MENÚ MÓVIL ----------------
  var mainNav = $('#mainNav');
  var mobileMenuBtn = $('#mobileMenuBtn');
  function closeMobileMenu(){ mainNav.classList.remove('open'); }
  mobileMenuBtn.addEventListener('click', function(){ mainNav.classList.toggle('open'); });

  // ---------------- BÚSQUEDA ----------------
  var searchBar = $('#searchBar');
  var searchInput = $('#searchInput');
  function openSearch(){ searchBar.classList.add('open'); setTimeout(function(){ searchInput.focus(); }, 200); }
  function closeSearch(){ searchBar.classList.remove('open'); }
  $('#searchToggle').addEventListener('click', function(){
    searchBar.classList.contains('open') ? closeSearch() : openSearch();
  });
  $('#searchClose').addEventListener('click', closeSearch);
  searchInput.addEventListener('input', function(e){ applyFilter(currentCat, e.target.value); });
  searchInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      e.preventDefault();
      setActiveChip('todos');
      showPage('sabores');
      applyFilter('todos', searchInput.value);
    }
  });

  // ---------------- SABORES ----------------
  function flavorCard(f){
    return '<div class="flavor-card" data-cat="'+f.cat+'" data-name="'+f.name.toLowerCase()+'">'+
      '<div class="ph flavor-ph"><span class="ph-icon">'+f.emoji+'</span></div>'+
      '<h3>'+f.name+'</h3>'+
      '<span class="flavor-price">'+formatPrice(f.price)+'</span>'+
      '<button class="btn btn-add" data-id="'+f.id+'">+ Agregar</button>'+
      '</div>';
  }
  $('#featuredGrid').innerHTML = flavors.filter(function(f){ return featuredIds.indexOf(f.id) !== -1; }).map(flavorCard).join('');
  $('#fullGrid').innerHTML = flavors.map(flavorCard).join('');

  $all('.btn-add').forEach(function(btn){
    btn.addEventListener('click', function(){
      var f = flavors.filter(function(fl){ return fl.id === btn.dataset.id; })[0];
      addToCart(f);
      var original = btn.textContent;
      btn.textContent = '✓ Agregado';
      btn.classList.add('added');
      setTimeout(function(){ btn.textContent = original; btn.classList.remove('added'); }, 1200);
    });
  });

  // ---------------- FILTROS ----------------
  var chips = $all('.chip');
  function setActiveChip(cat){
    currentCat = cat;
    chips.forEach(function(c){ c.classList.toggle('active', c.dataset.cat === cat); });
  }
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      setActiveChip(chip.dataset.cat);
      applyFilter(chip.dataset.cat, searchInput.value);
    });
  });
  function applyFilter(cat, query){
    var q = (query||'').toLowerCase().trim();
    $all('#fullGrid .flavor-card').forEach(function(card){
      var matchesCat = cat === 'todos' || card.dataset.cat === cat;
      var matchesQuery = !q || card.dataset.name.indexOf(q) !== -1;
      card.style.display = (matchesCat && matchesQuery) ? '' : 'none';
    });
  }

  // ---------------- CARRITO ----------------
  function addToCart(f){
    var existing = cart.filter(function(i){ return i.id === f.id; })[0];
    if(existing){ existing.qty++; }
    else{ cart.push({id:f.id, name:f.name, price:f.price, emoji:f.emoji, qty:1}); }
    updateCart();
    showToast(f.name.replace('&amp;','&') + ' agregado al carrito ' + f.emoji);
  }
  function changeQty(id, delta){
    var item = cart.filter(function(i){ return i.id === id; })[0];
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0){ cart = cart.filter(function(i){ return i.id !== id; }); }
    updateCart();
  }
  function removeFromCart(id){
    cart = cart.filter(function(i){ return i.id !== id; });
    updateCart();
  }
  function cartTotal(){
    return cart.reduce(function(sum,i){ return sum + i.price*i.qty; }, 0);
  }
  function updateCart(){
    var count = cart.reduce(function(s,i){ return s+i.qty; }, 0);
    var badge = $('#cartBadge');
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    renderCartDrawer();
  }
  function renderCartDrawer(){
    var body = $('#cartBody');
    var foot = $('#cartFoot');
    if(cart.length === 0){
      body.innerHTML = '<div class="cart-empty"><span>🛒</span><p>Tu carrito está vacío</p></div>';
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = cart.map(function(i){
      return '<div class="cart-item">'+
        '<div class="cart-item-emoji">'+i.emoji+'</div>'+
        '<div class="cart-item-info">'+
          '<h4>'+i.name+'</h4>'+
          '<span>'+formatPrice(i.price)+'</span>'+
          '<div class="qty-control">'+
            '<button data-action="dec" data-id="'+i.id+'" aria-label="Restar">−</button>'+
            '<span>'+i.qty+'</span>'+
            '<button data-action="inc" data-id="'+i.id+'" aria-label="Sumar">+</button>'+
          '</div>'+
        '</div>'+
        '<button class="cart-item-remove" data-action="remove" data-id="'+i.id+'" aria-label="Eliminar">✕</button>'+
        '</div>';
    }).join('');
    foot.innerHTML = '<div class="cart-subtotal"><span>Subtotal</span><span>'+formatPrice(cartTotal())+'</span></div>'+
      '<button class="btn btn-primary" id="checkoutBtn">Finalizar pedido</button>'+
      '<button class="btn-link" id="continueShopping">Seguir comprando</button>';
    $('#checkoutBtn').addEventListener('click', function(){
      showToast('¡Gracias por tu pedido! Te contactaremos para coordinar la entrega 👑');
      cart = [];
      updateCart();
      closeCartDrawer();
    });
    $('#continueShopping').addEventListener('click', closeCartDrawer);
    $all('[data-action="inc"]', body).forEach(function(b){ b.addEventListener('click', function(){ changeQty(b.dataset.id, 1); }); });
    $all('[data-action="dec"]', body).forEach(function(b){ b.addEventListener('click', function(){ changeQty(b.dataset.id, -1); }); });
    $all('[data-action="remove"]', body).forEach(function(b){ b.addEventListener('click', function(){ removeFromCart(b.dataset.id); }); });
  }

  var overlay = $('#overlay');
  var cartDrawer = $('#cartDrawer');
  function openCartDrawer(){ cartDrawer.classList.add('open'); overlay.classList.add('show'); }
  function closeCartDrawer(){ cartDrawer.classList.remove('open'); overlay.classList.remove('show'); }
  $('#cartToggle').addEventListener('click', openCartDrawer);
  $('#closeCart').addEventListener('click', closeCartDrawer);
  overlay.addEventListener('click', function(){
    closeCartDrawer();
    closeReviewModal();
  });
  updateCart();

  // ---------------- OPINIONES ----------------
  function reviewCard(r){
    return '<div class="review-card">'+
      '<div class="review-head">'+
        '<div class="avatar">'+initials(r.name)+'</div>'+
        '<div><h4>'+r.name+'</h4><span class="stars">'+starString(r.rating)+'</span></div>'+
      '</div>'+
      '<p>'+r.text+'</p>'+
      '</div>';
  }
  function renderReviews(){
    $('#reviewsGrid').innerHTML = reviews.map(reviewCard).join('');
    $('#testiPreview').innerHTML = reviews.slice(0,3).map(reviewCard).join('');
  }
  renderReviews();

  var reviewModal = $('#reviewModal');
  function openReviewModal(){ reviewModal.classList.add('open'); overlay.classList.add('show'); }
  function closeReviewModal(){ reviewModal.classList.remove('open'); overlay.classList.remove('show'); }
  $('#openReviewModal').addEventListener('click', openReviewModal);
  $('#closeReviewModal').addEventListener('click', closeReviewModal);

  var starButtons = $all('.star', $('#starPicker'));
  function paintStars(val){
    starButtons.forEach(function(s){ s.classList.toggle('active', Number(s.dataset.val) <= val); });
  }
  paintStars(selectedStar);
  starButtons.forEach(function(s){
    s.addEventListener('click', function(){
      selectedStar = Number(s.dataset.val);
      paintStars(selectedStar);
    });
  });

  $('#reviewForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = $('#reviewName').value.trim();
    var text = $('#reviewComment').value.trim();
    if(!name || !text) return;
    reviews.unshift({name:name, rating:selectedStar, text:text});
    renderReviews();
    closeReviewModal();
    e.target.reset();
    selectedStar = 5;
    paintStars(5);
    showToast('¡Gracias por tu opinión! 💗');
  });

  // ---------------- CONTACTO ----------------
  $('#contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    showToast('¡Mensaje enviado! Te contactaremos pronto 📩');
    e.target.reset();
  });

  // ---------------- REDES SOCIALES ----------------
  $all('.social-btn').forEach(function(btn){
    btn.addEventListener('click', function(){ showToast('Enlace de demostración: ' + btn.dataset.social); });
  });

  // ---------------- TECLA ESCAPE ----------------
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      closeCartDrawer();
      closeReviewModal();
      closeSearch();
      closeMobileMenu();
    }
  });

})();
