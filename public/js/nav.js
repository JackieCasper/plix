const Nav = {};
Nav.links = [
  {
    href: '/user/profile',
    imgClass: 'user',
    text: 'My Plix',
    active: window.location.pathname.includes('profile') ? 'active' : ''
  },
  {
    href: '/locations',
    imgClass: 'explore',
    text: 'Explore',
    active: window.location.pathname.includes('locations') ? 'active' : ''
  },
  {
    href: '/user/logout',
    imgClass: 'logout',
    text: 'Logout'
  }
];

//<nav class="top-nav">
//    <div class="menu-icon"></div>
//    <a href="/"><h1>Plix</h1></a>
//    <a href="/plix/new" class="new-plix-icon"></a>
//  </nav>
//  <nav class="side-nav">
//    <a href="/user/profile" class="nav-link">
//      <div class="nav-icon user"></div>
//      <p class="nav-text">My Plix</p>
//    </a>
//
//    <a href="/locations" class="nav-link">
//      <div class="nav-icon explore"></div>
//      <p class="nav-text">Explore</p>
//    </a>
//
//    <a href="/user/logout" class="nav-link">
//      <div class="nav-icon logout"></div>
//      <p class="nav-text">Logout</p>
//    </a>
//  </nav>

Nav.init = () => {
  console.log(window.location);
  const $sideNav = $('<nav>', {
      class: 'side-nav'
    })
    .prependTo($('body'));
  Nav.links.forEach(link => {
    const $link = $('<a>', {
        href: link.href,
        class: 'nav-link'
      })
      .addClass(link.active)
      .appendTo($sideNav);
    const $icon = $('<div>', {
        class: 'nav-icon ' + link.imgClass
      })
      .appendTo($link);
    const $text = $('<p>', {
        class: 'nav-text'
      })
      .text(link.text)
      .appendTo($link);
  });
  const $topNav = $('<nav>', {
      class: 'top-nav'
    })
    .prependTo($('body'));
  const $menuIcon = $('<div>', {
      class: 'menu-icon'
    })
    .click(() => {
      $('.side-nav').toggleClass('show');
    })
    .appendTo($topNav);
  const $h1Link = $('<a>', {
      href: '/'
    })
    .appendTo($topNav);
  const $h1 = $('<h1>')
    .text('Plix')
    .appendTo($h1Link);
  const $newPlix = $('<a>', {
      href: '/plix/new',
      class: 'new-plix-icon'
    })
    .appendTo($topNav);
}