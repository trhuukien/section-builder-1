function hideProductModal() {
  const productModal = document.querySelectorAll('product-modal[open]');
  productModal && productModal.forEach((modal) => modal.hide());
}

document.addEventListener('shopify:block:select', function (event) {
  hideProductModal();
  const blockSelectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockSelectedIsSlide) return;

  const parentSlideshowComponent = event.target.closest('slideshow-component');
  parentSlideshowComponent.pause();

  setTimeout(function () {
    parentSlideshowComponent.slider.scrollTo({
      left: event.target.offsetLeft,
    });
  }, 200);
});

document.addEventListener('shopify:block:deselect', function (event) {
  const blockDeselectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockDeselectedIsSlide) return;
  const parentSlideshowComponent = event.target.closest('slideshow-component');
  if (parentSlideshowComponent.autoplayButtonIsSetToPlay) parentSlideshowComponent.play();
});

document.addEventListener('shopify:section:load', () => {
  hideProductModal();
  const zoomOnHoverScript = document.querySelector('[id^=EnableZoomOnHover]');
  if (!zoomOnHoverScript) return;
  if (zoomOnHoverScript) {
    const newScriptTag = document.createElement('script');
    newScriptTag.src = zoomOnHoverScript.src;
    zoomOnHoverScript.parentNode.replaceChild(newScriptTag, zoomOnHoverScript);
  }
});

document.addEventListener('shopify:section:reorder', () => hideProductModal());

document.addEventListener('shopify:section:select', () => hideProductModal());

document.addEventListener('shopify:section:deselect', () => hideProductModal());

document.addEventListener('shopify:inspector:activate', () => hideProductModal());

document.addEventListener('shopify:inspector:deactivate', () => hideProductModal());

//add eurus theme-editor.js
document.addEventListener('shopify:block:select', function(event) {
  const blockSelected = event.target.classList;
  /* start slideshow.liquid */
  if (event.target.classList.contains('x-splide-slide')) {
    const slideshow = event.target.closest('.x-splide');
    let count = 0;

    let i = setInterval(function () {
      count++;

      if (slideshow.splide) {
        const index = event.target.getAttribute('x-slide-index');
        if (index) {
          slideshow.splide.go(parseInt(index));
        }

        if (!slideshow.splide.Components.Autoplay.isPaused()) {
          slideshow.splide.Components.Autoplay.pause();
          slideshow.splide.theme_editor_paused = true;
        }

        clearInterval(i);
      }
      
      if (count > 10) {
        clearInterval(i);
      }
    }, 200);
  }
  /* end slideshow.liquid */
  /* start shop the look */
  if (event.target.classList.contains('x-hotspot')) {
    let splideEl = document.getElementById('x-product-shop-look-' + event.detail.sectionId);
    const index = parseInt(event.target.attributes.index.value);
    setTimeout(() => {
      splideEl.splide.go(index - 1);
    }, 300);
  }
  /* end shop the look */
  /* start mobile-navigation.liquid */
  if (blockSelected.contains('block-mobile-navigation')) {
    if (window.Alpine) {
      Alpine.store('xMobileNav').resetMenu();
      Alpine.store('xMobileNav').open();
    } else {
      document.addEventListener('alpine:initialized', () => {
        Alpine.store('xMobileNav').resetMenu();
        Alpine.store('xMobileNav').open();
      });
    }
  }
  /* end mobile-navigation.liquid */

  /* start quick-view.liquid */
  if (event.detail.sectionId.includes('quick-view')) {
    if (window.Alpine && Alpine.store('xQuickView')) {
      Alpine.store('xQuickView').show = true;
      Alpine.store('xQuickView').selected = true;
      Alpine.store('xPopup').open = true;
    } else {
      document.addEventListener('alpine:initialized', () => {
        if (Alpine.store('xQuickView')) {
          Alpine.store('xQuickView').show = true;
          Alpine.store('xQuickView').selected = true;
          Alpine.store('xPopup').open = true;
        }
      });
    }
  } 
  /* end quick-view.liquid */

  /* start featured-collection.liquid */
  if (blockSelected.contains('collection-title')) {
    event.target.click();
  }
  /* end featured-collection.liquid */
});

