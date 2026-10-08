/* To the form: the page's smooth scroll (none under reduced motion), then
   the form's first field takes focus once the scroll has ended, without
   scrolling again. */
export default function toForm(e) {
  const form = document.getElementById('form');
  if (!form) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const field = form.querySelector('input:not([type=hidden]):not([tabindex="-1"]), textarea');
  const focus = () => field && field.focus({ preventScroll: true });
  if (reduce) {
    form.scrollIntoView();
    focus();
    return;
  }
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scrollend', finish);
    focus();
  };
  window.addEventListener('scrollend', finish, { once: true });
  setTimeout(finish, 1200);
  form.scrollIntoView({ behavior: 'smooth' });
  if (window.history && window.history.replaceState) window.history.replaceState(null, '', '#form');
}
