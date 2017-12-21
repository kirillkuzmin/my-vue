const clickOutside = Vue.directive('click-outside', {
  bind (el, binding) {
    const bubble = binding.modifiers.bubble;

    const handler = e => {
      if (bubble || (!el.contains(e.target) && el !== e.target)) {
        binding.value(e);
      }
    };

    document.addEventListener('click', handler);
  },
});

export default clickOutside;