document.addEventListener('shopify:block:deselect', function(event) {
  /* start slideshow.liquid */
  if (event.target.classList.contains('x-splide-slide')) {
    const slideshow = event.target.closest('.x-splide');
    if (slideshow.splide.theme_editor_paused) {
      slideshow.splide.Components.Autoplay.play();
    }
  }
  /* end slideshow.liquid */
});

document.addEventListener('shopify:section:select', function(event) {
  const sectionSelected = event.target.classList;
  /* start quick-view.liquid */
  if (event.target.id.includes('quick-view')) {
    if (window.Alpine && Alpine.store('xQuickView')) {
      Alpine.store('xQuickView').show = true;
      Alpine.store('xQuickView').selected = true;
      Alpine.store('xPopup').open = true;
    } else {
      document.addEventListener('alpine:initialized', () => {
        if (Alpine.store('xQuickView')) {
          Alpine.store('xQuickView').show = true;
          Alpine.store('xQuickView').selected = true;
          Alpine.store('xPopup').open = true;
        }
      });
    }
  } else {
    if (window.Alpine && Alpine.store('xQuickView')) {
      if (Alpine.store('xQuickView').show) {
        Alpine.store('xQuickView').show = false;
      }

      Alpine.store('xQuickView').selected = false;
      Alpine.store('xPopup').open = false;
    } else {
      document.addEventListener('alpine:initialized', () => {
        if (Alpine.store('xQuickView')) {
          if (Alpine.store('xQuickView').show) {
            Alpine.store('xQuickView').show = false;
          }

          Alpine.store('xQuickView').selected = false;
          Alpine.store('xPopup').open = false;
        }
      });
    }
  }
  /* end quick-view.liquid */

  /* start cookie-banner.liquid */
  if (event.target.id.includes('cookie-banner')) {
    if (window.Alpine) {
      Alpine.store('xShowCookieBanner').show = true;
    } else {
      document.addEventListener('alpine:initialized', () => {
        Alpine.store('xShowCookieBanner').show = true;
      });
    }
  }
  /* end cookie-banner.liquid */

  /* start mobile-navigation.liquid */
  if (sectionSelected.contains('section-mobile-navigation')) {
    if (window.Alpine) {
      Alpine.store('xMobileNav').resetMenu();
      Alpine.store('xMobileNav').open();
    } else {
      document.addEventListener('alpine:initialized', () => {
        Alpine.store('xMobileNav').resetMenu();
        Alpine.store('xMobileNav').open();
      });
    }
  } else {
    if (window.Alpine) {
      Alpine.store('xMobileNav').close();
    } else {
      document.addEventListener('alpine:initialized', () => {
        Alpine.store('xMobileNav').close();
      });
    }
  }
  /* end mobile-navigation.liquid */
})

document.addEventListener('shopify:section:select', function(event) {
  /* start cookie-banner.liquid */
  if (event.target.id == 'shopify-section-cookie-banner') {
    if (window.Alpine) {
      Alpine.store('xShowCookieBanner').show = true;
    } else {
      document.addEventListener('alpine:initialized', () => {
        Alpine.store('xShowCookieBanner').show = true;
      });
    }
  }
  /* end cookie-banner.liquid */
})

document.addEventListener('shopify:section:deselect', function(event) {
   /* start cookie-banner.liquid */
  if (event.target.id.includes('cookie-banner')) {
    if (window.Alpine) {
      Alpine.store('xShowCookieBanner').show = false;
    } else {
      document.addEventListener('alpine:initialized', () => {
        Alpine.store('xShowCookieBanner').show = false;
      });
    }
  }
  /* end cookie-banner.liquid */
})

document.addEventListener("DOMContentLoaded", (event) => {
   localStorage.setItem("section-age-verification-popup", JSON.stringify(false));
   localStorage.setItem("section-promotion-popup", JSON.stringify(false));
});