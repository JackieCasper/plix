var Nav = {};
Nav.links = [
  {
    href: '/user/feed',
    imgClass: 'home',
    text: 'Home',
    active: window.location.pathname.includes('feed') ? 'active' : ''
  },
  {
    href: '/user/profile',
    imgClass: 'image',
    text: 'My Plix',
    active: window.location.pathname.includes('profile') ? 'active' : ''
  },
  {
    href: '/user/find',
    imgClass: 'user',
    text: 'Find People',
    active: window.location.pathname.includes('find') ? 'active' : ''
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

Nav.init = function () {
  console.log(window.location);
  var $sideNav = $('<nav>', {
      class: 'side-nav'
    })
    .prependTo($('body'));
  Nav.links.forEach(function (link) {
    var $link = $('<a>', {
        href: link.href,
        class: 'nav-link'
      })
      .addClass(link.active)
      .appendTo($sideNav);
    var $icon = $('<div>', {
        class: 'nav-icon ' + link.imgClass
      })
      .appendTo($link);
    var $text = $('<p>', {
        class: 'nav-text'
      })
      .text(link.text)
      .appendTo($link);
  });
  var $topNav = $('<nav>', {
      class: 'top-nav'
    })
    .prependTo($('body'));
  var $menuIcon = $('<div>', {
      class: 'menu-icon'
    })
    .click(function () {
      $('.side-nav').toggleClass('show');
    })
    .appendTo($topNav);
  var $h1Link = $('<a>', {
      href: '/'
    })
    .appendTo($topNav);
  var $h1 = $('<h1>')
    .text('Plix')
    .appendTo($h1Link);
  var $newPlix = $('<a>', {
      href: '/plix/new',
      class: 'new-plix-icon'
    })
    .appendTo($topNav);
}