/* ============================================================
   FARMER APP — State Management
   Persists state via localStorage across all pages.
   ============================================================ */

const state = {
  user: { name: '', role: 'farmer', aadhar: '' },
  currentStep: 0,
  stepPhotos: Array(10).fill(null),
  lang: 'mr'
};

(function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem('kb-state') || '{}');
    if (saved.user)       state.user       = saved.user;
    if (saved.stepPhotos) state.stepPhotos  = saved.stepPhotos;
    if (saved.lang)       state.lang        = saved.lang;
    if (typeof saved.currentStep === 'number') state.currentStep = saved.currentStep;
  } catch (e) {}
})();

function saveState() {
  try {
    localStorage.setItem('kb-state', JSON.stringify({
      user:        state.user,
      stepPhotos:  state.stepPhotos,
      lang:        state.lang,
      currentStep: state.currentStep
    }));
  } catch (e) {}
}

function isLoggedIn() {
  return !!(state.user && state.user.aadhar);
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}
