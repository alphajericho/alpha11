/* META PIXEL — Alpha Eleven Main (OSC) · ID 1342318294454589
   Loaded by every page. Fires PageView on load, and InitiateCheckout when a ticket link is tapped. */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1342318294454589');
fbq('track', 'PageView');
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  var h = a.href || '';
  if (h.indexOf('tickets.alpha11.co') > -1) fbq('track', 'InitiateCheckout', { content_name: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 80) });
  else if (h.indexOf('wa.me') > -1 || h.indexOf('lin.ee') > -1 || h.indexOf('mailto:') === 0) fbq('track', 'Contact');
}, true);
