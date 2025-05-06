import { DOM } from "./dom.js";
import { toggleImageView } from "./handlers.js";

function setupImageListeners() {
  if (DOM.aboutMeImg) {
    DOM.aboutMeImg.addEventListener("click", () =>
      toggleImageView(DOM.aboutMeImg)
    );
  }

  if (DOM.favoritesImg) {
    DOM.favoritesImg.addEventListener("click", () =>
      toggleImageView(DOM.favoritesImg)
    );
  }
}

export { setupImageListeners };
